import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { getOverrideImage } from "@/components/product-card";

const fallbackImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [item?._id]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const override = getOverrideImage(item.name);
  const isBroken =
    imgError ||
    !item.image ||
    item.image.includes("placeholder.com") ||
    item.image.includes("example.com");
  const imageUrl = isBroken ? override ?? fallbackImg : item.image;
  const priceDisplay =
    typeof item.price === "string" && item.price.includes("|")
      ? item.price
          .split("|")
          .map((price) => `₹${price.trim()}`)
          .join("  |  ")
      : `₹${item.price}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        style={{ background: "rgba(0, 0, 0, 0.78)", backdropFilter: "blur(4px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-testid="dish-detail-backdrop"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="text-dish-name"
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{
            background: "var(--bb-card)",
            border: "1px solid var(--bb-border)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          }}
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
            <img
              src={imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close item details"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, #E49B1D, #E6C55A)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
              }}
              data-testid="button-close-dish-modal"
            >
              <X className="h-5 w-5" style={{ color: "#1A1408" }} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-3 p-5">
            <h2
              id="text-dish-name"
              className="break-words text-lg font-bold uppercase leading-snug tracking-wide"
              style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
              data-testid="text-dish-name"
            >
              {item.name}
            </h2>
            <p
              className="text-lg font-black tracking-wide"
              style={{ color: "var(--bb-gold-2)", fontFamily: "'DM Sans', sans-serif" }}
              data-testid="text-dish-price"
            >
              {priceDisplay}
            </p>
            <p
              className="whitespace-pre-wrap break-words text-sm leading-relaxed"
              style={{ color: "var(--bb-text)", fontFamily: "'DM Sans', sans-serif" }}
              data-testid="text-dish-description"
            >
              {item.description?.trim() || "Description unavailable."}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}