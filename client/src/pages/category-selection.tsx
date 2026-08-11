import { motion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X, Search, Mic, MicOff, Loader2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useOrder } from "@/contexts/OrderContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import HamburgerMenu from "@/components/hamburger-menu";
import HeaderActions from "@/components/header-actions";
import StatusBar from "@/components/status-bar";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MenuItem, MenuCategory, MenuSubCategory } from "@shared/schema";

type CategoryNode = (MenuCategory | MenuSubCategory) & { subcategories: MenuSubCategory[] };

function findNodeInTree(categories: MenuCategory[], id: string): CategoryNode | null {
  for (const cat of categories) {
    if (cat.id === id) return cat as CategoryNode;
    const found = findSubNode(cat.subcategories, id);
    if (found) return found;
  }
  return null;
}

function findSubNode(subcategories: MenuSubCategory[], id: string): CategoryNode | null {
  for (const sub of subcategories) {
    if (sub.id === id) return sub as CategoryNode;
    if (sub.subcategories?.length) {
      const found = findSubNode(sub.subcategories, id);
      if (found) return found;
    }
  }
  return null;
}

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

import FloatingButtons from "@/components/floating-buttons";
import type { Logo } from "@shared/schema";
const sangriaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092762/tarang-assets/image_1767545808245.png";
const classicCocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092763/tarang-assets/image_1767545845465.png";
const signatureCocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092771/tarang-assets/image_1767546048894.png";
const wineCocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092764/tarang-assets/image_1767545904457.png";
const signatureShotsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092767/tarang-assets/image_1767545936498.png";
const mangaloreanImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092744/tarang-assets/image_1767538398708.png";
const signatureMocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092737/tarang-assets/image_1765865243299.png";
const softBeveragesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092736/tarang-assets/image_1765865174044.png";
const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";

const blendedWhiskyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093051/tarang-assets/image_1776838621162.jpg";
const blendedScotchWhiskyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093054/tarang-assets/image_1776838776054.jpg";
const americanIrishWhiskeyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093053/tarang-assets/image_1776838705753.jpg";
const singleMaltWhiskyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093052/tarang-assets/image_1776838685584.jpg";
const vodkaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093054/tarang-assets/image_1776838821499.jpg";
const ginImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093055/tarang-assets/image_1776838846551.jpg";
const rumImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093056/tarang-assets/image_1776838895112.jpg";
const tequilaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093048/tarang-assets/image_1776838419227.jpg";
const cognacBrandyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093057/tarang-assets/image_1776838913496.jpg";
const liqueursImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093049/tarang-assets/image_1776838532614.png";
const barCocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093047/tarang-assets/image_1776838373181.jpg";
const barBeerImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093049/tarang-assets/image_1776838494451.jpg";
const barWineImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093050/tarang-assets/image_1776838566790.jpg";
const barBeveragesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093052/tarang-assets/image_1776838668811.png";
const sparklingWineImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092728/tarang-assets/image_1765864313974.png";
const whiteWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092729/tarang-assets/image_1765864338087.png";
const roseWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092732/tarang-assets/image_1765864363438.png";
const redWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092733/tarang-assets/image_1765864393053.png";
const dessertWinesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092734/tarang-assets/image_1765864417149.png";
const portWineImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092735/tarang-assets/image_1765864441224.png";

const nibblesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092740/tarang-assets/image_1767537969124.png";
const titbitsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092741/tarang-assets/image_1767538122517.png";
const soupsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092689/tarang-assets/image_1765861784186.png";
const saladsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092743/tarang-assets/image_1767538266582.png";
const startersImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092691/tarang-assets/image_1765862083770.png";
const charcoalImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092745/tarang-assets/image_1767539363565.png";
const pastaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092747/tarang-assets/image_1767539686923.png";
const pizzaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092748/tarang-assets/image_1767539726872.png";
const slidersImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092749/tarang-assets/image_1767539763570.png";
const entreeImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092752/tarang-assets/image_1767540494821.png";
const baoDimsumImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092752/tarang-assets/image_1767540547633.png";
const curriesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092761/tarang-assets/image_1767544842804.png";
const biryaniImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092753/tarang-assets/image_1767540755506.png";
const riceImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092708/tarang-assets/image_1765862832303.png";
const dalsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092755/tarang-assets/image_1767540786968.png";
const breadsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092756/tarang-assets/image_1767540967353.png";
const asianMainsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092757/tarang-assets/image_1767544426904.png";
const thaiBowlsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092758/tarang-assets/image_1767544482541.png";
const riceNoodlesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092760/tarang-assets/image_1767544566928.png";
const continentalImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092746/tarang-assets/image_1767539626901.png";
const sizzlersImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092772/tarang-assets/image_1771582754596.jpg";

const pintBeerImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093083/tarang-assets/pint_beer_1766834179092.png";
const craftBeerOnTapImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092669/tarang-assets/Craftbeerontap_1766834179093.png";
const draughtBeerImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092671/tarang-assets/Draught_beer-min_1766834686357.png";
const beerCocktailImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092680/tarang-assets/beer_cocktail_1768238826587.jpg";
const wineImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092772/tarang-assets/image_1768239070678.png";

const khanePeeneImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092773/tarang-assets/image_1776748663858.jpg";
const continentalVegImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092774/tarang-assets/image_1776748745623.jpg";
const continentalNonVegImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092775/tarang-assets/image_1776748813278.jpg";
const pastaNewImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092776/tarang-assets/image_1776750646640.jpg";
const pizzaNewImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092777/tarang-assets/image_1776750693771.jpg";
const tandoorVegImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092778/tarang-assets/image_1776750775671.jpg";
const tandoorNonVegImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092778/tarang-assets/image_1776750952941.jpg";
const orientalStarterNonVegImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092779/tarang-assets/image_1776751007687.jpg";
const saladRaitaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092780/tarang-assets/image_1776752436882.jpg";
const dessertsNewImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092781/tarang-assets/image_1776752566455.jpg";
const basmatiImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092781/tarang-assets/image_1776752661151.jpg";
const dalsNewImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092782/tarang-assets/image_1776752707773.jpg";
const orientalCurriesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092783/tarang-assets/image_1776752871724.jpg";
const friedRiceNoodlesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092784/tarang-assets/image_1776752946394.jpg";
const agriStyleImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092784/tarang-assets/image_1776753039521.jpg";
const rotisNewImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092785/tarang-assets/image_1776757042346.jpg";
const murgEKhaasImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093024/tarang-assets/image_1776757099680.jpg";
const goshtEKhaasImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093025/tarang-assets/image_1776757268424.jpg";
const jalpariSpecialImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093026/tarang-assets/image_1776758250780.jpg";
const sabziTarkariImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093026/tarang-assets/image_1776758310412.jpg";
const dessertImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092670/tarang-assets/DESSERT_1771583946302.jpg";

const subcategoryImages: Record<string, string> = {
  "signature-mocktails": signatureMocktailsImg,
  "soft-beverages": softBeveragesImg,
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
  wine: wineImg,
  "sparkling-wine": fallbackImg,
  "white-wines": fallbackImg,
  "rose-wines": fallbackImg,
  "red-wines": fallbackImg,
  "dessert-wines": fallbackImg,
  "port-wine": fallbackImg,
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
  "mangalorean-style": mangaloreanImg,
  wok: asianMainsImg,
  continental: continentalImg,
  "artisan-pizzas": pizzaImg,
  "mini-burger-sliders": slidersImg,
  "indian-mains-curries": curriesImg,
  "biryanis-rice": biryaniImg,
  "rice-with-curry---thai-asian-bowls": thaiBowlsImg,
  "thai-bowls": thaiBowlsImg,
  "rice-noodles": riceNoodlesImg,
  sizzlers: sizzlersImg,
  "pint-beers": pintBeerImg,
  "craft-beers-on-tap": craftBeerOnTapImg,
  "draught-beer": draughtBeerImg,
  "sangria": sangriaImg,
  "classic-cocktails": classicCocktailsImg,
  "signature-cocktails": signatureCocktailsImg,
  "wine-cocktails": wineCocktailsImg,
  "signature-shots": signatureShotsImg,
  "classic-shots": signatureShotsImg,
  "beer-cocktail": beerCocktailImg,
  desserts: dessertImg,
  "khane-peene": khanePeeneImg,
  "continental-veg": continentalVegImg,
  "continental-non-veg": continentalNonVegImg,
  "tandoor-veg": tandoorVegImg,
  "tandoor-non-veg": tandoorNonVegImg,
  "oriental-starter-non-veg": orientalStarterNonVegImg,
};

subcategoryImages.pasta = pastaNewImg;
subcategoryImages.pizza = pizzaNewImg;
subcategoryImages["salad-raita"] = saladRaitaImg;
subcategoryImages.desserts = dessertsNewImg;
subcategoryImages["basmati-ki-khushbu"] = basmatiImg;
subcategoryImages.dals = dalsNewImg;
subcategoryImages["oriental-curries"] = orientalCurriesImg;
subcategoryImages["fried-rice-noodles"] = friedRiceNoodlesImg;
subcategoryImages["agri-style"] = agriStyleImg;
subcategoryImages.rotis = rotisNewImg;
subcategoryImages["murg-e-khaas"] = murgEKhaasImg;
subcategoryImages["gosht-e-khaas"] = goshtEKhaasImg;
subcategoryImages["jalpari-special"] = jalpariSpecialImg;
subcategoryImages["sabzi-tarkari"] = sabziTarkariImg;

subcategoryImages["cocktails"] = barCocktailsImg;
subcategoryImages["mocktails-drinks"] = "https://res.cloudinary.com/dui1jsojt/image/upload/v1778700646/tarang-assets/bar_mocktails_drinks_1778700644359.png";
subcategoryImages["shots"] = tequilaImg;
subcategoryImages["beer"] = barBeerImg;
subcategoryImages["alcopops"] = liqueursImg;
subcategoryImages["wine"] = barWineImg;
subcategoryImages["liquor"] = blendedScotchWhiskyImg;
subcategoryImages["beverages"] = barBeveragesImg;
subcategoryImages["whisky"] = blendedWhiskyImg;
subcategoryImages["single-malt"] = singleMaltWhiskyImg;
subcategoryImages["bourbon-irish"] = americanIrishWhiskeyImg;
subcategoryImages["vodka"] = vodkaImg;
subcategoryImages["gin"] = ginImg;
subcategoryImages["rum"] = rumImg;
subcategoryImages["brandy"] = cognacBrandyImg;

export default function CategorySelection() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string }>();
  const categoryId = params.category || "mocktails";
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const { t } = useLanguage();
  const { isDark } = useTheme();
  useOrder();
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<ISpeechRecognition | null>(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const { data: menuCategories = [], isLoading: isLoadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });

  const mainCategory = findNodeInTree(menuCategories, categoryId);
  const subcategories = mainCategory?.subcategories || [];

  const getInitialVegFilter = () => {
    try {
      const saved = localStorage.getItem("foodVegFilter");
      return (saved as "all" | "veg" | "non-veg") || "all";
    } catch {
      return "all";
    }
  };

  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">(getInitialVegFilter);

  const { data: allMenuItems = [], isLoading: isLoadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    enabled: categoryId === "food" || categoryId === "bar"
  });

  // For leaf categories with no subcategories, fetch their items directly
  const isLeafCategory = !isLoadingCategories && mainCategory !== null && subcategories.length === 0
    && categoryId !== "food" && categoryId !== "bar" && categoryId !== "mocktails";

  const [directSearchQuery, setDirectSearchQuery] = useState("");
  const [directVegFilter, setDirectVegFilter] = useState<"all" | "veg" | "non-veg">("all");

  const { data: directItems = [], isLoading: isLoadingDirect } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items", categoryId],
    queryFn: async () => {
      const res = await fetch(`/api/menu-items?category=${encodeURIComponent(categoryId)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: isLeafCategory,
    staleTime: 5 * 60 * 1000,
  });

  const filteredDirectItems = useMemo(() => {
    let items = directItems.filter(i => i.isAvailable);
    if (directVegFilter === "veg") items = items.filter(i => i.isVeg);
    else if (directVegFilter === "non-veg") items = items.filter(i => !i.isVeg);
    if (directSearchQuery.trim()) {
      const q = directSearchQuery.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return items;
  }, [directItems, directVegFilter, directSearchQuery]);

  const { data: logoData } = useQuery<Logo>({
    queryKey: ["/api/logo"],
  });
  const logoUrl = logoData?.url || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, foodSearchQuery]);

  useEffect(() => {
    if (categoryId === "mocktails" && subcategories.length > 0) {
      setLocation(`/menu/mocktails/${subcategories[0].id}`, { replace: true });
    }
  }, [categoryId, subcategories, setLocation]);

  useEffect(() => {
    try {
      localStorage.setItem("foodVegFilter", vegFilter);
    } catch {
      // Ignore localStorage errors
    }
  }, [vegFilter]);

  const filteredItems = useMemo(() => {
    if ((categoryId !== "food" && categoryId !== "bar") || !foodSearchQuery.trim()) {
      return [];
    }
    const query = foodSearchQuery.toLowerCase();
    return allMenuItems.filter(item => {
      // Get category ID in lowercase for matching
      const itemCategory = item.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
      
      const isCorrectCategory = categoryId === "food" 
        ? ["nibbles", "titbits", "soups", "salads", "starters", "charcoal", "pasta", "pizza", "sliders", "entree", "bao-dimsum", "curries", "biryani", "rice", "dals", "breads", "asian-mains", "thai-bowls", "rice-noodles", "sizzlers", "desserts", "tandoor-starters", "oriental-starters", "rice-with-curry---thai-asian-bowls", "biryanis-rice", "rice-&-noodles"].includes(itemCategory)
        : ["blended-whisky", "blended-scotch-whisky", "american-irish-whiskey", "single-malt-whisky", "vodka", "gin", "rum", "tequila", "cognac-brandy", "liqueurs", "sparkling-wine", "white-wines", "rose-wines", "red-wines", "dessert-wines", "port-wine", "signature-mocktails", "soft-beverages"].includes(itemCategory);
      
      const matchesSearch = item.name.toLowerCase().includes(query) || 
                          item.description.toLowerCase().includes(query);
      
      const matchesVeg = vegFilter === "all" || 
                        (vegFilter === "veg" && item.isVeg) || 
                        (vegFilter === "non-veg" && !item.isVeg);

      return isCorrectCategory && matchesSearch && matchesVeg && item.isAvailable;
    });
  }, [allMenuItems, foodSearchQuery, categoryId, vegFilter]);

  const filteredSubcategories = useMemo(() => {
    if (categoryId === "food") {
      return subcategories.filter((s) => s.id !== "desserts");
    }
    if (categoryId === "bar") {
      const filtered = subcategories.filter(
        (s) => s.id !== "offer-cocktails" && s.id !== "offer-mocktails"
      );
      const cocktailsIdx = filtered.findIndex((s) => s.id === "cocktails");
      const mocktailsIdx = filtered.findIndex((s) => s.id === "mocktails-drinks");
      if (cocktailsIdx !== -1 && mocktailsIdx !== -1 && mocktailsIdx !== cocktailsIdx + 1) {
        const reordered = [...filtered];
        const [mocktailsItem] = reordered.splice(mocktailsIdx, 1);
        reordered.splice(cocktailsIdx + 1, 0, mocktailsItem);
        return reordered;
      }
      return filtered;
    }
    return subcategories;
  }, [subcategories, categoryId]);

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
        setFoodSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setSpeechRecognition(recognition);
      setVoiceSearchSupported(true);
    }
  }, []);

  const startVoiceSearch = () => {
    if (speechRecognition && voiceSearchSupported) {
      try {
        speechRecognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  const handleSubcategoryClick = (subcat: MenuSubCategory) => {
    if (subcat.subcategories && subcat.subcategories.length > 0) {
      setLocation(`/menu/${subcat.id}`);
    } else {
      setLocation(`/menu/${categoryId}/${subcat.id}`);
    }
  };

  const handleCategoryClick = (catId: string) => {
    setLocation(`/menu/${catId}`);
  };

  if (isLoadingCategories) {
    return (
      <div className="bb-bg min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--bb-gold)" }} />
      </div>
    );
  }

  if (!mainCategory) {
    return (
      <div className="bb-bg min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--bb-text)" }}>Category not found</p>
      </div>
    );
  }

  return (
    <div className="bb-bg min-h-screen">
      <header className="bb-header sticky top-0 z-30 elegant-shadow">
        <div className="container mx-auto px-2 sm:px-4 py-1">
          <div className="relative flex items-center w-full h-12">
            <div className="flex items-center flex-shrink-0" style={{ width: "44px" }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/menu")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "#E8D8B4" }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
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
                   style={{ height: "52px", width: "112px", objectFit: "contain", display: "block" }}
                  data-testid="img-logo"
                />
              </button>
            </div>

            <div className="ml-auto flex justify-end items-center gap-1 flex-shrink-0 z-10">
              <HeaderActions color="var(--bb-gold)" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                style={{ color: "#E8D8B4" }}
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
          onCategoryClick={handleCategoryClick}
        />
      </header>

      <StatusBar />

      <div className="container mx-auto px-4 py-4 pb-24">
        <h1
          className="text-xl sm:text-2xl font-semibold tracking-widest uppercase text-center mb-2"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--bb-gold)",
          }}
        >
          {mainCategory.title}
        </h1>

        {(categoryId === "food" || categoryId === "bar") && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t.searchItems}
              value={foodSearchQuery}
              onChange={(e) => setFoodSearchQuery(e.target.value)}
              className="pl-10 pr-32 sm:pr-40 h-11 rounded-full border-2 text-[var(--bb-input-text)] placeholder:text-[var(--bb-text-dim)] focus-visible:ring-2 focus-visible:ring-[#C9A55C]/50"
              style={{ 
                borderColor: '#C9A55C', 
                backgroundColor: 'transparent'
              }}
              data-testid={`input-${categoryId}-search`}
            />
            
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0">
              {categoryId === "food" && (
                <div 
                  className="inline-flex rounded-full p-0.5 items-center gap-0"
                  style={isDark ? {
                    backgroundColor: vegFilter === "all" ? "rgba(255,255,255,0.1)" : vegFilter === "veg" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"
                  } : {
                    backgroundColor: vegFilter === "all" ? "rgba(0,0,0,0.07)" : vegFilter === "veg" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(0,0,0,0.12)"
                  }}
                >
                  <button
                    onClick={() => setVegFilter("all")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-all"
                    style={
                      vegFilter === "all"
                        ? { backgroundColor: isDark ? "white" : "#1C1500", color: isDark ? "black" : "white", lineHeight: "1.2" }
                        : { color: isDark ? "#C9A55C" : "#5A3E00", lineHeight: "1.2" }
                    }
                  >
                    {t.all}
                  </button>
                  <button
                    onClick={() => setVegFilter("veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-veg"
                    style={
                      vegFilter === "veg"
                        ? { backgroundColor: "#22C55E", color: "white", lineHeight: "1.2" }
                        : { color: isDark ? "#C9A55C" : "#5A3E00", lineHeight: "1.2" }
                    }
                  >
                    {t.veg}
                  </button>
                  <button
                    onClick={() => setVegFilter("non-veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-non-veg"
                    style={
                      vegFilter === "non-veg"
                        ? { backgroundColor: "#EF4444", color: "white", lineHeight: "1.2" }
                        : { color: isDark ? "#C9A55C" : "#5A3E00", lineHeight: "1.2" }
                    }
                  >
                    {t.nonVeg}
                  </button>
                </div>
              )}

              {voiceSearchSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isListening ? undefined : startVoiceSearch}
                  className="h-9 w-9 hover:bg-transparent"
                  data-testid={`button-${categoryId}-voice-search`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" style={{ color: "var(--bb-gold)" }} />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Leaf category: no subcategories — show items directly */}
        {isLeafCategory ? (
          <>
            {/* Search + veg filter */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "var(--bb-gold)" }} />
              <Input
                type="text"
                placeholder={t.searchItems}
                value={directSearchQuery}
                onChange={(e) => setDirectSearchQuery(e.target.value)}
                className="pl-10 pr-36 h-11 rounded-full border-2 text-[var(--bb-input-text)] placeholder:text-[var(--bb-text-dim)] focus-visible:ring-2 focus-visible:ring-[#C9A55C]/50"
                style={{ borderColor: "#C9A55C", backgroundColor: "transparent" }}
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <div
                  className="inline-flex rounded-full p-0.5 items-center gap-0"
                  style={isDark
                    ? { backgroundColor: directVegFilter === "all" ? "rgba(255,255,255,0.1)" : directVegFilter === "veg" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }
                    : { backgroundColor: directVegFilter === "all" ? "rgba(0,0,0,0.07)" : directVegFilter === "veg" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border: "1px solid rgba(0,0,0,0.12)" }}
                >
                  {(["all", "veg", "non-veg"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setDirectVegFilter(f)}
                      className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                      style={directVegFilter === f
                        ? { backgroundColor: f === "veg" ? "#22C55E" : f === "non-veg" ? "#EF4444" : isDark ? "white" : "#1C1500", color: f === "all" && isDark ? "black" : "white", lineHeight: "1.2" }
                        : { color: isDark ? "#C9A55C" : "#5A3E00", lineHeight: "1.2" }}
                    >
                      {f === "all" ? t.all : f === "veg" ? t.veg : t.nonVeg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isLoadingDirect ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--bb-gold)" }} />
              </div>
            ) : filteredDirectItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <Search className="h-12 w-12 mb-4" style={{ color: "rgba(228,155,29,0.4)" }} />
                <h3 className="text-lg font-semibold mb-2 tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--bb-gold)" }}>
                  {t.noItemsFound}
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8">
                {filteredDirectItems.map((item, index) => (
                  <motion.div
                    key={item._id?.toString() || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ProductCard item={item} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (categoryId === "food" || categoryId === "bar") && foodSearchQuery.trim() ? (
          <div className="flex flex-col gap-6">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <Search className="h-12 w-12 mb-4" style={{ color: "rgba(228,155,29,0.4)" }} />
                <h3 className="text-lg font-semibold mb-2 tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--bb-gold)" }}>
                  {t.noItemsFound}
                </h3>
                <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--bb-text)", opacity: 0.6 }}>
                  {t.noResultsFor} "{foodSearchQuery}"
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item._id?.toString() || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredSubcategories.map((subcat, index) => {
              const subcatLabel = subcat.title;
              const imgSrc = failedImages.has(subcat.id)
                ? fallbackImg
                : (subcat.image || subcategoryImages[subcat.id] || fallbackImg);
              return (
                <motion.div
                  key={subcat.id}
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
                    onClick={() => handleSubcategoryClick(subcat)}
                    className="group overflow-hidden relative"
                    style={{
                      borderRadius: "8px",
                      display: "block",
                      width: "100%",
                      aspectRatio: "1 / 1.1",
                      position: "relative",
                    }}
                    data-testid={`tile-${subcat.id}`}
                  >
                    <img
                      src={imgSrc}
                      alt={subcatLabel as string}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-110"
                      onError={() => {
                        setFailedImages(prev => new Set(prev).add(subcat.id));
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3 sm:pb-4">
                      <h3
                        className="text-sm sm:text-base font-semibold tracking-widest uppercase text-center leading-tight"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#FFFFFF",
                          textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
                        }}
                      >
                        {subcatLabel}
                      </h3>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <FloatingButtons isMenuOpen={showHamburgerMenu} />
    </div>
  );
}