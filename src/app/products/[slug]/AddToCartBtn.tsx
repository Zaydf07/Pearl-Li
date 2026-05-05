"use client";
import { useCart } from "@/context/CartContext";

interface Props {
  product: { id: string; slug: string; name: string; collection: string; price: number; type: string; image: string | null; };
}

export default function AddToCartBtn({ product }: Props) {
  const { addItem, toggleCart } = useCart();
  return (
    <button
      className="btn-black"
      style={{ width: "100%" }}
      onClick={() => { addItem({ ...product, image: product.image ?? undefined }); toggleCart(); }}
    >
      Add to Bag
    </button>
  );
}
