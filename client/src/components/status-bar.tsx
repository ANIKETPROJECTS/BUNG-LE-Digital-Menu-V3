import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import { useTheme } from "@/contexts/ThemeContext";
import { formatTableNumber } from "@/lib/table";
import { getStatusDisplay } from "@/lib/order-status";
import type { Order } from "@shared/schema";

// A slim strip shown below the page header that surfaces the current
// table/order status — mirrors the POS "Status / Table / Floor" bar.
export default function StatusBar() {
  const { customer } = useCustomer();
  const { isDark } = useTheme();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-phone", customer?.phone],
    queryFn: async () => {
      if (!customer?.phone) return [];
      const res = await fetch(`/api/orders/by-phone/${customer.phone}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!customer?.phone,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const ongoing = orders
    .filter((o) =>
      o.status !== "completed" &&
      o.status !== "cancelled" &&
      new Date(o.createdAt) >= todayStart
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latest = ongoing[0];

  const { label, color } = getStatusDisplay(latest?.status);
  const tableNumber = latest ? formatTableNumber(latest.tableId) : null;
  const floorId = latest?.floorId || null;

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap px-3 py-1.5"
      style={{
        borderBottom: "1px solid var(--bb-border)",
        background: isDark ? "#0a0a0a" : "#faf7f0",
      }}
      data-testid="status-bar"
    >
      {tableNumber && (
        <>
          <span style={{ color: "var(--bb-border)" }}>|</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--bb-text-dim)" }}>
            Table:{" "}
            <span className="font-semibold" style={{ color: "var(--bb-gold)" }}>
              {tableNumber}
            </span>
          </span>
        </>
      )}
      {floorId && (
        <>
          <span style={{ color: "var(--bb-border)" }}>|</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--bb-text-dim)" }}>
            Floor:{" "}
            <span className="font-semibold" style={{ color: "var(--bb-gold)" }}>
              {floorId}
            </span>
          </span>
        </>
      )}
    </div>
  );
}
