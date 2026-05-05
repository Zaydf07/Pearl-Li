"use client";
import { useCart } from "@/context/CartContext";

export default function SpecialsClient({ product }: { product: any }) {
  const { addItem } = useCart();
  return (
    <button
      className="btn-black"
      style={{ width: "100%", padding: 11 }}
      onClick={e => { e.preventDefault(); addItem({ ...product, image: product.image ?? undefined }); }}
    >
      Add to Bag
    </button>
  );
}
