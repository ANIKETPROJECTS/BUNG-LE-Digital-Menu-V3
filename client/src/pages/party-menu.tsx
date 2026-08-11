import { useState } from "react";
import { useLocation } from "wouter";
import { useOrder } from "@/contexts/OrderContext";
import HeaderActions from "@/components/header-actions";
import StatusBar from "@/components/status-bar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Users,
  Clock,
  Wallet,
  CheckCircle2,
  Wine,
  Utensils,
  IceCream2,
  Cookie,
  Soup,
  Wheat,
  Salad,
  Beef,
  Drumstick,
  GlassWater,
} from "lucide-react";

const hallImage1 = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093027/tarang-assets/image_1776788010129.jpg";
const hallImage2 = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093028/tarang-assets/image_1776788024450.jpg";
const hallImage3 = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093029/tarang-assets/image_1776788050939.jpg";
const soupManchowImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093033/tarang-assets/image_1776791999539.png";
const soupSweetcornImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093030/tarang-assets/image_1776791301049.jpg";
const soupHotSourImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093032/tarang-assets/image_1776791407057.jpg";
const soupLemonCorianderImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093031/tarang-assets/image_1776791332518.jpg";
const soupClearImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093035/tarang-assets/image_1776792098937.jpg";
const soupTomatoImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093034/tarang-assets/image_1776792056827.png";
const greenSaladImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093077/tarang-assets/image_1776870046198.jpg";
const pineappleRaitaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093077/tarang-assets/image_1776870249377.png";
const fruitRaitaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093078/tarang-assets/image_1776870284118.png";
const dalFryImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093079/tarang-assets/image_1776870316131.jpg";
const kolhapuriDalImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093079/tarang-assets/image_1776870439686.jpg";
const palakPunjabiImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093080/tarang-assets/image_1776870455707.jpg";
const dalTadkaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093081/tarang-assets/image_1776870474331.jpg";

const partyPlans = [
  {
    id: "veg-basic",
    name: "Veg Plan",
    tier: "Basic",
    price: 650,
    color: "#5DA66B",
    inclusions: [
      "2 Welcome Drinks",
      "2 Veg Starters",
      "1 Main Course",
      "2 Rotis · 2 Rice",
      "1 Dal · 1 Raita",
      "1 Ice Cream · 1 Sweet",
    ],
    note: "Only 1 Paneer Dish",
  },
  {
    id: "veg-premium",
    name: "Veg Plan",
    tier: "Premium",
    price: 750,
    color: "#E49B1D",
    inclusions: [
      "2 Welcome Drinks",
      "2 Veg Starters",
      "2 Main Course",
      "2 Rotis · 2 Rice",
      "1 Dal · 1 Raita",
      "2 Ice Cream · 2 Sweets",
    ],
    note: "No Paneer Restriction",
  },
  {
    id: "nv-std",
    name: "Non-Veg",
    tier: "Standard",
    price: 800,
    color: "#C44B3F",
    inclusions: [
      "2 Welcome Drinks",
      "2 Veg + 2 Non-Veg Starters",
      "2 Main Course",
      "2 Rotis · 1 Rice · 1 Salad",
      "1 Dal · 1 Raita",
      "2 Ice Cream · 1 Sweet",
    ],
    note: "No Fish & Mutton",
  },
  {
    id: "nv-premium",
    name: "Non-Veg",
    tier: "Premium",
    price: 950,
    color: "#9C2B25",
    inclusions: [
      "2 Welcome Drinks",
      "2 Veg + 2 Non-Veg Starters",
      "2 Main Course",
      "2 Rotis · 1 Rice · 1 Salad",
      "1 Dal · 1 Raita",
      "2 Ice Cream · 1 Sweet",
    ],
    note: "Includes Fish & Mutton",
  },
];

const occasions = [
  "Marriage", "Birthday", "Anniversary", "Get-Together", "Kitty Party", "Celebration",
];

const vegMenuSections = [
  { icon: GlassWater, title: "Welcome Drinks / Mocktails", items: ["Blue Lagoon", "Spicy Guava", "Fruit Punch", "Virgin Mojito"] },
  { icon: GlassWater, title: "Fruit Juices", items: ["Pineapple Juice", "Watermelon Juice", "Orange Juice"] },
  { icon: Soup, title: "Soups", items: [
    { name: "Veg Manchow Soup", image: soupManchowImg },
    { name: "Veg Sweetcorn Soup", image: soupSweetcornImg },
    { name: "Veg Hot & Sour Soup", image: soupHotSourImg },
    { name: "Veg Lemon Coriander Soup", image: soupLemonCorianderImg },
    { name: "Veg Clear Soup", image: soupClearImg },
    { name: "Tomato Soup", image: soupTomatoImg },
  ] },
  { icon: Utensils, title: "Starters – Veg", items: ["Veg Hot Basil", "Paneer Pahadi Tikka", "Paneer Tikka", "Paneer Hot Basil", "Paneer Burnt Garlic Dry", "Veg Manchurian Dry", "Cheese Corn Tikki", "Cheese Corn Balls"] },
  { icon: Utensils, title: "Main Course – Veg", items: ["Veg Maratha", "Veg Handi", "Veg Hariyali", "Veg Jaipuri", "Veg Kadai", "Veg Jalfrezi", "Aloo Gobi Masala", "Chhole Masala", "Aloo Jeera", "Paneer Butter Masala", "Paneer Tikka Masala", "Paneer Chatpata", "Paneer Do Pyaza", "Paneer Makhanwala", "Paneer Peshawari", "Paneer Handi", "Paneer Mutter Masala"] },
  { icon: Wheat, title: "Rotis", items: ["Roti", "Naan", "Kulcha"] },
  { icon: Wheat, title: "Indian Rice", items: ["Veg Pulao", "Veg Biryani", "Steam Rice / Jeera Rice", "Curd Rice", "Green Peas Pulao", "Veg Hyderabadi Biryani"] },
  { icon: Wheat, title: "Chinese Rice / Noodles", items: ["Fried Rice", "Hakka Noodles", "Singapore Fried Rice", "Singapore Noodles", "Hongkong Fried Rice", "Hongkong Noodles", "Schezwan Fried Rice"] },
  { icon: Soup, title: "Dal / Kadi", items: [
    { name: "Dal Fry", image: dalFryImg },
    { name: "Dal Tadka", image: dalTadkaImg },
    "Dal Makhni",
    { name: "Kolhapuri Dal", image: kolhapuriDalImg },
    { name: "Palak Punjabi", image: palakPunjabiImg },
    "Dahi Kadi",
  ] },
  { icon: Salad, title: "Raita / Salad", items: [
    "Veg Raita",
    "Boondi Raita",
    { name: "Pineapple Raita", image: pineappleRaitaImg },
    { name: "Fruit Raita", image: fruitRaitaImg },
    { name: "Green Salad", image: greenSaladImg },
  ] },
  { icon: IceCream2, title: "Ice Cream Flavours", items: ["Vanilla", "Chocolate", "Strawberry", "Mango", "Butter Scotch"] },
  { icon: Cookie, title: "Sweet Dish", items: ["Gulab Jamun"] },
];

const nonVegMenuSections = [
  { icon: Drumstick, title: "Starters – Non-Veg", items: ["Chicken Hot Basil", "Chicken Pahadi Tikka", "Chicken Tikka", "Chicken Crispy", "Chicken Burnt Garlic Dry", "Chicken Manchurian Dry", "Chicken Perry Dry", "Chicken Koliwada"] },
  { icon: Beef, title: "Main Course – Chicken", items: ["Chicken Maratha", "Chicken Handi", "Chicken Tikka Masala", "Chicken Rara", "Chicken Lahori", "Chicken Kadai", "Butter Chicken", "Chicken Kolhapuri", "Chicken Manchurian Gravy", "Chicken Masala"] },
  { icon: Beef, title: "Main Course – Mutton (Premium)", items: ["Mutton Masala", "Mutton Handi"] },
  { icon: Beef, title: "Extra Dishes (Seasonal)", items: ["Mutton", "Prawns", "Basa / Rawas"] },
];

const planComparison = [
  { row: "Welcome Drink / Soup", values: ["Any 2", "Any 2", "Any 2", "Any 2"] },
  { row: "Veg Starters", values: ["Any 2", "Any 3", "Any 2", "Any 2"] },
  { row: "Non-Veg Starters", values: ["–", "–", "Any 2", "Any 2"] },
  { row: "Main Course", values: ["Any 2", "Any 2", "Any 2", "Any 2"] },
  { row: "Assorted Rotis", values: ["Any 2", "Any 2", "Any 2", "Any 2"] },
  { row: "Rice / Biryani", values: ["Any 2", "Any 2", "Any 1", "Any 1"] },
  { row: "Dal", values: ["Any 1", "Any 1", "Any 1", "Any 1"] },
  { row: "Raita", values: ["Any 1", "Any 1", "Any 1", "Any 1"] },
  { row: "Salad", values: ["✓", "✓", "Any 1", "Any 1"] },
  { row: "Ice Cream", values: ["Any 1", "Any 2", "Any 2", "Any 2"] },
  { row: "Sweet Dish", values: ["Any 1", "Any 2", "Any 1", "Any 1"] },
  { row: "Fish & Mutton", values: ["✗", "✗", "✗", "✓"] },
];

type MenuItemType = string | { name: string; image?: string };

function MenuAccordion({ section }: { section: { icon: any; title: string; items: MenuItemType[] } }) {
  const normalized = section.items.map((it) =>
    typeof it === "string" ? { name: it } : it
  );
  const hasImages = normalized.some((it) => !!it.image);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(228,155,29,0.06)", border: "1px solid rgba(228,155,29,0.25)" }}
      data-testid={`section-${section.title}`}
    >
      <div className="w-full flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
        <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>
          {section.title}
        </p>
        <span className="text-[12px] font-semibold tracking-wide flex-shrink-0" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>
          {normalized.length} items
        </span>
      </div>
      {hasImages ? (
        <div className="px-3 py-2">
          {normalized.map((item, idx) => (
            <div
              key={item.name}
              className="flex items-center gap-3 py-2"
              style={{ borderBottom: idx === normalized.length - 1 ? "none" : "1px solid rgba(228,155,29,0.12)" }}
              data-testid={`item-${item.name}`}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="flex-shrink-0 rounded-lg" style={{ width: 56, height: 56, objectFit: "cover" }} />
              ) : (
                <div className="flex-shrink-0 rounded-lg" style={{ width: 56, height: 56, background: "rgba(228,155,29,0.12)" }} />
              )}
              <span className="text-[14px] font-semibold leading-snug" style={{ color: "var(--bb-text)" }}>{item.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2">
          {normalized.map((item) => (
            <span key={item.name} className="text-[14px] leading-snug" style={{ color: "var(--bb-text)" }}>{item.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PartyMenu() {
  const [, setLocation] = useLocation();
  useOrder();
  const [tab, setTab] = useState<"plans" | "compare" | "veg" | "nonveg" | "hall">("plans");

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "plans", label: "Plans" },
    { id: "veg", label: "Veg" },
    { id: "nonveg", label: "Non-Veg" },
    { id: "hall", label: "Hall" },
    { id: "compare", label: "Compare" },
  ];

  return (
    <div className="bb-bg min-h-screen flex flex-col">
      {/* Top gold shimmer bar */}
      <div className="h-[3px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, transparent, #E49B1D, #F0CC60, #E49B1D, transparent)" }} />

      {/* Header */}
      <div className="relative flex flex-col items-center px-4 pt-2 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
        <button
          onClick={() => setLocation("/menu")}
          className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ color: "var(--bb-text)" }}
          data-testid="button-back-party-menu"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute top-3 right-3">
          <HeaderActions color="var(--bb-gold)" size="sm" />
        </div>

        <button
          onClick={() => setLocation("/menu")}
          aria-label="Go to home"
          data-testid="button-logo-home"
        >
          <img
            src="/welcome-custom-logo.png"
            alt="Bung-le"
            className="w-28 h-28 object-contain mb-2"
            data-testid="img-party-menu-logo"
          />
        </button>

        <p className="text-[10px] uppercase tracking-[0.3em] font-light mb-0.5" style={{ color: "var(--bb-gold)" }}>
          Join Us For Special Events
        </p>
        <h2
          className="text-2xl font-black leading-none uppercase tracking-widest text-center"
          style={{ color: "var(--bb-gold)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.16em" }}
        >
          Celebration Menu
        </h2>
      </div>

      <StatusBar />

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-x-auto" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
        <div className="flex gap-2 px-3 py-2.5 min-w-max">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-5 py-2.5 rounded-full transition-all active:scale-95"
                style={{
                  background: active ? "linear-gradient(135deg, #E49B1D, #E6C55A)" : "rgba(228,155,29,0.08)",
                  border: active ? "none" : "1px solid rgba(228,155,29,0.25)",
                }}
                data-testid={`tab-party-${t.id}`}
              >
                <span className="text-[14px] font-black uppercase tracking-wider" style={{ color: active ? "#3D3100" : "var(--bb-gold)" }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {tab === "plans" && (
            <motion.div key="plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <p className="text-center text-[12px] tracking-widest uppercase" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>
                Let's Party · Eat, Drink &amp; Rejoice
              </p>
              {partyPlans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative rounded-2xl overflow-hidden"
                  style={{ background: "var(--bb-card)", border: `1.5px solid ${plan.color}` }}
                  data-testid={`card-plan-${plan.id}`}
                >
                  <div className="px-4 py-3 flex items-end justify-between" style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` }}>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{plan.tier}</p>
                      <h3 className="text-lg font-black uppercase tracking-wider leading-none mt-0.5" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{plan.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black leading-none" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>₹{plan.price}</p>
                      <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>per head</p>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                      {plan.inclusions.map((inc) => (
                        <div key={inc} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-[1px]" style={{ color: plan.color }} />
                          <span className="text-[13px] leading-snug" style={{ color: "var(--bb-text)" }}>{inc}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-center text-[13px] font-bold uppercase tracking-wider" style={{ color: "#000" }}>{plan.note}</p>
                  </div>
                </motion.div>
              ))}
              <a
                href="tel:+917738310238"
                className="block w-full text-center rounded-xl py-3.5 mt-2 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg, #E49B1D, #E6C55A)", color: "#3D3100" }}
                data-testid="button-book-party"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-80">Book Your Celebration</p>
                <p className="text-base font-black tracking-wider flex items-center justify-center gap-2 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <Phone className="w-4 h-4" />
                  +91 77383 10238
                </p>
              </a>
            </motion.div>
          )}

          {tab === "compare" && (
            <motion.div key="compare" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>Compare All Plans</p>
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(228,155,29,0.06)", border: "1px solid rgba(228,155,29,0.25)" }}>
                <div className="w-full px-4 py-3" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
                  <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>Plan Comparison</p>
                </div>
                <div className="grid grid-cols-5 px-3 py-2.5 gap-2 items-end" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
                  <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)" }}>Item</div>
                  <div className="text-center"><div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>Veg</div><div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹650</div></div>
                  <div className="text-center"><div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>Veg+</div><div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹750</div></div>
                  <div className="text-center"><div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>NV</div><div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹800</div></div>
                  <div className="text-center"><div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>NV+</div><div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹950</div></div>
                </div>
                <div className="px-3 py-2">
                  {planComparison.map((row, idx) => (
                    <div key={row.row} className="grid grid-cols-5 gap-2 items-center py-2" style={{ borderBottom: idx === planComparison.length - 1 ? "none" : "1px solid rgba(228,155,29,0.12)" }}>
                      <div className="text-[14px] font-semibold leading-tight" style={{ color: "var(--bb-text)" }}>{row.row}</div>
                      {row.values.map((v, i) => (
                        <div key={i} className="text-[14px] text-center" style={{ color: v === "✓" ? "#5DA66B" : v === "✗" || v === "–" ? "var(--bb-text)" : "var(--bb-gold)", opacity: v === "✗" || v === "–" ? 0.4 : 1, fontWeight: v === "✓" || v === "✗" || v === "–" ? 700 : 600 }}>
                          {v}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[12px] text-center mt-2" style={{ color: "var(--bb-text)", opacity: 0.6 }}>Papad · Pickle · Lemon · Onion included in all plans</p>
            </motion.div>
          )}

          {tab === "veg" && (
            <motion.div key="veg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2.5">
              <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>Veg Menu · Item List</p>
              {vegMenuSections.map((s) => (<MenuAccordion key={s.title} section={s} />))}
            </motion.div>
          )}

          {tab === "nonveg" && (
            <motion.div key="nonveg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2.5">
              <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>Non-Veg Menu · Item List</p>
              {nonVegMenuSections.map((s) => (<MenuAccordion key={s.title} section={s} />))}
              <div className="mt-3 p-3 rounded-xl text-[11px] leading-relaxed" style={{ background: "rgba(196,75,63,0.08)", border: "1px solid rgba(196,75,63,0.35)", color: "var(--bb-text)" }}>
                <strong style={{ color: "#E49B1D" }}>Note:</strong> Mutton &amp; Fish are included only in the Non-Veg Premium Plan (₹950/-). Seasonal prices apply for extra dishes.
              </div>
            </motion.div>
          )}

          {tab === "hall" && (
            <motion.div key="hall" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>Hall &amp; Booking Details</p>
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(228,155,29,0.06)", border: "1px solid rgba(228,155,29,0.25)" }}>
                <div className="w-full px-4 py-3" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
                  <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>Booking Info</p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {[
                    { label: "Hall Rent", value: "From ₹5,000 (max 5 hrs)" },
                    { label: "Capacity", value: "40 – 300 guests" },
                    { label: "Advance", value: "50% · balance 2 days prior" },
                    { label: "Liquor", value: "Available on premises" },
                    { label: "Outside Food", value: "Not allowed" },
                    { label: "Booking", value: "+91 77383 10238" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-start justify-between gap-3">
                      <span className="text-[14px] font-semibold" style={{ color: "var(--bb-gold)" }}>{d.label}</span>
                      <span className="text-[14px] text-right" style={{ color: "var(--bb-text)" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(228,155,29,0.06)", border: "1px solid rgba(228,155,29,0.25)" }}>
                <div className="w-full px-4 py-3" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
                  <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>Hall Gallery</p>
                </div>
                <div className="p-3">
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1" style={{ scrollbarWidth: "none" }} data-testid="carousel-hall-gallery">
                    {[hallImage1, hallImage2, hallImage3].map((img, i) => (
                      <div key={i} className="flex-shrink-0 snap-center rounded-lg overflow-hidden" style={{ width: "85%", aspectRatio: "16 / 10" }}>
                        <img src={img} alt={`Tarang Hall ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(228,155,29,0.06)", border: "1px solid rgba(228,155,29,0.25)" }}>
                <div className="w-full flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
                  <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>Extra Items</p>
                  <span className="text-[12px] font-semibold" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>add-on</span>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {[
                    { label: "Juice", price: "+₹50" },
                    { label: "Syrup Topping", price: "+₹20" },
                    { label: "Masala Milk / Tea / Coffee", price: "+₹25" },
                    { label: "Extra Starters / Main", price: "+₹100" },
                    { label: "Extra Sweet", price: "+₹50" },
                  ].map((e) => (
                    <div key={e.label} className="flex items-center justify-between gap-3">
                      <span className="text-[14px]" style={{ color: "var(--bb-text)" }}>{e.label}</span>
                      <span className="text-[14px] font-bold" style={{ color: "var(--bb-gold)" }}>{e.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(228,155,29,0.06)", border: "1px solid rgba(228,155,29,0.25)" }}>
                <div className="w-full px-4 py-3" style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}>
                  <p className="text-[15px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>Perfect For</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2">
                  {occasions.map((o) => (
                    <span key={o} className="text-[14px] leading-snug" style={{ color: "var(--bb-text)" }}>{o}</span>
                  ))}
                </div>
              </div>
              <a
                href="tel:+917738310238"
                className="block w-full text-center rounded-xl py-3.5 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg, #E49B1D, #E6C55A)", color: "#3D3100" }}
                data-testid="button-book-hall"
              >
                <p className="text-base font-black tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Call to Book · +91 77383 10238</p>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom gold shimmer bar */}
      <div className="h-[2px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, transparent, #E49B1D, transparent)" }} />
    </div>
  );
}
