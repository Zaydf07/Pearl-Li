"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export interface WishlistItem {
  id: string; slug: string; name: string; collection: string;
  price: number; type: string; image?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pearl-li-wishlist");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("pearl-li-wishlist", JSON.stringify(items));
  }, [items]);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems(prev =>
      prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const isInWishlist = useCallback((id: string) => items.some(i => i.id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, toggleItem, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist outside WishlistProvider");
  return ctx;
}
