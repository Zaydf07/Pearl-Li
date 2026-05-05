import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ConditionalNav from "@/components/ConditionalNav";

export const metadata: Metadata = {
  title: "Pearl & Li — Fine Jewellery & Luxury Goods",
  description: "Where Italian artistry meets Eastern grace — fine jewellery and luxury goods for the discerning collector.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <ConditionalNav />
            <main>{children}</main>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
