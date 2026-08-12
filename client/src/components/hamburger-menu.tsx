import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Copy, Check, ExternalLink, Utensils, Users, UserRound, ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { useMenuAccess } from "@/contexts/MenuAccessContext";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { MenuCategory, PaymentDetails, RestaurantInfo, SocialLinks } from "@shared/schema";
import Lottie from "lottie-react";
// @ts-ignore
import confirmationAnimation from "@assets/Confirmation_1773569485933.json";
const gpayLogo = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093086/tarang-assets/_Pngtree_google_pay_payment_icon_vector_12256719__1__1776885948872.png";
const phonepeLogo = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093082/tarang-assets/phonepe__1__1776885988742.png";
const paytmLogo = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093082/tarang-assets/paytm__1__1776886022894.png";
const mapsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093082/tarang-assets/logo__1__1773390711534.png";
const callImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092681/tarang-assets/call_1773390891033.png";
const clockImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/clock_1773568902929.png";
const instaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093081/tarang-assets/instagram__2__1773345405292.png";
const fbImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092684/tarang-assets/facebook__2__1773345408410.png";
const ytImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093085/tarang-assets/youtube_1773345412112.png";
const whatsappImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092680/tarang-assets/apple_1773515172898.png";
const reservationImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092681/tarang-assets/booking__1__1776693914078.png";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (categoryId: string) => void;
}

const PHONE = "+91 9619523254";

const TIME_SLOTS = [
  "11:00 AM – 12:30 PM",
  "12:30 PM – 02:00 PM",
  "02:00 PM – 03:30 PM",
  "03:30 PM – 05:00 PM",
  "05:00 PM – 06:30 PM",
  "06:30 PM – 08:00 PM",
  "08:00 PM – 09:30 PM",
  "09:30 PM – 11:00 PM",
];

export function ReservationModal({ onClose }: { onClose: () => void }) {
  const { isDark } = useTheme();
  const { customer } = useCustomer();
  const access = useMenuAccess();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [guests, setGuests] = useState("2");
  const [occasion, setOccasion] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const reservationMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; date: string; timeSlot: string; guests: string; occasion?: string }) => {
      return await apiRequest("POST", "/api/reservations", data);
    },
    onSuccess: () => {
      setConfirmed(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !timeSlot) return;
    reservationMutation.mutate({ name, phone, date, timeSlot, guests, ...(occasion ? { occasion } : {}) });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full sm:max-w-sm mx-0 sm:mx-4 rounded-t-3xl overflow-hidden"
        style={{
          background: isDark ? "linear-gradient(160deg, #1C1500 0%, #0F0C00 100%)" : "#FFFFFF",
          border: isDark ? "1.5px solid rgba(228,155,29,0.4)" : "1.5px solid rgba(228,155,29,0.5)",
          boxShadow: isDark ? "0 0 60px rgba(228,155,29,0.12), 0 24px 64px rgba(0,0,0,0.7)" : "0 0 40px rgba(228,155,29,0.12), 0 24px 64px rgba(0,0,0,0.15)",
          maxHeight: "92dvh",
          overflowY: "auto",
        }}
        initial={{ y: "100%", opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 1 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
      >
        {/* Gold shimmer top bar */}
        <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent, #E49B1D, #F0CC60, #E49B1D, transparent)" }} />

        {!confirmed ? (
          <div className="p-5 pb-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(228,155,29,0.1)", border: "1px solid rgba(228,155,29,0.25)", color: "#E49B1D" }}
              data-testid="button-close-reservation"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <img src={reservationImg} alt="Reservation" className="w-12 h-12 object-contain flex-shrink-0 rounded-xl" />
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-0.5" style={{ color: "rgba(228,155,29,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                  Make a Reservation
                </p>
                <h3 className="text-lg font-black leading-tight" style={{ color: "#E49B1D", fontFamily: "'Cormorant Garamond', serif" }}>
                  Book Your Table
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: isDark ? "#B8986A" : "#8B6200" }}>
                  Your Name *
                </label>
                <div className="flex items-center rounded-xl px-4 h-11" style={{ background: isDark ? "rgba(228,155,29,0.07)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.3)" : "1px solid rgba(0,0,0,0.15)" }}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-transparent outline-none text-sm font-light"
                    style={{ color: isDark ? "#E8D8B4" : "#1a1a1a", caretColor: "#E49B1D" }}
                    data-testid="input-reservation-name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: isDark ? "#B8986A" : "#8B6200" }}>
                  Contact Number *
                </label>
                <div className="flex items-center rounded-xl px-4 h-11" style={{ background: isDark ? "rgba(228,155,29,0.07)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.3)" : "1px solid rgba(0,0,0,0.15)" }}>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                    placeholder="+91 XXXXX XXXXX"
                    maxLength={10}
                    inputMode="numeric"
                    required
                    className="w-full bg-transparent outline-none text-sm font-light"
                    style={{ color: isDark ? "#E8D8B4" : "#1a1a1a", caretColor: "#E49B1D" }}
                    data-testid="input-reservation-phone"
                  />
                </div>
              </div>

              {/* Date + Guests row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: isDark ? "#B8986A" : "#8B6200" }}>
                    Date *
                  </label>
                  <div className="flex items-center rounded-xl px-4 h-11" style={{ background: isDark ? "rgba(228,155,29,0.07)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.3)" : "1px solid rgba(0,0,0,0.15)" }}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-transparent outline-none text-sm font-light"
                      style={{ color: isDark ? "#E8D8B4" : "#1a1a1a", caretColor: "#E49B1D", colorScheme: isDark ? "dark" : "light" }}
                      data-testid="input-reservation-date"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: isDark ? "#B8986A" : "#8B6200" }}>
                    Guests *
                  </label>
                  <div className="relative flex items-center rounded-xl px-4 h-11" style={{ background: isDark ? "rgba(228,155,29,0.07)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.3)" : "1px solid rgba(0,0,0,0.15)" }}>
                    <Users className="w-3.5 h-3.5 mr-2 flex-shrink-0" style={{ color: isDark ? "rgba(228,155,29,0.5)" : "#8B6200" }} />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm font-light appearance-none"
                      style={{ color: isDark ? "#E8D8B4" : "#1a1a1a" }}
                      data-testid="select-reservation-guests"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <option key={n} value={String(n)} style={{ background: isDark ? "#1C1500" : "#FFFFFF", color: isDark ? "#E8D8B4" : "#1a1a1a" }}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none" style={{ color: isDark ? "rgba(228,155,29,0.5)" : "#8B6200" }} />
                  </div>
                </div>
              </div>

              {/* Time Slot */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: isDark ? "#B8986A" : "#8B6200" }}>
                  Time Slot *
                </label>
                <div className="relative flex items-center rounded-xl px-4 h-11" style={{ background: isDark ? "rgba(228,155,29,0.07)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.3)" : "1px solid rgba(0,0,0,0.15)" }}>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none text-sm font-light appearance-none"
                    style={{ color: timeSlot ? (isDark ? "#E8D8B4" : "#1a1a1a") : (isDark ? "rgba(232,216,180,0.35)" : "rgba(0,0,0,0.35)") }}
                    data-testid="select-reservation-timeslot"
                  >
                    <option value="" disabled style={{ background: isDark ? "#1C1500" : "#FFFFFF", color: isDark ? "#E8D8B4" : "#1a1a1a" }}>Select a time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} style={{ background: isDark ? "#1C1500" : "#FFFFFF", color: isDark ? "#E8D8B4" : "#1a1a1a" }}>{slot}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none" style={{ color: isDark ? "rgba(228,155,29,0.5)" : "#8B6200" }} />
                </div>
              </div>

              {/* Occasion (optional) */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: isDark ? "#B8986A" : "#8B6200" }}>
                  Occasion <span style={{ color: isDark ? "rgba(180,160,100,0.5)" : "rgba(0,0,0,0.35)" }}>(Optional)</span>
                </label>
                <div className="flex items-center rounded-xl px-4 h-11" style={{ background: isDark ? "rgba(228,155,29,0.07)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.3)" : "1px solid rgba(0,0,0,0.15)" }}>
                  <input
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="Birthday, Anniversary, Business..."
                    className="w-full bg-transparent outline-none text-sm font-light"
                    style={{ color: isDark ? "#E8D8B4" : "#1a1a1a", caretColor: "#E49B1D" }}
                    data-testid="input-reservation-occasion"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={reservationMutation.isPending || !name || !phone || !date || !timeSlot}
                className="w-full h-12 rounded-full font-bold tracking-widest text-sm transition-all active:scale-95 disabled:opacity-40 mt-2"
                style={{
                  background: "linear-gradient(90deg, #E49B1D, #E6C55A)",
                  color: "#1C1500",
                  letterSpacing: "0.15em",
                  boxShadow: "0 4px 20px rgba(228,155,29,0.3)",
                }}
                data-testid="button-confirm-reservation"
              >
                {reservationMutation.isPending ? "RESERVING..." : "CONFIRM RESERVATION"}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation screen */
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <Lottie
              animationData={confirmationAnimation}
              loop={false}
              autoplay
              style={{ width: 180, height: 144 }}
            />
            <h3
              className="text-2xl font-black mt-2"
              style={{ color: "#E49B1D", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Reservation Confirmed!
            </h3>
            <p className="text-sm mt-2 font-light" style={{ color: isDark ? "rgba(220,212,200,0.7)" : "rgba(0,0,0,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
              We're looking forward to hosting you, <span style={{ color: isDark ? "#E8D8B4" : "#1a1a1a", fontWeight: 600 }}>{name}</span>.
            </p>
            <div className="w-full mt-5 rounded-2xl p-4 space-y-2" style={{ background: "rgba(228,155,29,0.07)", border: "1px solid rgba(228,155,29,0.2)" }}>
              {[
                { label: "Date", value: new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                { label: "Time", value: timeSlot },
                { label: "Guests", value: `${guests} ${Number(guests) === 1 ? "Guest" : "Guests"}` },
                ...(occasion ? [{ label: "Occasion", value: occasion }] : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-widest" style={{ color: "rgba(228,155,29,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{row.label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: isDark ? "#E8D8B4" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-4" style={{ color: isDark ? "rgba(220,212,200,0.4)" : "rgba(0,0,0,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              Our team will contact you on <span style={{ color: "#E49B1D" }}>{phone}</span> to confirm.
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-8 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
              style={{ background: "linear-gradient(90deg, #E49B1D, #E6C55A)", color: "#1C1500" }}
              data-testid="button-close-confirmation"
            >
              Done
            </button>
          </div>
        )}
        <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #E49B1D, transparent)" }} />
      </motion.div>
    </motion.div>
  );
}

export default function HamburgerMenu({
  isOpen,
  onClose,
  onCategoryClick,
}: HamburgerMenuProps) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { customer } = useCustomer();
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  const { data: menuCategories = [] } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });

  const { data: paymentDetails } = useQuery<PaymentDetails>({
    queryKey: ["/api/payment-details"],
  });

  const { data: restaurantInfo } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  const { data: socialLinks } = useQuery<SocialLinks>({
    queryKey: ["/api/social-links"],
  });

  const upiId = paymentDetails?.upiId || "";

  const resolveLink = (linkKey?: string): string | undefined => {
    if (!linkKey || !socialLinks) return undefined;
    return (socialLinks as any)[linkKey];
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId);
    onClose();
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).catch(() => {});
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-50 overflow-y-auto"
            style={{ background: isDark ? "linear-gradient(160deg, #1C1500 0%, #0A0800 100%)" : "#FFFFFF" }}
          >
            {/* Gold shimmer top bar */}
            <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent, #E49B1D, #F0CC60, #E49B1D, transparent)" }} />

            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
              style={{ background: isDark ? "linear-gradient(180deg, #1C1500 80%, transparent)" : "#FFFFFF", borderBottom: "1px solid rgba(228,155,29,0.2)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #E49B1D, #E6C55A)" }} />
                <h2 className="text-base font-black tracking-[0.25em] uppercase" style={{ color: "#E49B1D", fontFamily: "'DM Sans', sans-serif" }}>
                  {t.menuCategories}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{ background: "rgba(228,155,29,0.1)", border: "1px solid rgba(228,155,29,0.3)", color: "#E49B1D" }}
                data-testid="button-close-menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 pb-10 space-y-5 pt-3">

              {/* ── Category Grid ── */}
              <div className="grid grid-cols-2 gap-2.5">
                {menuCategories.map((category, index) => {
                  const label = category.title;
                  return (
                    <motion.button
                      key={category.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCategoryClick(category.id)}
                      className="relative p-4 rounded-2xl text-left transition-all duration-200 overflow-hidden"
                      style={{ background: isDark ? "rgba(228,155,29,0.06)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.22)" : "1px solid rgba(0,0,0,0.1)" }}
                      data-testid={`button-category-${category.id}`}
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, #E49B1D, #E6C55A)" }} />
                      <p className="text-[10px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: "rgba(228,155,29,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="text-[13px] font-bold tracking-wide leading-tight" style={{ color: isDark ? "#E8D8B4" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>
                        {label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {access.enabled && !access.guest && customer && (
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = "/profile";
                  }}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left"
                  style={{ background: isDark ? "rgba(228,155,29,0.06)" : "#FFFFFF", border: "1px solid rgba(228,155,29,0.22)" }}
                  data-testid="button-hamburger-profile"
                >
                  <UserRound className="h-8 w-8 text-[#E8D8B4]" strokeWidth={2.2} />
                  <span className="text-sm font-bold" style={{ color: "var(--bb-gold)" }}>My Profile</span>
                </button>
              )}

              {/* ── Divider ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "rgba(228,155,29,0.15)" }} />
                <Utensils className="w-3.5 h-3.5" style={{ color: "rgba(228,155,29,0.4)" }} />
                <div className="flex-1 h-px" style={{ background: "rgba(228,155,29,0.15)" }} />
              </div>


              {/* ── Pay & Order ── */}
              <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "rgba(228,155,29,0.04)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.22)" : "1px solid rgba(0,0,0,0.1)" }}>
                <div className="px-4 py-3" style={{ borderBottom: isDark ? "1px solid rgba(228,155,29,0.12)" : "1px solid rgba(0,0,0,0.08)", background: isDark ? "rgba(228,155,29,0.05)" : "#FFFFFF" }}>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5" style={{ color: "#E49B1D" }} />
                    <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "rgba(228,155,29,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                      Pay &amp; Order
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: isDark ? "rgba(228,155,29,0.07)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.2)" : "1px solid rgba(0,0,0,0.1)" }}>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(228,155,29,0.5)", fontFamily: "'DM Sans', sans-serif" }}>UPI ID</p>
                      <p className="text-sm font-bold tracking-wide" style={{ color: "#E49B1D", fontFamily: "monospace" }}>{upiId || "Loading..."}</p>
                    </div>
                    <button
                      onClick={handleCopyUpi}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold transition-all active:scale-95"
                      style={{ background: copiedUpi ? "#22c55e" : "linear-gradient(90deg, #E49B1D, #E6C55A)", color: "#1C1500" }}
                      data-testid="button-copy-upi"
                    >
                      {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedUpi ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="w-44 h-44 rounded-xl flex items-center justify-center" style={{ background: "white", border: "3px solid #E49B1D" }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${restaurantInfo?.name || "Bung-le"}&cu=INR`)}`}
                        alt="UPI QR Code"
                        className="w-40 h-40 object-contain rounded"
                      />
                    </div>
                    <p className="text-[10px] text-center tracking-wide" style={{ color: isDark ? "rgba(220,212,200,0.5)" : "rgba(0,0,0,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
                      Scan with any UPI app
                    </p>
                  </div>

                  {(() => {
                    const payeeName = restaurantInfo?.name || "Bung-le";
                    const upiQuery = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&cu=INR`;
                    const apps: { label: string; scheme: string; logo: string; scale: number }[] = [
                      { label: "GPay", scheme: `tez://upi/pay?${upiQuery}`, logo: gpayLogo, scale: 1.25 },
                      { label: "PhonePe", scheme: `phonepe://pay?${upiQuery}`, logo: phonepeLogo, scale: 2 },
                      { label: "Paytm", scheme: `paytmmp://pay?${upiQuery}`, logo: paytmLogo, scale: 1.4 },
                    ];
                    const openApp = (url: string) => {
                      window.location.href = url;
                    };
                    return (
                      <div className="space-y-2 pt-2">
                        <p className="text-[10px] tracking-widest uppercase text-center" style={{ color: "rgba(228,155,29,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                          Pay With
                        </p>
                        <div className="grid grid-cols-3 gap-3 items-center">
                          {apps.map((app) => (
                            <button
                              key={app.label}
                              onClick={() => openApp(app.scheme)}
                              disabled={!upiId}
                              className="h-16 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 bg-transparent border-0 p-0"
                              data-testid={`button-pay-${app.label.toLowerCase()}`}
                              aria-label={`Pay with ${app.label}`}
                            >
                              <img
                                src={app.logo}
                                alt={app.label}
                                className="w-auto object-contain"
                                style={{ height: `${app.scale * 56}px`, maxWidth: "150%" }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* ── Restaurant Info ── */}
              <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "rgba(228,155,29,0.04)" : "#FFFFFF", border: isDark ? "1px solid rgba(228,155,29,0.18)" : "1px solid rgba(0,0,0,0.1)" }}>
                <div className="px-4 py-3" style={{ borderBottom: isDark ? "1px solid rgba(228,155,29,0.12)" : "1px solid rgba(0,0,0,0.08)", background: isDark ? "transparent" : "#FFFFFF" }}>
                  <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "rgba(228,155,29,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                    Restaurant Info
                  </p>
                </div>
                <div className="p-4 space-y-4">
                  {/* Location */}
                  {restaurantInfo?.location?.show !== false && (
                    <div className="flex items-center gap-3">
                      <img src={mapsImg} alt="Location" className="w-10 h-10 object-contain flex-shrink-0" />
                      <div>
                        {resolveLink(restaurantInfo?.location?.linkKey) ? (
                          <button onClick={() => window.open(resolveLink(restaurantInfo!.location.linkKey), "_blank", "noopener,noreferrer")}
                            className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>
                            {restaurantInfo?.location?.name ?? "Barrelborn"} <ExternalLink className="w-3 h-3" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }} />
                          </button>
                        ) : (
                          <p className="text-sm font-bold" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.location?.name ?? "Barrelborn"}</p>
                        )}
                        <p className="text-xs mt-0.5" style={{ color: isDark ? "#FFFFFF" : "#555555", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.location?.subtext ?? "Thane, Maharashtra"}</p>
                      </div>
                    </div>
                  )}
                  {/* Contact */}
                  {restaurantInfo?.contact?.show !== false && (
                    <div className="flex items-center gap-3">
                      <img src={callImg} alt="Call" className="w-10 h-10 object-contain rounded-full flex-shrink-0" />
                      <div>
                        {resolveLink(restaurantInfo?.contact?.linkKey) ? (
                          <button onClick={() => window.open(resolveLink(restaurantInfo!.contact.linkKey), "_self")}
                            className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>
                            {restaurantInfo?.contact?.name ?? PHONE}
                          </button>
                        ) : (
                          <p className="text-sm font-bold" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.contact?.name ?? PHONE}</p>
                        )}
                        <p className="text-[10px] mt-0.5" style={{ color: isDark ? "#FFFFFF" : "#555555", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.contact?.subtext ?? t.forReservations}</p>
                      </div>
                    </div>
                  )}
                  {/* Hours — no link */}
                  {restaurantInfo?.hours?.show !== false && (
                    <div className="flex items-center gap-3">
                      <img src={clockImg} alt="Hours" className="w-10 h-10 object-contain flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.hours?.name ?? "11:00 AM – 11:30 PM"}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: isDark ? "#FFFFFF" : "#555555", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.hours?.subtext ?? t.openAllDays}</p>
                      </div>
                    </div>
                  )}
                  {/* Instagram */}
                  {restaurantInfo?.instagram?.show !== false && (
                    <div className="flex items-center gap-3">
                      <img src={instaImg} alt="Instagram" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                      <div>
                        <button onClick={() => window.open(resolveLink(restaurantInfo?.instagram?.linkKey) ?? "https://www.instagram.com", "_blank", "noopener,noreferrer")}
                          className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>
                          {restaurantInfo?.instagram?.name ?? "@bungle"} <ExternalLink className="w-3 h-3" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }} />
                        </button>
                        <p className="text-[10px] mt-0.5" style={{ color: isDark ? "#FFFFFF" : "#555555", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.instagram?.subtext ?? t.followForUpdates}</p>
                      </div>
                    </div>
                  )}
                  {/* Facebook */}
                  {restaurantInfo?.facebook?.show !== false && (
                    <div className="flex items-center gap-3">
                      <img src={fbImg} alt="Facebook" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                      <div>
                        <button onClick={() => window.open(resolveLink(restaurantInfo?.facebook?.linkKey) ?? "https://facebook.com", "_blank", "noopener,noreferrer")}
                          className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>
                          {restaurantInfo?.facebook?.name ?? "Barrelborn"} <ExternalLink className="w-3 h-3" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }} />
                        </button>
                        <p className="text-[10px] mt-0.5" style={{ color: isDark ? "#FFFFFF" : "#555555", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.facebook?.subtext ?? "Follow on Facebook"}</p>
                      </div>
                    </div>
                  )}
                  {/* YouTube */}
                  {restaurantInfo?.youtube?.show !== false && (
                    <div className="flex items-center gap-3">
                      <img src={ytImg} alt="YouTube" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                      <div>
                        <button onClick={() => window.open(resolveLink(restaurantInfo?.youtube?.linkKey) ?? "https://youtube.com", "_blank", "noopener,noreferrer")}
                          className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>
                          {restaurantInfo?.youtube?.name ?? "Barrelborn"} <ExternalLink className="w-3 h-3" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }} />
                        </button>
                        <p className="text-[10px] mt-0.5" style={{ color: isDark ? "#FFFFFF" : "#555555", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.youtube?.subtext ?? "Watch on YouTube"}</p>
                      </div>
                    </div>
                  )}
                  {/* WhatsApp */}
                  {restaurantInfo?.whatsapp?.show !== false && (
                    <div className="flex items-center gap-3">
                      <img src={whatsappImg} alt="WhatsApp" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                      <div>
                        <button onClick={() => window.open(resolveLink(restaurantInfo?.whatsapp?.linkKey) ?? "https://wa.me/918278251111", "_blank", "noopener,noreferrer")}
                          className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: isDark ? "#FFFFFF" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>
                          {restaurantInfo?.whatsapp?.name ?? "+91 8278251111"} <ExternalLink className="w-3 h-3" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }} />
                        </button>
                        <p className="text-[10px] mt-0.5" style={{ color: isDark ? "#FFFFFF" : "#555555", fontFamily: "'DM Sans', sans-serif" }}>{restaurantInfo?.whatsapp?.subtext ?? "Chat on WhatsApp"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="h-px w-full" style={{ background: "rgba(228,155,29,0.1)" }} />
              <p
                className="text-center text-[10px] tracking-widest cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: "rgba(228,155,29,0.3)", fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => window.open("https://www.atdigitalmenu.com", "_blank")}
              >
                Powered by AT Digital Menu
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reservation Modal ── */}
      <AnimatePresence>
        {showReservation && (
          <ReservationModal onClose={() => setShowReservation(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
