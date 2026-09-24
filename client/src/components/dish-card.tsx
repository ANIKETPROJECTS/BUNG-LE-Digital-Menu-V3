import { useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@shared/schema";
const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";
const soupManchowImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093033/tarang-assets/image_1776791999539.png";
const soupSweetcornImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093030/tarang-assets/image_1776791301049.jpg";
const soupHotSourImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093032/tarang-assets/image_1776791407057.jpg";
const soupLemonCorianderImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093031/tarang-assets/image_1776791332518.jpg";
const soupClearImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093035/tarang-assets/image_1776792098937.jpg";
const soupTomatoCreamImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093034/tarang-assets/image_1776792056827.png";
const soupTomatoBowlImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093032/tarang-assets/image_1776791355739.jpg";
const soupMushroomCreamImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093030/tarang-assets/image_1776791265999.jpg";

const NAME_IMAGE_OVERRIDES: { match: (n: string) => boolean; image: string }[] = [
  { match: (n) => n.includes("manchow"), image: soupManchowImg },
  { match: (n) => n.includes("sweet") && n.includes("corn"), image: soupSweetcornImg },
  { match: (n) => n.includes("hot") && n.includes("sour"), image: soupHotSourImg },
  { match: (n) => n.includes("lemon") && n.includes("coriander"), image: soupLemonCorianderImg },
  { match: (n) => n.includes("broccoli"), image: soupLemonCorianderImg },
  { match: (n) => n.includes("burnt") && n.includes("garlic") && n.includes("soup"), image: soupMushroomCreamImg },
  { match: (n) => n.includes("cream") && n.includes("mushroom"), image: soupMushroomCreamImg },
  { match: (n) => n.includes("cream") && n.includes("tomato"), image: soupTomatoCreamImg },
  { match: (n) => n.includes("mushroom") && n.includes("tomato"), image: soupMushroomCreamImg },
  { match: (n) => n.includes("tomato") && n.includes("soup"), image: soupTomatoBowlImg },
  { match: (n) => n.includes("clear") && n.includes("soup"), image: soupClearImg },
];

function getOverrideImage(name: string): string | null {
  const n = name.toLowerCase();
  for (const o of NAME_IMAGE_OVERRIDES) {
    if (o.match(n)) return o.image;
  }
  return null;
}

interface DishCardProps {
  item: MenuItem;
  onClick?: (item: MenuItem) => void;
}

export default function DishCard({ item, onClick }: DishCardProps) {
  const [imgError, setImgError] = useState(false);
  const override = getOverrideImage(item.name);
  const isPlaceholderImage = !item.image ||
    item.image.includes("example.com") ||
    item.image.includes("unsplash.com") ||
    item.image.includes("placeholder.com") ||
    item.image.includes("via.placeholder.com");
  const imageUrl = imgError
    ? (override ?? fallbackImg)
    : isPlaceholderImage
      ? (override ?? fallbackImg)
      : item.image;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className={`overflow-hidden h-full flex flex-col transition-all duration-300${onClick ? " cursor-pointer" : ""}`}
      style={{
        borderRadius: "10px",
        backgroundColor: "var(--bb-card)",
        border: "1px solid var(--bb-border)",
      }}
      onClick={() => onClick?.(item)}
      onKeyDown={event => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick(item);
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View details for ${item.name}` : undefined}
      data-testid={`card-dish-${item._id?.toString()}`}
    >
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: "10px 10px 0 0" }}>
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div
            className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 shadow-sm ${
              item.isVeg ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300'
            }`}
          />
        </div>

        {/* Text content — fixed-height rows so all cards align */}
        <div className="p-2 md:p-3 flex flex-col flex-1">

          {/* Name — always exactly 2 lines tall */}
          <div
            style={{
              height: "2.6em",
              lineHeight: "1.3em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <h3
              className="text-sm md:text-base font-semibold tracking-wide uppercase"
              style={{
                color: "var(--bb-gold)",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: "1.3em",
              }}
            >
              {item.name}
            </h3>
          </div>

          {/* Description — single line, truncated with ellipsis */}
          <p
            className="text-xs md:text-sm mt-1 truncate"
            style={{
              color: "var(--bb-text)",
              fontFamily: "'DM Sans', sans-serif",
              opacity: 0.8,
            }}
          >
            {item.description}
          </p>

          {/* Price — pushed to bottom */}
          <div className="mt-auto pt-2" style={{ borderTop: "1px solid var(--bb-border)" }}>
            <div className="flex justify-center">
              <span
                className="font-bold text-sm md:text-base tracking-wide"
                style={{ color: "var(--bb-gold-2)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {typeof item.price === "string" && item.price.includes("|")
                  ? item.price.split("|").map(p => `₹${p.trim()}`).join(" | ")
                  : `₹${item.price}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
