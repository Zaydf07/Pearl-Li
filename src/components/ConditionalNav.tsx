"use client";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";

export default function ConditionalNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <Nav />
      <CartDrawer />
    </>
  );
}
