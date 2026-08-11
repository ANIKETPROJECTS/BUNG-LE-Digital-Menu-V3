import { useLocation } from "wouter";
import { UserRound, ClipboardList } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";
import { useCustomer } from "@/contexts/CustomerContext";

interface HeaderActionsProps {
  color?: string;
  size?: "sm" | "md";
}

// Shared Profile / Favorites / Order icon cluster used across page headers.
export default function HeaderActions({ color = "var(--bb-gold)", size = "md" }: HeaderActionsProps) {
  const { openSidebar, totalItems } = useOrder();
  const { customer } = useCustomer();
  const [, setLocation] = useLocation();

  const iconSize = size === "sm" ? "h-5 w-5" : "h-5 w-5 sm:h-6 sm:w-6";

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      {customer && (
        <button
          onClick={() => setLocation("/profile")}
          className="relative flex items-center justify-center p-1.5"
          style={{ color }}
          aria-label="My profile"
          data-testid="button-profile"
        >
          <UserRound className={`${size === "sm" ? "h-5 w-5" : "h-6 w-6"} text-[#E8D8B4]`} strokeWidth={2.2} />
        </button>
      )}
      <button
        onClick={openSidebar}
        className="relative flex items-center justify-center p-1.5"
        style={{ color }}
        aria-label="Your order"
        data-testid="button-order"
      >
        <ClipboardList className={`${size === "sm" ? "h-5 w-5" : "h-6 w-6"} text-[#E8D8B4]`} strokeWidth={2.2} />
        {totalItems > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-0.5"
            style={{ background: "#E8D8B4", color: "#15110B" }}
          >
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}
