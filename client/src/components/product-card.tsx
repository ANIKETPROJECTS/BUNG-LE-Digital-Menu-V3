import { useState } from "react";
import { Plus, Minus, Heart, StickyNote } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { useOrder } from "@/contexts/OrderContext";
import { useMenuAccess } from "@/contexts/MenuAccessContext";
import { useFavorites } from "@/hooks/use-favorites";
import ItemNoteModal from "@/components/item-note-modal";

const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";
const soupManchowImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093033/tarang-assets/image_1776791999539.png";
const soupSweetcornImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093030/tarang-assets/image_1776791301049.jpg";
const soupHotSourImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093032/tarang-assets/image_1776791407057.jpg";
const soupLemonCorianderImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093031/tarang-assets/image_1776791332518.jpg";
const soupClearImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093035/tarang-assets/image_1776792098937.jpg";
const soupTomatoCreamImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093034/tarang-assets/image_1776792056827.png";
const soupTomatoBowlImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093032/tarang-assets/image_1776791355739.jpg";
const soupMushroomCreamImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093030/tarang-assets/image_1776791265999.jpg";

const mocktailBloodOrangeImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093038/tarang-assets/image_1776833599330.jpg";
const mocktailCherryBombImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093039/tarang-assets/image_1776833653883.jpg";
const mocktailCocoDelightImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093040/tarang-assets/image_1776833705934.jpg";
const mocktailGrapeRickeyImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093040/tarang-assets/image_1776833773881.jpg";
const mocktailKiwiDaiquiriImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093041/tarang-assets/image_1776833800599.jpg";
const mocktailPassionFruitImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093042/tarang-assets/image_1776833845254.jpg";
const mocktailSpicyGuavaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093042/tarang-assets/image_1776833896892.jpg";
const mocktailVirginMojitoImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093043/tarang-assets/image_1776833965352.jpg";
const mocktailVirginPinacoladaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093044/tarang-assets/image_1776833999860.jpg";
const mocktailWinterPunchImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093044/tarang-assets/image_1776834027249.png";

const dessertIceCreamImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093045/tarang-assets/image_1776837853758.jpg";
const dessertGulabJamunImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093046/tarang-assets/image_1776837905531.jpg";
const dessertSizzlingBrownieImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093046/tarang-assets/image_1776837922629.png";

const bhajiyaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093058/tarang-assets/image_1776839581786.jpg";
const butterCornImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093058/tarang-assets/image_1776839719203.jpg";
const kheechaPapadImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093059/tarang-assets/image_1776843231024.jpg";
const papadFryImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093060/tarang-assets/image_1776843288193.jpg";
const masalaPapadImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093060/tarang-assets/image_1776843309315.jpg";
const saltedPeanutImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093061/tarang-assets/image_1776843326947.png";

const cheeseCherryPineappleImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093062/tarang-assets/image_1776843660207.png";
const cheeseChillyToastImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093063/tarang-assets/image_1776844265977.jpg";
const cheeseCornBallsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093064/tarang-assets/image_1776844292137.jpg";
const cheeseFriesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093064/tarang-assets/image_1776844439010.jpg";
const classicFriesImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093065/tarang-assets/image_1776844464072.jpg";
const cornChatImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093065/tarang-assets/image_1776844605215.jpg";
const freshCornTacosImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093066/tarang-assets/image_1776844660397.jpg";
const garlicBreadCheeseImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093067/tarang-assets/image_1776844685250.jpg";
const mexicanNachosImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093067/tarang-assets/image_1776844703446.png";
const vegBruschettaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093068/tarang-assets/image_1776844725711.jpg";
const vegCigarRollImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093069/tarang-assets/image_1776844758488.jpg";

const chickenNachosImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093069/tarang-assets/image_1776844928013.jpg";
const chickenPopcornImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093071/tarang-assets/image_1776844943200.jpg";
const fishChipsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093071/tarang-assets/image_1776844967962.jpg";
const chickenTacosImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093072/tarang-assets/image_1776844982108.jpg";

const alfredoImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093073/tarang-assets/image_1776845316210.jpg";
const arabiataImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093074/tarang-assets/image_1776845337542.jpg";
const lasagnaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093074/tarang-assets/image_1776845396133.jpg";
const macCheeseImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093075/tarang-assets/image_1776845428956.jpg";
const paprikaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093076/tarang-assets/image_1776845477195.jpg";

const NAME_IMAGE_OVERRIDES: { match: (n: string) => boolean; image: string }[] = [
  { match: (n) => n.includes("alfredo"), image: alfredoImg },
  { match: (n) => n.includes("arabiata") || n.includes("arrabiata"), image: arabiataImg },
  { match: (n) => n.includes("lasagna") || n.includes("lasagne"), image: lasagnaImg },
  { match: (n) => n.includes("mac") && n.includes("cheese"), image: macCheeseImg },
  { match: (n) => n.includes("paprika"), image: paprikaImg },
  { match: (n) => n.includes("chicken") && n.includes("nacho"), image: chickenNachosImg },
  { match: (n) => n.includes("chicken") && n.includes("popcorn"), image: chickenPopcornImg },
  { match: (n) => n.includes("fish") && (n.includes("chips") || n.includes("finger")), image: fishChipsImg },
  { match: (n) => n.trim() === "tacos", image: chickenTacosImg },
  { match: (n) => n.includes("cheese") && n.includes("cherry") && n.includes("pineapple"), image: cheeseCherryPineappleImg },
  { match: (n) => n.includes("cheese") && n.includes("chilly") && n.includes("toast"), image: cheeseChillyToastImg },
  { match: (n) => n.includes("cheese") && n.includes("corn") && n.includes("ball"), image: cheeseCornBallsImg },
  { match: (n) => n.includes("cheese") && n.includes("fries"), image: cheeseFriesImg },
  { match: (n) => n.includes("classic") && n.includes("fries"), image: classicFriesImg },
  { match: (n) => n.includes("corn") && n.includes("chat"), image: cornChatImg },
  { match: (n) => n.includes("corn") && n.includes("taco"), image: freshCornTacosImg },
  { match: (n) => n.includes("garlic") && n.includes("bread"), image: garlicBreadCheeseImg },
  { match: (n) => n.includes("nacho"), image: mexicanNachosImg },
  { match: (n) => n.includes("bruschetta"), image: vegBruschettaImg },
  { match: (n) => n.includes("cigar") && n.includes("roll"), image: vegCigarRollImg },
  { match: (n) => n.includes("bhajiya") || n.includes("pakoda") || n.includes("pakora"), image: bhajiyaImg },
  { match: (n) => n.includes("butter corn") || n.includes("boiled chana"), image: butterCornImg },
  { match: (n) => n.includes("masala") && n.includes("kheecha"), image: kheechaPapadImg },
  { match: (n) => n.includes("kheecha"), image: kheechaPapadImg },
  { match: (n) => n.includes("masala") && n.includes("papad"), image: masalaPapadImg },
  { match: (n) => n.includes("papad"), image: papadFryImg },
  { match: (n) => n.includes("salted peanut") || n.includes("peanut"), image: saltedPeanutImg },
  { match: (n) => n.includes("ice cream") && n.includes("choice"), image: dessertIceCreamImg },
  { match: (n) => n.includes("gulab") && n.includes("jamun"), image: dessertGulabJamunImg },
  { match: (n) => n.includes("sizzling") && n.includes("brownie"), image: dessertSizzlingBrownieImg },
  { match: (n) => n.includes("blood") && n.includes("orange"), image: mocktailBloodOrangeImg },
  { match: (n) => n.includes("cherry") && n.includes("bomb"), image: mocktailCherryBombImg },
  { match: (n) => n.includes("coco") && n.includes("delight"), image: mocktailCocoDelightImg },
  { match: (n) => n.includes("grape") && n.includes("rickey"), image: mocktailGrapeRickeyImg },
  { match: (n) => n.includes("kiwi") && n.includes("daiquiri"), image: mocktailKiwiDaiquiriImg },
  { match: (n) => n.includes("passion") && n.includes("fruit"), image: mocktailPassionFruitImg },
  { match: (n) => n.includes("spicy") && n.includes("guava"), image: mocktailSpicyGuavaImg },
  { match: (n) => n.includes("virgin") && n.includes("mojito"), image: mocktailVirginMojitoImg },
  { match: (n) => n.includes("virgin") && (n.includes("pinacolada") || n.includes("pina colada") || n.includes("piña colada")), image: mocktailVirginPinacoladaImg },
  { match: (n) => n.includes("winter") && n.includes("punch"), image: mocktailWinterPunchImg },
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
  { match: (n) => n.includes("tamatar") || n.includes("shorbha") || n.includes("shorba"), image: soupTomatoBowlImg },
  { match: (n) => n.includes("tom") && n.includes("yum"), image: soupClearImg },
  { match: (n) => n.includes("clear") && n.includes("soup"), image: soupClearImg },
];

export function getOverrideImage(name: string): string | null {
  const n = (name || "").toLowerCase();
  for (const o of NAME_IMAGE_OVERRIDES) {
    if (o.match(n)) return o.image;
  }
  return null;
}

interface ProductCardProps {
  item: MenuItem;
  onClick?: (item: MenuItem) => void;
}

export default function ProductCard({ item, onClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const { addToOrder, orderItems, updateQuantity, updateNote } = useOrder();
  const access = useMenuAccess();
  const { isFavorite, toggleFavorite, hasCustomer } = useFavorites();
  const itemId = item._id?.toString() ?? "";
  const orderLine = orderItems.find(l => l.item._id?.toString() === itemId);
  const qty = orderLine?.quantity ?? 0;
  const note = orderLine?.note ?? "";
  const favorited = isFavorite(itemId);
  const override = getOverrideImage(item.name);
  const isBrokenImage = imgError || !item.image ||
    item.image.includes("example.com") ||
    item.image.includes("via.placeholder.com") ||
    item.image.includes("placeholder.com");
  const imageUrl = isBrokenImage ? (override ?? fallbackImg) : item.image;

  return (
    <div
      className="flex flex-col overflow-hidden cursor-pointer group transition-all duration-300"
      style={{
        borderRadius: "10px",
        backgroundColor: "var(--bb-card)",
        border: "1px solid var(--bb-border)",
      }}
      onClick={() => onClick?.(item)}
      data-testid={`card-dish-${item._id?.toString()}`}
    >
      {/* Image — square */}
      <div className="relative w-full overflow-hidden" style={{ borderRadius: "10px 10px 0 0", aspectRatio: "1 / 1" }}>
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
        {hasCustomer && !access.guest && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite({
                menuItemId: itemId,
                name: item.name,
                price: item.price,
                image: item.image,
                category: item.category,
                isVeg: item.isVeg,
              });
            }}
            className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
            style={{ background: "rgba(0,0,0,0.35)" }}
            aria-label={favorited ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
            data-testid={`button-favorite-${itemId}`}
          >
            <Heart
              size={15}
              strokeWidth={2.2}
              fill={favorited ? "#E63946" : "transparent"}
              color={favorited ? "#E63946" : "#fff"}
            />
          </button>
        )}
      </div>

      {/* Text content — fixed-height rows so all cards align */}
      <div className="flex flex-col p-2 md:p-3">

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
            className="text-sm sm:text-base font-semibold tracking-wide uppercase"
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
          className="text-xs sm:text-sm mt-0 mb-2 truncate"
          style={{
            color: "var(--bb-text)",
            fontFamily: "'DM Sans', sans-serif",
            opacity: 0.8,
          }}
        >
          {item.description || "No description available"}
        </p>

        {/* Price + Add button */}
        <div className="pt-2 flex items-center justify-between" style={{ borderTop: "1px solid var(--bb-border)" }}>
          <span
            className="text-sm sm:text-base font-bold tracking-wide"
            style={{
              color: "var(--bb-gold-2)",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: "1.2",
            }}
          >
            {typeof item.price === "string" && item.price.includes("|")
              ? item.price.split("|").map(p => `₹${p.trim()}`).join(" | ")
              : `₹${item.price}`}
          </span>
          {!access.guest && (qty > 0 ? (
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              {!access.guest && <button
                onClick={() => updateQuantity(itemId, qty - 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                style={{ border: "1.5px solid var(--bb-gold)", color: "var(--bb-gold)" }}
                aria-label="Decrease quantity"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>}
              <span
                className="w-5 text-center text-sm font-bold"
                style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {qty}
              </span>
              <button
                onClick={() => updateQuantity(itemId, qty + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                style={{ background: "var(--bb-gold)", color: "#fff" }}
                aria-label="Increase quantity"
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setNoteOpen(true)}
                className="relative w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                style={{ border: "1.5px solid var(--bb-gold)", color: "var(--bb-gold)" }}
                aria-label={note ? "Edit note for this item" : "Add a note for this item"}
                data-testid={`button-note-${itemId}`}
              >
                <StickyNote size={12} strokeWidth={2.5} />
                {note && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{ background: "#E63946" }}
                  />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToOrder(item);
              }}
              className="flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{
                width: "28px",
                height: "28px",
                background: "var(--bb-gold)",
                color: "#fff",
                flexShrink: 0,
              }}
              aria-label={`Add ${item.name} to order`}
            >
              <Plus size={15} strokeWidth={2.5} />
            </button>
          ) )}
        </div>
      </div>
      {noteOpen && (
        <ItemNoteModal
          itemName={item.name}
          initialNote={note}
          onClose={() => setNoteOpen(false)}
          onSave={(n) => updateNote(itemId, n)}
        />
      )}
    </div>
  );
}
