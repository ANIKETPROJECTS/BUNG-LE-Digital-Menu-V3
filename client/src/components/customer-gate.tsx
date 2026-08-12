import { useLocation } from "wouter";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useCustomer } from "@/contexts/CustomerContext";
import CustomerFormModal from "@/components/customer-form-modal";
import { useMenuAccess } from "@/contexts/MenuAccessContext";

// Shows the "share your details" form the first time a customer lands on any
// menu-related page (after tapping "Explore our menu"), rather than blocking
// the welcome screen itself. Once details are captured they persist for the
// session, so this stays silent on subsequent visits.
export default function CustomerGate() {
  const [location] = useLocation();
  const { customer, setCustomer, clearCustomer } = useCustomer();
  const access = useMenuAccess();

  // A signed QR URL may start with the token itself (for example /ady34...),
  // so access.enabled is also a menu-area signal.
  const isMenuArea = access.enabled || location.startsWith("/menu") || location.startsWith("/partymenu");
  const shouldShow = isMenuArea && access.enabled && !customer;

  // A customer saved from a previous visit must not bypass the customer form
  // for a newly scanned table QR code.
  useEffect(() => {
    if (!access.enabled || !access.token) return;
    const activeTokenKey = "bungle_active_qr_token";
    if (sessionStorage.getItem(activeTokenKey) !== access.token) {
      sessionStorage.setItem(activeTokenKey, access.token);
      clearCustomer();
    }
  }, [access.enabled, access.token, clearCustomer]);

  const handleSubmit = async (name: string, phone: string) => {
    setCustomer({ name, phone });
    try {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contactNumber: phone }),
      });
    } catch {
      // non-blocking — if save fails, still proceed
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <CustomerFormModal onClose={() => {}} onSubmit={handleSubmit} />
      )}
    </AnimatePresence>
  );
}
