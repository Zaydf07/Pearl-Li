"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string; slug: string; name: string; collection: string;
  price: number; type: string; image?: string; qty: number;
  size?: string; color?: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "qty">) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const toggleCart = useCallback(() => setOpen(v => !v), []);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, total, open, addItem, removeItem, clearCart, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
