import { useOrder } from "@/contexts/OrderContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, CheckCircle, User, ChevronDown, ChevronUp, Clock, UtensilsCrossed, ClipboardList, StickyNote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useMenuAccess } from "@/contexts/MenuAccessContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@shared/schema";
import { formatTableNumber } from "@/lib/table";
import ItemNoteModal from "@/components/item-note-modal";

function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  // For multi-price strings like "200|400|600" take the first value
  const first = String(price).split("|")[0].replace(/[^\d.]/g, "");
  return parseFloat(first) || 0;
}

export default function OrderSidebar() {
  const { orderItems, removeFromOrder, updateQuantity, updateNote, clearOrder, isOpen, closeSidebar } = useOrder();
  const [noteItemId, setNoteItemId] = useState<string | null>(null);
  const { customer, clearCustomer } = useCustomer();
  const access = useMenuAccess();
  const { isDark } = useTheme();
  const [placing, setPlacing] = useState(false);
  const queryClient = useQueryClient();
  const [placed, setPlaced] = useState(false);
  const [note, setNote] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch POS settings (tax rate, service charge)
  const { data: posSettings } = useQuery<{ taxRate: number; serviceCharge: number; gstEnabled: boolean; gstNumber: string }>({
    queryKey: ["/api/pos-settings"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  // Mark an ongoing order as completed
  const markDoneMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders/by-phone", customer?.phone] });
    },
  });

  // Fetch past orders for this customer
  const { data: pastOrders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-phone", customer?.phone],
    queryFn: async () => {
      if (!customer?.phone) return [];
      const res = await fetch(`/api/orders/by-phone/${customer.phone}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!customer?.phone && profileOpen,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
    gcTime: 0,
  });

  const { data: tableOrders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-table", access.tableName, access.floorName],
    queryFn: async () => {
      if (!access.tableName) return [];
      const params = new URLSearchParams({
        tableId: access.tableName,
        floorId: access.floorName || "Ground Floor",
      });
      const res = await fetch(`/api/orders/by-table?${params}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!access.tableName,
    staleTime: 0,
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
    gcTime: 0,
  });

  // A completed table order disappears from the shared active-order query.
  // Only reset after this session has actually observed an order, so a fresh
  // QR scan with an empty table is not immediately treated as expired.
  const hadActiveTableOrder = useRef(false);
  useEffect(() => {
    if (!access.tableName) {
      hadActiveTableOrder.current = false;
      return;
    }
    if (tableOrders.length > 0) {
      hadActiveTableOrder.current = true;
      return;
    }
    if (hadActiveTableOrder.current) {
      hadActiveTableOrder.current = false;
      clearCustomer();
      closeSidebar();
      access.reset();
    }
  }, [tableOrders, access.tableName, clearCustomer, closeSidebar, access.reset]);

  const subtotal = orderItems.reduce((sum, l) => sum + parsePrice(l.item.price) * l.quantity, 0);
  const taxRate = posSettings?.taxRate ?? 0;
  const serviceChargeRate = posSettings?.serviceCharge ?? 0;
  const gstEnabled = posSettings?.gstEnabled ?? false;
  const taxAmount = gstEnabled ? Math.round(subtotal * taxRate / 100) : 0;
  const cgst = gstEnabled ? Math.round(taxAmount / 2) : 0;
  const sgst = gstEnabled ? taxAmount - cgst : 0;
  const serviceChargeAmount = serviceChargeRate > 0 ? Math.round(subtotal * serviceChargeRate / 100) : 0;
  const total = subtotal + taxAmount + serviceChargeAmount;
  const activeOrders = tableOrders.filter(o => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return o.status !== "completed" &&
      o.status !== "cancelled" &&
      new Date(o.createdAt) >= todayStart &&
      (!access.tableName || o.tableId === access.tableName) &&
      (!access.floorName || o.floorId === access.floorName);
  });
  const hasOngoingOrders = activeOrders.length > 0;
  const ongoingSubtotal = activeOrders.reduce((sum, order) =>
    sum + order.items.reduce((orderSum, item) => orderSum + parsePrice(item.price) * item.quantity, 0), 0);
  const combinedSubtotal = ongoingSubtotal + subtotal;
  const combinedTaxAmount = gstEnabled ? Math.round(combinedSubtotal * taxRate / 100) : 0;
  const combinedCgst = Math.round(combinedTaxAmount / 2);
  const combinedSgst = combinedTaxAmount - combinedCgst;
  const combinedServiceCharge = Math.round(combinedSubtotal * serviceChargeRate / 100);
  const combinedTotal = activeOrders.reduce((sum, order) => sum + order.total, 0) + total;

  async function handlePlaceOrder() {
    if (orderItems.length === 0) return;
    setPlacing(true);
    try {
      const body = {
        tableId: access.tableName || "Table1",
        floorId: access.floorName || "Ground Floor",
        orderType: "dine-in",
        items: orderItems.map(l => ({
          name: l.item.name,
          price: l.item.price,
          quantity: l.quantity,
          category: l.item.category || "",
          isVeg: l.item.isVeg ?? true,
          notes: l.note || null,
        })),
        total,
        status: "pending",
        paymentStatus: "pending",
        paymentMode: null,
        ...(note.trim() ? { note: note.trim() } : {}),
        ...(customer ? { customerName: customer.name, customerPhone: customer.phone } : {}),
        mergeExisting: hasOngoingOrders,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to place order");
      setPlaced(true);
      setNote("");
      clearOrder();
      setTimeout(() => {
        setPlaced(false);
      }, 2200);
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full min-h-0 z-50 flex flex-col shadow-2xl"
            style={{
              width: "min(380px, 100vw)",
              background: isDark ? "#0f0f0f" : "#FDFAF4",
              borderLeft: `1px solid var(--bb-border)`,
            }}
          >
            {/* Header */}
            <div style={{ borderBottom: "1px solid var(--bb-border)" }}>
              {/* Title row */}
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <ClipboardList size={20} style={{ color: "var(--bb-gold)" }} />
                  <span
                    className="text-lg font-bold uppercase tracking-wider"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Your Order
                  </span>
                </div>
                <button onClick={closeSidebar} style={{ color: "var(--bb-text-dim)" }}>
                  <X size={22} />
                </button>
              </div>

              {/* Table + order summary strip */}
              <div
                className="mx-4 mb-3 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3"
                style={{
                  background: isDark ? "#1a1a1a" : "#fff8ee",
                  border: "1px solid var(--bb-gold)",
                }}
              >
                {/* Table badge */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <UtensilsCrossed size={15} style={{ color: "var(--bb-gold)" }} />
                  <span
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {access.tableName || "Table1"}
                  </span>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 28, background: "var(--bb-border)", flexShrink: 0 }} />

                {/* Current order summary */}
                {orderItems.length === 0 ? (
                  <span className="text-xs flex-1 text-right" style={{ color: "var(--bb-text-dim)" }}>
                    No items yet
                  </span>
                ) : (
                  <div className="flex-1 min-w-0 text-right">
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--bb-text)", fontFamily: "'DM Sans', sans-serif" }}
                      title={orderItems.map(l => `${l.item.name} ×${l.quantity}`).join(", ")}
                    >
                      {orderItems.map(l => `${l.item.name} ×${l.quantity}`).join(", ")}
                    </p>
                    <p
                      className="text-sm font-bold mt-0.5"
                      style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      ₹{total.toFixed(0)} · {orderItems.reduce((s, l) => s + l.quantity, 0)} item{orderItems.reduce((s, l) => s + l.quantity, 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Profile */}
            {customer && (
              <div
                style={{
                  borderBottom: "1px solid var(--bb-border)",
                  background: isDark ? "#141414" : "#f9f4ea",
                }}
              >
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="w-full flex items-center gap-3 px-5 py-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--bb-gold)" }}
                  >
                    <User size={15} color="#fff" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {customer.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                      {customer.phone}
                    </p>
                  </div>
                  {profileOpen ? (
                    <ChevronUp size={16} style={{ color: "var(--bb-text-dim)" }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "var(--bb-text-dim)" }} />
                  )}
                </button>

              </div>
            )}

            {/* ── Ongoing orders — always visible ── */}
            {customer && (() => {
              const todayStart = new Date();
              todayStart.setHours(0, 0, 0, 0);
              const ongoing = tableOrders.filter(o =>
                o.status !== "completed" &&
                o.status !== "cancelled" &&
                new Date(o.createdAt) >= todayStart &&
                (!access.tableName || o.tableId === access.tableName) &&
                (!access.floorName || o.floorId === access.floorName)
              );
              if (ongoing.length === 0) return null;
              return (
                <div
                  className="px-4 py-3 space-y-2"
                  style={{ borderBottom: "1px solid var(--bb-border)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#E49B1D" }}>
                    Ongoing Orders
                  </p>
                  {(() => {
                    const allItems = [
                      ...ongoing.flatMap(order => order.items.map(item => ({ ...item, isNew: false, id: undefined }))),
                      ...orderItems.map(line => ({
                        name: line.item.name,
                        price: line.item.price,
                        quantity: line.quantity,
                        isNew: true,
                        id: line.item._id?.toString() ?? "",
                        note: line.note,
                      })),
                    ];
                    const orderSubtotal = allItems.reduce((sum, item) =>
                      sum + parsePrice(item.price) * item.quantity, 0);
                    const orderTax = gstEnabled ? Math.round(orderSubtotal * taxRate / 100) : 0;
                    const orderCgst = Math.round(orderTax / 2);
                    const orderSgst = orderTax - orderCgst;
                    const orderService = Math.round(orderSubtotal * serviceChargeRate / 100);
                    const orderTotal = ongoing.reduce((sum, order) => sum + order.total, 0) + total;
                    return (
                    <div
                      key="combined-ongoing-order"
                      className="rounded-lg p-3 space-y-2"
                      style={{ background: isDark ? "#1a1a1a" : "#fff", border: "1.5px solid #E49B1D" }}
                    >
                      {/* All active orders for this table share one card. */}
                      {/* Items table */}
                      <div className="pt-1" style={{ borderTop: "1px solid var(--bb-border)" }}>
                        {/* Header */}
                        <div className="grid text-[10px] font-semibold uppercase tracking-wide mb-1 pb-1" style={{ gridTemplateColumns: "1fr auto auto", gap: "0 8px", borderBottom: "1px dashed var(--bb-border)", color: "var(--bb-text-dim)" }}>
                          <span>Item</span>
                          <span className="text-center">Qty</span>
                          <span className="text-right">Price</span>
                        </div>
                        {/* Rows */}
                        {allItems.map((item, idx) => {
                          const unit = parsePrice(item.price);
                          return (
                            <div
                              key={idx}
                              className="grid text-xs py-1.5 items-center rounded-md px-1"
                              style={{
                                gridTemplateColumns: "1fr auto auto",
                                gap: "0 8px",
                                background: item.isNew ? (isDark ? "rgba(228,155,29,0.18)" : "rgba(228,155,29,0.16)") : "transparent",
                                border: item.isNew ? "1px solid rgba(228,155,29,0.55)" : "1px solid transparent",
                              }}
                            >
                              <span style={{ color: "var(--bb-text)", wordBreak: "break-word", lineHeight: 1.3 }}>{item.name}</span>
                              {item.isNew ? (
                                <div className="flex items-center gap-1">
                                  <button onClick={() => updateQuantity(item.id!, item.quantity - 1)} className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--bb-border)", color: "var(--bb-gold)" }}><Minus size={10} /></button>
                                  <span className="text-center font-medium w-4" style={{ color: "var(--bb-text-dim)" }}>{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id!, item.quantity + 1)} className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--bb-border)", color: "var(--bb-gold)" }}><Plus size={10} /></button>
                                  <button onClick={() => setNoteItemId(item.id!)} className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--bb-border)", color: "var(--bb-gold)" }} title={item.note ? "Edit note" : "Add note"}><StickyNote size={10} /></button>
                                </div>
                              ) : (
                                <span className="text-center font-medium flex-shrink-0" style={{ color: "var(--bb-text-dim)" }}>×{item.quantity}</span>
                              )}
                              <span className="text-right font-semibold flex-shrink-0" style={{ color: "var(--bb-gold)" }}>₹{(unit * item.quantity).toFixed(0)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* Order items */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3">
              {placed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-4"
                >
                  <CheckCircle size={60} style={{ color: "var(--bb-gold)" }} />
                  <p
                    className="text-xl font-bold text-center"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Order Placed!
                  </p>
                  <p style={{ color: "var(--bb-text-dim)", textAlign: "center", fontSize: "0.9rem" }}>
                    Your order has been sent to the kitchen.
                  </p>
                </motion.div>
              ) : hasOngoingOrders ? (
                <div className="h-full" />
              ) : orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                  <ClipboardList size={48} style={{ color: "var(--bb-gold)" }} />
                  <p style={{ color: "var(--bb-text)", fontFamily: "'DM Sans', sans-serif" }}>
                    No items added yet
                  </p>
                </div>
              ) : (
                orderItems.map(({ item, quantity, note: itemNote }) => {
                  const id = item._id?.toString() ?? "";
                  const unitPrice = parsePrice(item.price);
                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{
                        background: isDark ? "#1a1a1a" : "#fff",
                        border: "1px solid var(--bb-border)",
                      }}
                    >
                      {/* Veg dot */}
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {/* Name & price */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold uppercase"
                          style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif", wordBreak: "break-word", overflowWrap: "break-word" }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--bb-text-dim)" }}
                        >
                          ₹{unitPrice} × {quantity} = ₹{(unitPrice * quantity).toFixed(0)}
                        </p>
                        {itemNote && (
                          <p className="text-xs italic mt-0.5" style={{ color: "var(--bb-text-dim)", wordBreak: "break-word" }}>
                            Note: {itemNote}
                          </p>
                        )}
                      </div>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(id, quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ border: "1px solid var(--bb-border)", color: "var(--bb-gold)" }}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="w-6 text-center text-sm font-bold"
                          style={{ color: "var(--bb-text)" }}
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(id, quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ border: "1px solid var(--bb-border)", color: "var(--bb-gold)" }}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => setNoteItemId(id)}
                          className="relative w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ border: "1px solid var(--bb-border)", color: "var(--bb-gold)" }}
                          aria-label={itemNote ? "Edit note for this item" : "Add a note for this item"}
                          data-testid={`button-sidebar-note-${id}`}
                        >
                          <StickyNote size={12} />
                          {itemNote && (
                            <span
                              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                              style={{ background: "#E63946" }}
                            />
                          )}
                        </button>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeFromOrder(id)}
                        style={{ color: "var(--bb-text-dim)" }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {!placed && (orderItems.length > 0 || hasOngoingOrders) && (() => {
              const totals = hasOngoingOrders
                ? { subtotal: combinedSubtotal, taxAmount: combinedTaxAmount, cgst: combinedCgst, sgst: combinedSgst, serviceChargeAmount: combinedServiceCharge, total: combinedTotal, taxRate, serviceChargeRate, gstEnabled }
                : { subtotal, taxAmount, cgst, sgst, serviceChargeAmount, total, taxRate, serviceChargeRate, gstEnabled };
              return (
              <div
                className="px-5 py-4 space-y-2"
                style={{ borderTop: "1px solid var(--bb-border)" }}
              >
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>Subtotal</span>
                  <span className="text-xs font-medium" style={{ color: "var(--bb-text)" }}>₹{totals.subtotal.toFixed(0)}</span>
                </div>
                {/* GST breakdown */}
                {totals.gstEnabled && totals.taxAmount > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                        CGST ({(totals.taxRate / 2).toFixed(1)}%)
                      </span>
                      <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>₹{totals.cgst}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                        SGST ({(totals.taxRate / 2).toFixed(1)}%)
                      </span>
                      <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>₹{totals.sgst}</span>
                    </div>
                  </>
                )}
                {/* Service Charge */}
                {totals.serviceChargeAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                      Service Charge ({totals.serviceChargeRate}%)
                    </span>
                    <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>₹{totals.serviceChargeAmount}</span>
                  </div>
                )}
                {/* Divider */}
                <div style={{ borderTop: "1px dashed var(--bb-border)", marginTop: 4 }} />
                {/* Grand Total */}
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-sm font-bold" style={{ color: "var(--bb-text)" }}>Total</span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ₹{totals.total.toFixed(0)}
                  </span>
                </div>
                {orderItems.length > 0 && (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-opacity disabled:opacity-60"
                    style={{
                      background: "var(--bb-gold)",
                      color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {placing ? "Placing…" : "Place Order"}
                  </button>
                )}
              </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
      {noteItemId && (() => {
        const line = orderItems.find(l => l.item._id?.toString() === noteItemId);
        if (!line) return null;
        return (
          <ItemNoteModal
            itemName={line.item.name}
            initialNote={line.note ?? ""}
            onClose={() => setNoteItemId(null)}
            onSave={(n) => updateNote(noteItemId, n)}
          />
        );
      })()}
    </>
  );
}
