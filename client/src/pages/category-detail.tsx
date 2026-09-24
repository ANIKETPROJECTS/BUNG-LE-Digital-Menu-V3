import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, ChevronLeft, ChevronRight, Mic, MicOff } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
// @ts-ignore
import panAnimation from "@assets/Animaed_pan_1773736045253.json";
import DishCard from "@/components/dish-card";
import DishDetailModal from "@/components/dish-detail-modal";
import FloatingButtons from "@/components/floating-buttons";
import HeaderActions from "@/components/header-actions";
import StatusBar from "@/components/status-bar";
import { getMainCategory, getSubcategoryIds } from "@/lib/menu-categories";
import { useTheme } from "@/contexts/ThemeContext";
import { useOrder } from "@/contexts/OrderContext";
import type { MenuItem } from "@shared/schema";

const nibblesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092685/tarang-assets/image_1765861653339.png";
const titbitsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092686/tarang-assets/image_1765861734899.png";
const soupsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092689/tarang-assets/image_1765861784186.png";
const saladsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092690/tarang-assets/image_1765861993529.png";
const startersImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092691/tarang-assets/image_1765862083770.png";
const charcoalImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092692/tarang-assets/image_1765862103291.png";
const pastaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092694/tarang-assets/image_1765862151515.png";
const pizzaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092697/tarang-assets/image_1765862533698.png";
const slidersImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092698/tarang-assets/image_1765862611064.png";
const entreeImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092700/tarang-assets/image_1765862689473.png";
const baoDimsumImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092701/tarang-assets/image_1765862739110.png";
const curriesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092706/tarang-assets/image_1765862783811.png";
const biryaniImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092707/tarang-assets/image_1765862804295.png";
const riceImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092708/tarang-assets/image_1765862832303.png";
const dalsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092709/tarang-assets/image_1765862864030.png";
const breadsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092712/tarang-assets/image_1765862911256.png";
const asianMainsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092713/tarang-assets/image_1765862935848.png";
const thaiBowlsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092714/tarang-assets/image_1765862959084.png";
const riceNoodlesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092715/tarang-assets/image_1765862986138.png";
const sizzlersImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092716/tarang-assets/image_1765863042831.png";
const blendedWhiskyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092717/tarang-assets/image_1765863859085.png";
const blendedScotchWhiskyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092718/tarang-assets/image_1765863885349.png";
const americanIrishWhiskeyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092720/tarang-assets/image_1765863999733.png";
const singleMaltWhiskyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092720/tarang-assets/image_1765864037279.png";
const vodkaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092721/tarang-assets/image_1765864071875.png";
const ginImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092722/tarang-assets/image_1765864086244.png";
const rumImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092723/tarang-assets/image_1765864174592.png";
const tequilaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092724/tarang-assets/image_1765864191436.png";
const cognacBrandyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092726/tarang-assets/image_1765864219488.png";
const liqueursImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092727/tarang-assets/image_1765864273630.png";
const sparklingWineImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092728/tarang-assets/image_1765864313974.png";
const whiteWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092729/tarang-assets/image_1765864338087.png";
const roseWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092732/tarang-assets/image_1765864363438.png";
const redWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092733/tarang-assets/image_1765864393053.png";
const dessertWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092734/tarang-assets/image_1765864417149.png";
const portWineImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092735/tarang-assets/image_1765864441224.png";
const signatureMocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092737/tarang-assets/image_1765865243299.png";
const softBeveragesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092736/tarang-assets/image_1765865174044.png";
const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";

interface ISpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

const subcategoryImages: Record<string, string> = {
  nibbles: nibblesImg,
  titbits: titbitsImg,
  soups: soupsImg,
  salads: saladsImg,
  starters: startersImg,
  charcoal: charcoalImg,
  pasta: pastaImg,
  pizza: pizzaImg,
  sliders: slidersImg,
  entree: entreeImg,
  "bao-dimsum": baoDimsumImg,
  curries: curriesImg,
  biryani: biryaniImg,
  rice: riceImg,
  dals: dalsImg,
  breads: breadsImg,
  "asian-mains": asianMainsImg,
  "thai-bowls": thaiBowlsImg,
  "rice-noodles": riceNoodlesImg,
  "rice-&-noodles": riceNoodlesImg,
  sizzlers: sizzlersImg,
  "blended-whisky": blendedWhiskyImg,
  "blended-scotch-whisky": blendedScotchWhiskyImg,
  "american-irish-whiskey": americanIrishWhiskeyImg,
  "single-malt-whisky": singleMaltWhiskyImg,
  vodka: vodkaImg,
  gin: ginImg,
  rum: rumImg,
  tequila: tequilaImg,
  "cognac-brandy": cognacBrandyImg,
  liqueurs: liqueursImg,
  "sparkling-wine": fallbackImg,
  "white-wines": fallbackImg,
  "rose-wines": fallbackImg,
  "red-wines": fallbackImg,
  "dessert-wines": fallbackImg,
  "port-wine": fallbackImg,
  "signature-mocktails": signatureMocktailsImg,
  "soft-beverages": softBeveragesImg,
  desserts: signatureMocktailsImg,
};

export default function CategoryDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string }>();
  const categoryId = params.category || "food";
  const { isDark } = useTheme();
  useOrder();
  const pageBg = isDark ? "#000000" : "#FFFFFF";
  const subBgInactive = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const labelInactive = isDark ? "#DCD4C8" : "#5A3E00";

  const mainCategory = getMainCategory(categoryId);
  const subcategories = mainCategory?.subcategories || [];
  const validSubcategoryIds = getSubcategoryIds(categoryId);

  const [activeSubcategory, setActiveSubcategory] = useState(
    subcategories.length > 0 ? subcategories[0].id : ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<ISpeechRecognition | null>(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setSpeechRecognition(recognition);
      setVoiceSearchSupported(true);
    }
  }, []);

  useEffect(() => {
    if (subcategories.length > 0 && !subcategories.find(s => s.id === activeSubcategory)) {
      setActiveSubcategory(subcategories[0].id);
    }
  }, [categoryId, subcategories, activeSubcategory]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.isAvailable) return false;

      if (searchQuery.trim()) {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = validSubcategoryIds.includes(item.category);
        return matchesSearch && matchesCategory;
      }

      const activeSubcat = subcategories.find(s => s.id === activeSubcategory);
      return item.category === activeSubcat?.dbCategory;
    });
  }, [menuItems, activeSubcategory, searchQuery, subcategories, validSubcategoryIds]);

  const startVoiceSearch = () => {
    if (speechRecognition && voiceSearchSupported) {
      try {
        speechRecognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  const scrollSubcategories = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  if (!mainCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: pageBg }}>
        <p style={{ color: isDark ? "#DCD4C8" : "#1a1a1a" }}>Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBg }}>
      <header className="sticky top-0 z-30 elegant-shadow" style={{ backgroundColor: pageBg }}>
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/menu")}
              className="hover:bg-transparent flex-shrink-0"
              style={{ color: "#E49B1D" }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            <h1
              className="font-semibold tracking-widest uppercase text-center flex-1"
              style={{
                fontSize: "clamp(14px, 4vw, 20px)",
                color: "#E49B1D",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {mainCategory.displayLabel}
            </h1>

            <HeaderActions color="#E49B1D" />
          </div>
        </div>
      </header>

      <StatusBar />

      <div className="container mx-auto px-3 sm:px-4 py-4 pb-24">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "#E49B1D" }} />
          <Input
            type="text"
            placeholder={`Search ${mainCategory.displayLabel.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-11 rounded-full border-2 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-[#E49B1D]/40 bg-transparent"
            style={{ borderColor: "#E49B1D" }}
            data-testid="input-search"
          />
          {voiceSearchSupported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={isListening ? undefined : startVoiceSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 hover:bg-transparent"
              data-testid="button-voice-search"
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" style={{ color: "#E49B1D" }} />
              )}
            </Button>
          )}
        </div>

        <div className="relative mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollSubcategories("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full h-8 w-8 hover:bg-transparent"
            style={{ backgroundColor: "rgba(228,155,29,0.15)", color: "#E49B1D" }}
            data-testid="button-scroll-left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-3 px-8 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subcategories.map((subcat) => (
              <motion.button
                key={subcat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveSubcategory(subcat.id);
                  setSearchQuery("");
                }}
                className="flex-shrink-0 flex flex-col items-center p-2 rounded-xl transition-all duration-200 min-w-[80px]"
                style={{
                  backgroundColor: activeSubcategory === subcat.id ? "rgba(228,155,29,0.2)" : subBgInactive,
                  border: activeSubcategory === subcat.id ? "2px solid #E49B1D" : "2px solid rgba(228,155,29,0.2)",
                }}
                data-testid={`subcategory-${subcat.id}`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden mb-1">
                  <img
                    src={failedImages.has(subcat.id) ? fallbackImg : (subcategoryImages[subcat.id] || nibblesImg)}
                    alt={subcat.displayLabel}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setFailedImages(prev => new Set(prev).add(subcat.id));
                    }}
                  />
                </div>
                <span
                  className="text-[10px] font-medium text-center leading-tight tracking-widest uppercase"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: activeSubcategory === subcat.id ? "#E49B1D" : "#DCD4C8",
                  }}
                >
                  {subcat.displayLabel}
                </span>
              </motion.button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollSubcategories("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full h-8 w-8 hover:bg-transparent"
            style={{ backgroundColor: "rgba(228,155,29,0.15)", color: "#E49B1D" }}
            data-testid="button-scroll-right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Lottie animationData={panAnimation} loop autoplay style={{ width: 160, height: 160 }} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
            <Search className="h-12 w-12 mb-4" style={{ color: "rgba(228,155,29,0.4)" }} />
            <h3 className="text-lg font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E49B1D", fontFamily: "'DM Sans', sans-serif" }}>
              No items found
            </h3>
            <p className="text-sm" style={{ color: "#DCD4C8", opacity: 0.6 }}>
              {searchQuery ? `No results for "${searchQuery}"` : "No items available in this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id?.toString() || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <DishCard item={item} onClick={setSelectedDish} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <DishDetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
      <FloatingButtons />
    </div>
  );
}
