import mocktailsCocktailsImg from "@assets/image_1777536917464.png";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Coupon, CarouselImage, MenuCategory } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Menu as MenuIcon,
  X,
  Tag,
  Calendar,
  Sparkles,
  PartyPopper,
  Phone,
  Users,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
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
  ChevronDown,
} from "lucide-react";

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/hamburger-menu";
import HeaderActions from "@/components/header-actions";
import StatusBar from "@/components/status-bar";
import FloatingButtons from "@/components/floating-buttons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useOrder } from "@/contexts/OrderContext";
import { useMenuAccess } from "@/contexts/MenuAccessContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const premiumFoodImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093036/tarang-assets/image_1776832578996.jpg";
const premiumBarImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093036/tarang-assets/image_1776832765185.jpg";
const premiumDessertsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092781/tarang-assets/image_1776752566455.jpg";
const premiumMocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093037/tarang-assets/image_1776833112037.jpg";
const cocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092668/tarang-assets/COCKTAILS_1766751289781.jpg";
const craftedBeerImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092668/tarang-assets/CRAFTED_BEER_1766750491358.jpg";
const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";
const drinksOfferBannerImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092677/tarang-assets/LIMITED_TIME_OFFER__VISIT_US_TODAY__BOOK_YOUR_TABLE_555-0199_w_1776780766076.jpg";
const celebrationMenuBannerImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092679/tarang-assets/Untitled_design__13__1776782517090.jpg";
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
import type { Logo } from "@shared/schema";


const categoryImages: Record<string, string> = {
  food: premiumFoodImg,
  "crafted-beer": craftedBeerImg,
  cocktails: cocktailsImg,
  bar: premiumBarImg,
  desserts: premiumDessertsImg,
  mocktails: premiumMocktailsImg,
};


function CouponCard({
  coupon,
  onClick,
}: {
  coupon: Coupon;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 focus:outline-none active:scale-95 transition-transform duration-150"
      style={{ width: "78vw", maxWidth: "340px", minWidth: "260px" }}
      data-testid={`coupon-card-${coupon.code}`}
    >
      {/* Card body — two-section horizontal layout */}
      <div
        className="flex rounded-2xl overflow-hidden relative"
        style={{
          border: "1.5px solid #E49B1D",
          height: "92px",
          boxShadow: "0 4px 20px rgba(228,155,29,0.18)",
        }}
      >
        {/* LEFT — gold gradient discount panel */}
        <div
          className="flex flex-col items-center justify-center px-3 py-2 flex-shrink-0 overflow-hidden"
          style={{
            width: "37%",
            background: "linear-gradient(90deg, #E49B1D, #E6C55A)",
            borderRight: "1.5px dashed rgba(61,49,0,0.35)",
          }}
        >
          <p
            className="font-black text-center"
            style={{
              color: "#3D3100",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.5px",
              fontSize: "clamp(12px, 3.4vw, 16px)",
              lineHeight: 1.05,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {coupon.title}
          </p>
          <p
            className="text-[8px] uppercase tracking-widest mt-1 text-center font-semibold w-full"
            style={{
              color: "#3D3100",
              opacity: 0.75,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {coupon.tag}
          </p>
        </div>

        {/* RIGHT — code + condition on dark background */}
        <div
          className="flex flex-col justify-center px-4 py-3 text-left flex-1 min-w-0 overflow-hidden"
          style={{ background: "var(--bb-card)" }}
        >
          <p
            className="text-sm font-black tracking-widest uppercase"
            style={{
              color: "var(--bb-gold)",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {coupon.code}
          </p>
          <p
            className="text-[11px] mt-1.5 leading-snug tracking-wide"
            style={{
              color: "var(--bb-gold-2)",
              opacity: 0.9,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {coupon.subtitle}
          </p>
          <p
            className="text-[10px] mt-1 leading-snug tracking-wide"
            style={{
              color: "var(--bb-text)",
              opacity: 0.55,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {coupon.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function CouponsFullScreen({
  open,
  onClose,
  coupons,
}: {
  open: boolean;
  onClose: () => void;
  coupons: Coupon[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="bb-bg fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
        >
          {/* Top gold shimmer bar */}
          <div
            className="h-[3px] w-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, #E49B1D, #F0CC60, #E49B1D, transparent)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.3em] font-light mb-0.5"
                style={{ color: "var(--bb-gold)" }}
              >
                Exclusive Offers
              </p>
              <h2
                className="text-2xl font-black leading-none uppercase tracking-widest"
                style={{
                  color: "var(--bb-gold)",
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: "0.18em",
                }}
              >
                Coupons &amp; Deals
              </h2>
            </div>

            {/* Gold close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{
                background: "rgba(228,155,29,0.12)",
                border: "1.5px solid rgba(228,155,29,0.45)",
                color: "var(--bb-gold)",
              }}
              data-testid="button-close-coupons-fullscreen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable coupon list */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                {/* Full-width coupon card — same design as CouponCard */}
                <div
                  className="flex rounded-2xl overflow-hidden relative w-full"
                  style={{
                    border: "1.5px solid #E49B1D",
                    height: "120px",
                    boxShadow: "0 4px 20px rgba(228,155,29,0.18)",
                  }}
                >
                  {/* LEFT — gold gradient panel */}
                  <div
                    className="flex flex-col items-center justify-center px-3 py-2 flex-shrink-0 overflow-hidden"
                    style={{
                      width: "36%",
                      background: "linear-gradient(135deg, #E49B1D, #E6C55A)",
                      borderRight: "1.5px dashed rgba(61,49,0,0.35)",
                    }}
                  >
                    <p
                      className="font-black text-center"
                      style={{
                        color: "#3D3100",
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "-0.5px",
                        fontSize: "clamp(13px, 3.6vw, 18px)",
                        lineHeight: 1.05,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {coupon.title}
                    </p>
                    <p
                      className="text-[9px] uppercase tracking-widest mt-1.5 text-center font-semibold w-full"
                      style={{
                        color: "#3D3100",
                        opacity: 0.75,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {coupon.tag}
                    </p>
                  </div>

                  {/* RIGHT — details on dark background */}
                  <div
                    className="flex flex-col justify-center px-4 py-3 text-left flex-1 min-w-0 overflow-hidden"
                    style={{ background: "var(--bb-card)" }}
                  >
                    <p
                      className="text-sm font-black tracking-widest uppercase"
                      style={{
                        color: "var(--bb-gold)",
                        fontFamily: "'DM Sans', sans-serif",
                        lineHeight: 1.1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {coupon.code}
                    </p>
                    <p
                      className="text-[11px] mt-1.5 leading-snug tracking-wide"
                      style={{
                        color: "var(--bb-gold-2)",
                        opacity: 0.9,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {coupon.subtitle}
                    </p>
                    <p
                      className="text-[10px] mt-1 leading-snug tracking-wide"
                      style={{
                        color: "var(--bb-text)",
                        opacity: 0.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {coupon.description}
                    </p>
                    {/* Validity */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Calendar
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: "var(--bb-gold)", opacity: 0.7 }}
                      />
                      <p
                        className="text-[9px] uppercase tracking-wider"
                        style={{ color: "var(--bb-gold)", opacity: 0.7 }}
                      >
                        {coupon.validity}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom gold shimmer bar */}
          <div
            className="h-[2px] w-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, #E49B1D, transparent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============== PARTY MENU DATA ==============
const partyPlans = [
  {
    id: "veg-basic",
    name: "Veg Plan",
    tier: "Basic",
    price: 650,
    color: "#5DA66B",
    glow: "rgba(93,166,107,0.35)",
    inclusions: [
      "2 Welcome Drinks",
      "2 Veg Starters",
      "2 Main Course",
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
    glow: "rgba(228,155,29,0.45)",
    inclusions: [
      "2 Welcome Drinks",
      "3 Veg Starters",
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
    glow: "rgba(196,75,63,0.4)",
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
    glow: "rgba(156,43,37,0.5)",
    inclusions: [
      "2 Welcome Drinks",
      "2 Veg + 2 Non-Veg Starters",
      "2 Main Course",
      "2 Rotis · 1 Rice · 1 Salad",
      "1 Dal · 1 Raita",
      "2 Ice Cream · 1 Sweet",
    ],
    note: "Includes Fish & Mutton",
    featured: true,
  },
];

const hallDetails = [
  { icon: Wallet, label: "Hall Rent", value: "From ₹5,000", sub: "Max 5 hrs · extra after" },
  { icon: Users, label: "Capacity", value: "40 – 300", sub: "Guests" },
  { icon: Phone, label: "Booking", value: "77383 10238", sub: "Call to reserve", href: "tel:+917738310238" },
  { icon: Clock, label: "Advance", value: "50% Advance", sub: "Balance 2 days prior" },
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
  { icon: Beef, title: "Extra Dishes (Seasonal)", items: ["Mutton", "Prawns", "Surmai", "Basa / Rawas"] },
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

type MenuItem = string | { name: string; image?: string };

function MenuAccordion({ section }: { section: { icon: any; title: string; items: MenuItem[] } }) {
  const normalized = section.items.map((it) =>
    typeof it === "string" ? { name: it } : it
  );
  const hasImages = normalized.some((it) => !!it.image);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(228,155,29,0.06)",
        border: "1px solid rgba(228,155,29,0.25)",
      }}
      data-testid={`section-${section.title}`}
    >
      <div
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
      >
        <p
          className="text-[15px] font-bold uppercase tracking-wider"
          style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {section.title}
        </p>
        <span
          className="text-[12px] font-semibold tracking-wide flex-shrink-0"
          style={{ color: "var(--bb-gold)", opacity: 0.75 }}
        >
          {normalized.length} items
        </span>
      </div>
      {hasImages ? (
        <div className="px-3 py-2">
          {normalized.map((item, idx) => (
            <div
              key={item.name}
              className="flex items-center gap-3 py-2"
              style={{
                borderBottom:
                  idx === normalized.length - 1
                    ? "none"
                    : "1px solid rgba(228,155,29,0.12)",
              }}
              data-testid={`item-${item.name}`}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="flex-shrink-0 rounded-lg"
                  style={{ width: 56, height: 56, objectFit: "cover" }}
                />
              ) : (
                <div
                  className="flex-shrink-0 rounded-lg"
                  style={{ width: 56, height: 56, background: "rgba(228,155,29,0.12)" }}
                />
              )}
              <span
                className="text-[14px] font-semibold leading-snug"
                style={{ color: "var(--bb-text)" }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2">
          {normalized.map((item) => (
            <span
              key={item.name}
              className="text-[14px] leading-snug"
              style={{ color: "var(--bb-text)" }}
            >
              {item.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PartyMenuFullScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"plans" | "compare" | "veg" | "nonveg" | "hall">("plans");

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "plans", label: "Plans" },
    { id: "veg", label: "Veg" },
    { id: "nonveg", label: "Non-Veg" },
    { id: "hall", label: "Hall" },
    { id: "compare", label: "Compare" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="bb-bg fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          data-testid="modal-party-menu"
        >
          {/* Header — centered Tarang logo */}
          <div
            className="relative flex flex-col items-center px-4 pt-2 pb-3 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ color: "#000" }}
              data-testid="button-close-party-menu"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <img
                   src="/welcome-custom-logo.png"
              alt="Bung-le"
              className="w-28 h-28 object-contain mb-2"
              data-testid="img-party-menu-logo"
            />

            <p
              className="text-[10px] uppercase tracking-[0.3em] font-light mb-0.5"
              style={{ color: "var(--bb-gold)" }}
            >
              Join Us For Special Events
            </p>
            <h2
              className="text-2xl font-black leading-none uppercase tracking-widest text-center"
              style={{
                color: "var(--bb-gold)",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.16em",
              }}
            >
              Celebration Menu
            </h2>
          </div>

          {/* Tabs */}
          <div
            className="flex-shrink-0 overflow-x-auto"
            style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
          >
            <div className="flex gap-2 px-3 py-2.5 min-w-max">
              {tabs.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="px-5 py-2.5 rounded-full transition-all active:scale-95"
                    style={{
                      background: active
                        ? "linear-gradient(135deg, #E49B1D, #E6C55A)"
                        : "rgba(228,155,29,0.08)",
                      border: active ? "none" : "1px solid rgba(228,155,29,0.25)",
                    }}
                    data-testid={`tab-party-${t.id}`}
                  >
                    <span
                      className="text-[14px] font-black uppercase tracking-wider"
                      style={{ color: active ? "#3D3100" : "var(--bb-gold)" }}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <AnimatePresence mode="wait">
              {tab === "plans" && (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
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
                      style={{
                        background: "var(--bb-card)",
                        border: `1.5px solid ${plan.color}`,
                      }}
                      data-testid={`card-plan-${plan.id}`}
                    >
                      {/* Header band */}
                      <div
                        className="px-4 py-3 flex items-end justify-between"
                        style={{
                          background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                        }}
                      >
                        <div>
                          <p
                            className="text-[10px] uppercase tracking-[0.25em] font-semibold"
                            style={{ color: "rgba(255,255,255,0.85)" }}
                          >
                            {plan.tier}
                          </p>
                          <h3
                            className="text-lg font-black uppercase tracking-wider leading-none mt-0.5"
                            style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {plan.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-xl font-black leading-none"
                            style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            ₹{plan.price}
                          </p>
                          <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                            per head
                          </p>
                        </div>
                      </div>

                      {/* Inclusions — 2 columns */}
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                          {plan.inclusions.map((inc) => (
                            <div key={inc} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-[1px]" style={{ color: plan.color }} />
                              <span className="text-[13px] leading-snug" style={{ color: "var(--bb-text)" }}>
                                {inc}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p
                          className="mt-3 text-center text-[13px] font-bold uppercase tracking-wider"
                          style={{ color: "#000" }}
                        >
                          {plan.note}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* CTA */}
                  <a
                    href="tel:+917738310238"
                    className="block w-full text-center rounded-xl py-3.5 mt-2 active:scale-[0.98] transition-transform"
                    style={{
                      background: "linear-gradient(135deg, #E49B1D, #E6C55A)",
                      color: "#3D3100",
                    }}
                    data-testid="button-book-party"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-80">
                      Book Your Celebration
                    </p>
                    <p className="text-base font-black tracking-wider flex items-center justify-center gap-2 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <Phone className="w-4 h-4" />
                      +91 77383 10238
                    </p>
                  </a>
                </motion.div>
              )}

              {tab === "compare" && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>
                    Compare All Plans
                  </p>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(228,155,29,0.06)",
                      border: "1px solid rgba(228,155,29,0.25)",
                    }}
                  >
                    <div
                      className="w-full px-4 py-3"
                      style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
                    >
                      <p
                        className="text-[15px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Plan Comparison
                      </p>
                    </div>

                    {/* Column headers */}
                    <div
                      className="grid grid-cols-5 px-3 py-2.5 gap-2 items-end"
                      style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
                    >
                      <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--bb-gold)" }}>Item</div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>Veg</div>
                        <div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹650</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>Veg+</div>
                        <div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹750</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>NV</div>
                        <div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹800</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold" style={{ color: "var(--bb-gold)" }}>NV+</div>
                        <div className="text-[11px]" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>₹950</div>
                      </div>
                    </div>

                    {/* Rows */}
                    <div className="px-3 py-2">
                      {planComparison.map((row, idx) => (
                        <div
                          key={row.row}
                          className="grid grid-cols-5 gap-2 items-center py-2"
                          style={{
                            borderBottom:
                              idx === planComparison.length - 1
                                ? "none"
                                : "1px solid rgba(228,155,29,0.12)",
                          }}
                        >
                          <div className="text-[14px] font-semibold leading-tight" style={{ color: "var(--bb-text)" }}>
                            {row.row}
                          </div>
                          {row.values.map((v, i) => (
                            <div
                              key={i}
                              className="text-[14px] text-center"
                              style={{
                                color:
                                  v === "✓"
                                    ? "#5DA66B"
                                    : v === "✗" || v === "–"
                                    ? "var(--bb-text)"
                                    : "var(--bb-gold)",
                                opacity: v === "✗" || v === "–" ? 0.4 : 1,
                                fontWeight: v === "✓" || v === "✗" || v === "–" ? 700 : 600,
                              }}
                            >
                              {v}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[12px] text-center mt-2" style={{ color: "var(--bb-text)", opacity: 0.6 }}>
                    Papad · Pickle · Lemon · Onion included in all plans
                  </p>
                </motion.div>
              )}

              {tab === "veg" && (
                <motion.div
                  key="veg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2.5"
                >
                  <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>
                    Veg Menu · Item List
                  </p>
                  {vegMenuSections.map((s) => (
                    <MenuAccordion key={s.title} section={s} />
                  ))}
                </motion.div>
              )}

              {tab === "nonveg" && (
                <motion.div
                  key="nonveg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2.5"
                >
                  <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>
                    Non-Veg Menu · Item List
                  </p>
                  {nonVegMenuSections.map((s) => (
                    <MenuAccordion key={s.title} section={s} />
                  ))}
                  <div
                    className="mt-3 p-3 rounded-xl text-[11px] leading-relaxed"
                    style={{
                      background: "rgba(196,75,63,0.08)",
                      border: "1px solid rgba(196,75,63,0.35)",
                      color: "var(--bb-text)",
                    }}
                  >
                    <strong style={{ color: "#E49B1D" }}>Note:</strong> Mutton &amp; Fish are included only in the Non-Veg Premium Plan (₹950/-). Seasonal prices apply for extra dishes.
                  </div>
                </motion.div>
              )}

              {tab === "hall" && (
                <motion.div
                  key="hall"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-center text-[12px] tracking-widest uppercase mb-2" style={{ color: "var(--bb-gold-2)", opacity: 0.85 }}>
                    Hall &amp; Booking Details
                  </p>

                  {/* Booking details — styled like Veg/Non-Veg section */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(228,155,29,0.06)",
                      border: "1px solid rgba(228,155,29,0.25)",
                    }}
                  >
                    <div
                      className="w-full px-4 py-3"
                      style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
                    >
                      <p
                        className="text-[15px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Booking Info
                      </p>
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

                  {/* Hall Gallery — 3 image carousel */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(228,155,29,0.06)",
                      border: "1px solid rgba(228,155,29,0.25)",
                    }}
                  >
                    <div
                      className="w-full px-4 py-3"
                      style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
                    >
                      <p
                        className="text-[15px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Hall Gallery
                      </p>
                    </div>
                    <div className="p-3">
                      <div
                        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1"
                        style={{ scrollbarWidth: "none" }}
                        data-testid="carousel-hall-gallery"
                      >
                        {[hallImage1, hallImage2, hallImage3].map((img, i) => (
                          <div
                            key={i}
                            className="flex-shrink-0 snap-center rounded-lg overflow-hidden"
                            style={{ width: "85%", aspectRatio: "16 / 10" }}
                          >
                            <img
                              src={img}
                              alt={`Tarang Hall ${i + 1}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Extra Items — styled like Veg/Non-Veg section */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(228,155,29,0.06)",
                      border: "1px solid rgba(228,155,29,0.25)",
                    }}
                  >
                    <div
                      className="w-full flex items-center justify-between px-4 py-3"
                      style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
                    >
                      <p
                        className="text-[15px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Extra Items
                      </p>
                      <span className="text-[12px] font-semibold" style={{ color: "var(--bb-gold)", opacity: 0.75 }}>
                        add-on
                      </span>
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

                  {/* Occasions — styled like Veg/Non-Veg section */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(228,155,29,0.06)",
                      border: "1px solid rgba(228,155,29,0.25)",
                    }}
                  >
                    <div
                      className="w-full px-4 py-3"
                      style={{ borderBottom: "1px solid rgba(228,155,29,0.18)" }}
                    >
                      <p
                        className="text-[15px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Perfect For
                      </p>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2">
                      {occasions.map((o) => (
                        <span key={o} className="text-[14px] leading-snug" style={{ color: "var(--bb-text)" }}>
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="tel:+917738310238"
                    className="block w-full text-center rounded-xl py-3.5 active:scale-[0.98] transition-transform"
                    style={{
                      background: "linear-gradient(135deg, #E49B1D, #E6C55A)",
                      color: "#3D3100",
                    }}
                    data-testid="button-book-hall"
                  >
                    <p className="text-base font-black tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Call to Book · +91 77383 10238
                    </p>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom gold shimmer bar */}
          <div
            className="h-[2px] w-full flex-shrink-0"
            style={{
              background: "linear-gradient(90deg, transparent, #E49B1D, transparent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MenuLanding() {
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const access = useMenuAccess();
  useOrder();
  const [showCoupons, setShowCoupons] = useState(false);

  const { data: coupons = [] } = useQuery<Coupon[]>({
    queryKey: ["/api/coupons"],
  });

  const { data: carouselData = [] } = useQuery<CarouselImage[]>({
    queryKey: ["/api/carousel"],
  });
  const carouselImages: CarouselImage[] = (carouselData.length > 0
    ? carouselData
    : [{ _id: "drinks-offer-banner", url: drinksOfferBannerImg, order: 1, visible: true } as CarouselImage]
  )
    .filter((img) => img.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const { data: menuCategories = [] } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });
  const { data: logoData } = useQuery<Logo>({
    queryKey: ["/api/logo"],
  });
  const logoUrl = logoData?.url || "";
  const [lightboxImage, setLightboxImage] = useState<CarouselImage | null>(null);
  const lightboxPaused = useRef(false);
  const swipeTouchX = useRef<number | null>(null);


  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const len = carouselImages.length;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % len);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "mocktails") {
      setLocation(`/menu/mocktails-cocktails`);
      return;
    }
    if (categoryId === "desserts") {
      setLocation(`/menu/desserts/desserts`);
      return;
    }
    setLocation(`/menu/${categoryId}`);
  };

  return (
    <div className="bb-bg min-h-screen">
      <header
        className="bb-header sticky top-0 z-30 elegant-shadow"
      >
        <div className="container mx-auto px-2 sm:px-4 py-1">
          <div className="relative flex items-center w-full h-12">
            <div className="flex items-center flex-shrink-0 z-10" style={{ width: "44px" }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "#E8D8B4" }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <button
                onClick={() => setLocation("/menu")}
                className="hover:bg-transparent pointer-events-auto"
                aria-label="Go to home"
                data-testid="button-logo-home"
              >
                <img
                   src="/welcome-custom-logo.png"
                  alt="Bung-le"
                   style={{ height: "58px", width: "150px", objectFit: "contain", display: "block" }}
                  data-testid="img-logo"
                />
              </button>
            </div>

            <div className="ml-auto flex justify-end items-center gap-1 flex-shrink-0 z-10">
              {access.enabled && (
                <div
                  className="flex flex-col items-end mr-1 text-[8px] sm:text-[9px] leading-tight tracking-wide max-w-[72px] truncate"
                  style={{ color: "#E8D8B4" }}
                  data-testid="qr-location"
                >
                  <span>{access.tableName}</span>
                  <span>{access.floorName}</span>
                </div>
              )}
              {/* Profile / Favorites / Order */}
              <HeaderActions color="var(--bb-gold)" />
              {/* Hamburger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                 style={{ color: "var(--bb-gold)" }}
                data-testid="button-menu-toggle"
              >
                {showHamburgerMenu ? (
                   <X className="h-6 w-6" />
                ) : (
                   <MenuIcon className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <HamburgerMenu
          isOpen={showHamburgerMenu}
          onClose={() => setShowHamburgerMenu(false)}
          onCategoryClick={handleCategoryClick}
        />
      </header>

      <StatusBar />

      <AnimatePresence>
      </AnimatePresence>

      <div className="container mx-auto px-3 sm:px-4 pt-5 pb-24">
        {/* Gold gradient border wrapper for carousel — only shown when images exist */}
        {carouselImages.length > 0 && (
          <div
            className="rounded-xl p-[2px] mb-3"
            style={{ background: "linear-gradient(90deg, #E49B1D, #E6C55A)" }}
          >
            <div
              className="relative rounded-[10px] overflow-hidden cursor-pointer group"
              style={{ width: "100%", aspectRatio: "1024 / 576", flexShrink: 0 }}
              onClick={() => setLightboxImage(carouselImages[currentImageIndex])}
              data-testid="banner-image-carousel"
            >
              {carouselImages.map((image, index) => (
                <motion.div
                  key={String(image._id)}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Coupon Auto-Scroll Carousel — only rendered when at least 1 coupon is visible */}
        {coupons.length > 0 && (
          <div className="py-3 mb-3 overflow-hidden">
            <div
              className="coupon-track flex gap-4"
              style={{ width: "max-content" }}
            >
              {/* Repeat enough times to always fill the viewport smoothly */}
              {Array.from({ length: Math.max(2, Math.ceil(6 / coupons.length)) })
                .flatMap(() => coupons)
                .map((coupon, index) => (
                  <CouponCard
                    key={`${coupon.code}-${index}`}
                    coupon={coupon}
                    onClick={() => setShowCoupons(true)}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {menuCategories.filter((cat) => cat.id !== "cocktails").map((category, index) => {
              const isMocktails = category.id === "mocktails";
              const label = isMocktails ? "MOCKTAILS & COCKTAILS" : category.title;
              const imgSrc = failedImages.has(category.id)
                ? fallbackImg
                : (isMocktails ? mocktailsCocktailsImg : (category.image || categoryImages[category.id] || fallbackImg));
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "linear-gradient(90deg, #E49B1D, #E6C55A)",
                    padding: "2px",
                    borderRadius: "10px",
                  }}
                >
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className="group overflow-hidden"
                    style={{
                      borderRadius: "8px",
                      display: "block",
                      width: "100%",
                      aspectRatio: "1 / 1.05",
                      position: "relative",
                    }}
                    data-testid={`tile-${category.id}`}
                  >
                    <img
                      src={imgSrc}
                      alt={label as string}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-110"
                      onError={() => {
                        setFailedImages((prev) => new Set(prev).add(category.id));
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {isMocktails && (
                      <div className="absolute top-3 left-0 z-10">
                        <span
                          className="block text-[13px] font-black uppercase tracking-wider pl-3 pr-5 py-2"
                          style={{
                            background: "#DC2626",
                            color: "#FFFFFF",
                            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                            boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
                            lineHeight: 1.2,
                          }}
                        >
                          BUY 1 GET 1 FREE
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3">
                      <h3
                        className="text-base sm:text-lg md:text-xl font-bold tracking-widest uppercase text-center"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#FFFFFF",
                          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {label}
                      </h3>
                    </div>
                  </button>
                </motion.div>
              );
            })}
        </div>

      </div>

      <CouponsFullScreen
        open={showCoupons}
        onClose={() => setShowCoupons(false)}
        coupons={coupons}
      />


      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              onClick={() => setLightboxImage(null)}
              data-testid="button-close-lightbox"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Navigation arrows */}
            <button
              className="absolute left-3 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              onClick={(e) => {
                e.stopPropagation();
                const prev =
                  (currentImageIndex - 1 + carouselImages.length) %
                  carouselImages.length;
                setCurrentImageIndex(prev);
                setLightboxImage(carouselImages[prev]);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              onClick={(e) => {
                e.stopPropagation();
                const next = (currentImageIndex + 1) % carouselImages.length;
                setCurrentImageIndex(next);
                setLightboxImage(carouselImages[next]);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image */}
            <motion.div
              className="relative z-[1] w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.url}
                alt={lightboxImage.alt}
                className="w-full rounded-xl object-contain"
                style={{ maxHeight: "80vh" }}
              />
              {/* Dot indicators */}
              <div className="flex justify-center gap-1.5 mt-4">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                      setLightboxImage(carouselImages[idx]);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex
                        ? "bg-white w-5"
                        : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingButtons isMenuOpen={showHamburgerMenu} />
    </div>
  );
}
