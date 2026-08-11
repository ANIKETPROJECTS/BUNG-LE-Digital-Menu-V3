import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/hamburger-menu";
import HeaderActions from "@/components/header-actions";
import StatusBar from "@/components/status-bar";
import { useOrder } from "@/contexts/OrderContext";
import { useQuery } from "@tanstack/react-query";
import type { OfferTileImages } from "@shared/schema";

const FALLBACK_COCKTAILS = "https://res.cloudinary.com/dui1jsojt/image/upload/v1778699287/tarang-assets/ai_cocktails_hero.png";
const FALLBACK_MOCKTAILS = "https://res.cloudinary.com/dui1jsojt/image/upload/v1778699287/tarang-assets/ai_mocktails_hero.png";

export default function MocktailsCocktails() {
  const [, setLocation] = useLocation();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  useOrder();

  const { data: offerTileImages } = useQuery<OfferTileImages>({
    queryKey: ["/api/offer-tile-images"],
  });

  const cocktailsImg = offerTileImages?.cocktailsImageUrl || FALLBACK_COCKTAILS;
  const mocktailsImg = offerTileImages?.mocktailsImageUrl || FALLBACK_MOCKTAILS;

  const offerTiles = [
    { id: "offer-cocktails", label: "COCKTAILS", image: cocktailsImg, route: "/menu/bar/offer-cocktails" },
    { id: "offer-mocktails", label: "MOCKTAILS", image: mocktailsImg, route: "/menu/bar/offer-mocktails" },
  ];

  const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";

  return (
    <div className="bb-bg min-h-screen">
      <header className="bb-header sticky top-0 z-30">
        <div className="container mx-auto px-2 sm:px-4 pt-1 pb-2.5">
          <div className="flex items-center w-full">
            <div className="flex items-center flex-shrink-0" style={{ width: "44px" }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/menu")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "#333333" }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            <div className="flex-1 flex justify-center items-center overflow-visible">
              <button
                onClick={() => setLocation("/menu")}
                className="hover:bg-transparent"
                aria-label="Go to home"
                data-testid="button-logo-home"
              >
                <img
                  src="/welcome-custom-logo.png"
                  alt="Bung-le"
                  style={{ height: "68px", width: "68px", objectFit: "contain", display: "block", transform: "scale(1.45)", transformOrigin: "center", marginTop: "8px" }}
                  data-testid="img-logo"
                />
              </button>
            </div>

            <div className="flex justify-end items-center gap-1 flex-shrink-0">
              <HeaderActions color="var(--bb-gold)" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                style={{ color: "#333333" }}
                data-testid="button-menu-toggle"
              >
                {showHamburgerMenu ? (
                  <X className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                ) : (
                  <MenuIcon className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <HamburgerMenu
          isOpen={showHamburgerMenu}
          onClose={() => setShowHamburgerMenu(false)}
          onCategoryClick={(id) => {
            if (id === "mocktails") setLocation("/menu/bar/mocktails-drinks");
            else if (id === "cocktails") setLocation("/menu/bar/cocktails");
            else if (id === "desserts") setLocation("/menu/desserts/desserts");
            else setLocation(`/menu/${id}`);
          }}
        />
      </header>

      <StatusBar />

      <div className="container mx-auto px-3 sm:px-4 pt-6 pb-24">
        {/* Page heading with red ribbon */}
        <div className="flex justify-center mb-6">
          <span
            className="block text-[13px] font-black uppercase tracking-wider pl-4 pr-6 py-2"
            style={{
              background: "#DC2626",
              color: "#FFFFFF",
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.35)",
              lineHeight: 1.2,
            }}
          >
            BUY 1 GET 1 FREE
          </span>
        </div>

        {/* Two offer tiles */}
        <div className="grid grid-cols-2 gap-3">
          {offerTiles.map((tile, index) => {
            const imgSrc = failedImages.has(tile.id) ? fallbackImg : tile.image;
            return (
              <motion.div
                key={tile.id}
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
                  onClick={() => setLocation(tile.route)}
                  className="group overflow-hidden"
                  style={{
                    borderRadius: "8px",
                    display: "block",
                    width: "100%",
                    aspectRatio: "1 / 1.05",
                    position: "relative",
                  }}
                  data-testid={`tile-${tile.id}`}
                >
                  <img
                    src={imgSrc}
                    alt={tile.label}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-110"
                    onError={() => setFailedImages((prev) => new Set(prev).add(tile.id))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3">
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest uppercase text-center"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#FFFFFF",
                        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {tile.label}
                    </h3>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
