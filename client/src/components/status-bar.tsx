import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import { useTheme } from "@/contexts/ThemeContext";
import { formatTableNumber } from "@/lib/table";
import { getStatusDisplay } from "@/lib/order-status";
import type { Order } from "@shared/schema";

// A slim strip shown below the page header that surfaces the current
// table/order status — mirrors the POS "Status / Table / Floor" bar.
export default function StatusBar() {
  const { customer } = useCustomer();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-phone", customer?.phone],
    queryFn: async () => {
      if (!customer?.phone) return [];
      const res = await fetch(`/api/orders/by-phone/${customer.phone}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!customer?.phone,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Table and floor assignments are internal restaurant details and are not
  // shown to customers in the digital menu.
  return null;
}
