"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface Product {
  id: string; slug: string; name: string; collection: string;
  price: number; type: string; isNew: boolean; isSale: boolean; image?: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem: addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id: product.id, slug: product.slug, name: product.name, collection: product.collection, price: product.price, type: product.type, image: product.image ?? undefined });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({ id: product.id, slug: product.slug, name: product.name, collection: product.collection, price: product.price, type: product.type, image: product.image ?? undefined });
  };

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
      <div className="product-card">
        <div className="product-card-img">
          <div
            className="product-card-img-inner"
            style={{ backgroundImage: product.image ? `url(${product.image})` : undefined }}
          />
          <div className="product-card-actions">
            <button className="pca-btn" onClick={handleAddToCart}>Add to Bag</button>
            <button
              className="pca-wish"
              onClick={handleWishlist}
              title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              style={{ color: wishlisted ? "var(--emerald)" : undefined, background: wishlisted ? "var(--emerald-pale)" : undefined }}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>
          {product.isNew && (
            <div style={{ position: "absolute", top: 12, left: 12, background: "var(--emerald)", color: "white", fontSize: "7.5px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", padding: "3px 8px" }}>NEW</div>
          )}
          {product.isSale && (
            <div style={{ position: "absolute", top: 12, right: 12, background: "var(--red)", color: "white", fontSize: "7.5px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", padding: "3px 8px" }}>SALE</div>
          )}
        </div>
        <div className="product-info">
          <div className="product-collection">{product.collection}</div>
          <div className="product-name">{product.name}</div>
          <div className="product-price">${product.price.toLocaleString()}</div>
        </div>
      </div>
    </Link>
  );
}
