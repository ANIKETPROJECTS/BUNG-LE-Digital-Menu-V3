import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface MenuAccess {
  enabled: boolean;
  guest: boolean;
  tableName?: string;
  floorName?: string;
  token?: string;
}

const MenuAccessContext = createContext<MenuAccess>({ enabled: false, guest: true });

function getToken() {
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  return firstSegment && firstSegment !== "menu" && firstSegment !== "profile" &&
    firstSegment !== "order-history" && firstSegment !== "partymenu"
    ? firstSegment
    : null;
}

export function MenuAccessProvider({ children }: { children: ReactNode }) {
  const token = getToken();
  const [access, setAccess] = useState<MenuAccess>({ enabled: false, guest: true });

  useEffect(() => {
    if (!token) return;
    fetch(`/api/qr-context/${encodeURIComponent(token)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          const next = { enabled: true, guest: false, token, ...data };
          setAccess(next);
        }
      })
      .catch(() => {});
  }, [token]);

  const value = useMemo(() => access, [access]);
  return <MenuAccessContext.Provider value={value}>{children}</MenuAccessContext.Provider>;
}

export function useMenuAccess() {
  return useContext(MenuAccessContext);
}