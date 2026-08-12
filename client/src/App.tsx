import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import OrderSidebar from "@/components/order-sidebar";
import CustomerGate from "@/components/customer-gate";
import Welcome from "@/pages/welcome";
import MenuLanding from "@/pages/menu-landing";
import CategorySelection from "@/pages/category-selection";
import SubcategoryProducts from "@/pages/subcategory-products";
import CustomerList from "@/pages/customer-list";
import NotFound from "@/pages/not-found";
import MocktailsCocktails from "@/pages/mocktails-cocktails";
import PartyMenu from "@/pages/party-menu";
import ProfilePage from "@/pages/profile";
import OrderHistoryPage from "@/pages/order-history";
import { MenuAccessProvider } from "@/contexts/MenuAccessContext";

function Router() {
  return (
    <Switch>
      <Route path="/menu" component={MenuLanding} />
      <Route path="/menu/mocktails-cocktails" component={MocktailsCocktails} />
      <Route path="/menu/:category" component={CategorySelection} />
      <Route path="/menu/:category/:subcategory" component={SubcategoryProducts} />
      <Route path="/partymenu" component={PartyMenu} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/order-history" component={OrderHistoryPage} />
      <Route path="/customers" component={CustomerList} />
      <Route path="/" component={Welcome} />
      <Route path="/:qrToken" component={Welcome} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <CustomerProvider>
          <OrderProvider>
            <TooltipProvider>
              <Toaster />
              <MenuAccessProvider>
                <Router />
                <CustomerGate />
                <OrderSidebar />
              </MenuAccessProvider>
            </TooltipProvider>
          </OrderProvider>
          </CustomerProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
