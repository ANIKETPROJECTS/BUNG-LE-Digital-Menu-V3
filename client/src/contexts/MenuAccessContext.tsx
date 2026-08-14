import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface MenuAccess {
  enabled: boolean;
  guest: boolean;
  loading: boolean;
  reset: () => void;
  tableName?: string;
  floorName?: string;
  token?: string;
}

const MenuAccessContext = createContext<MenuAccess>({ enabled: false, guest: true, loading: false, reset: () => {} });
const QR_SESSION_TOKEN_KEY = "bungle_qr_session_token";

function getToken() {
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  const queryToken = new URLSearchParams(window.location.search).get("access");
  const pathToken = firstSegment && firstSegment !== "menu" && firstSegment !== "profile" &&
    firstSegment !== "order-history" && firstSegment !== "partymenu"
    ? firstSegment : null;
  return queryToken || pathToken || sessionStorage.getItem(QR_SESSION_TOKEN_KEY);
}

export function MenuAccessProvider({ children }: { children: ReactNode }) {
  const token = getToken();
  const [access, setAccess] = useState<MenuAccess>({ enabled: false, guest: true, loading: !!token, reset: () => {} });
  const reset = () => {
    sessionStorage.removeItem(QR_SESSION_TOKEN_KEY);
    sessionStorage.removeItem("bungle_customer_qr_token");
    setAccess({ enabled: false, guest: true, loading: false, reset });
  };

  useEffect(() => {
    if (!token) {
      setAccess({ enabled: false, guest: true, loading: false, reset });
      return;
    }
    fetch(`/api/qr-context/${encodeURIComponent(token)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          const next = { enabled: true, guest: false, loading: false, reset, token, ...data };
          sessionStorage.setItem(QR_SESSION_TOKEN_KEY, token);
          setAccess(next);

          // The token has completed its job once the server validates it.
          // Keep the validated context in memory for the current flow, but
          // remove the token from the address bar so it is not exposed there.
          const cleanPath = window.location.pathname === `/${token}`
            ? "/"
            : window.location.pathname;
          window.history.replaceState({}, document.title, cleanPath);
        } else {
          setAccess({ enabled: false, guest: true, loading: false, reset });
        }
      })
      .catch(() => setAccess({ enabled: false, guest: true, loading: false, reset }));
  }, [token]);

  const value = useMemo(() => access, [access]);
  return <MenuAccessContext.Provider value={value}>{children}</MenuAccessContext.Provider>;
}

export function useMenuAccess() {
  return useContext(MenuAccessContext);
}