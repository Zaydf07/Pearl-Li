"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface SizeVariant  { size: string;  price: number | null; }
interface ColorVariant { name: string;  hex: string; price: number | null; }

interface Props {
  product: {
    id: string; slug: string; name: string; collection: string;
    price: number; type: string; image: string | null;
  };
  sizes:  SizeVariant[];
  colors: ColorVariant[];
}

export default function ProductOptions({ product, sizes, colors }: Props) {
  const { addItem, toggleCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [size,  setSize]  = useState<SizeVariant  | null>(null);
  const [color, setColor] = useState<ColorVariant | null>(colors[0] ?? null);
  const [error, setError] = useState("");

  const wishlisted = isInWishlist(product.id);

  // Compute displayed price: color override → size override → base
  const displayPrice = (() => {
    if (color?.price != null) return color.price;
    if (size?.price  != null) return size.price;
    return product.price;
  })();

  const priceChanged = displayPrice !== product.price;

  const handleAddToBag = () => {
    if (sizes.length > 0 && !size) { setError("Please select a size."); return; }
    setError("");
    addItem({
      id: `${product.id}_${size?.size ?? ""}_${color?.name ?? ""}`,
      slug: product.slug,
      name: product.name,
      collection: product.collection,
      price: displayPrice,
      type: product.type,
      image: product.image ?? undefined,
      size:  size?.size,
      color: color?.name,
    });
    toggleCart();
  };

  return (
    <>
      {/* Price — updates live */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, color: "var(--black)" }}>
          ${displayPrice.toLocaleString()}
        </div>
        {priceChanged && (
          <div style={{ fontSize: 12, color: "var(--ink-faint)", textDecoration: "line-through" }}>
            ${product.price.toLocaleString()}
          </div>
        )}
      </div>

      {/* Sizes */}
      {sizes.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink)", marginBottom: 10 }}>
            Size {size && <span style={{ color: "var(--emerald)", marginLeft: 8 }}>— {size.size}</span>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {sizes.map(s => (
              <button
                key={s.size}
                onClick={() => { setSize(s); setError(""); }}
                style={{
                  border: `1.5px solid ${size?.size === s.size ? "var(--black)" : "var(--border)"}`,
                  padding: "9px 16px", fontSize: 12,
                  background: size?.size === s.size ? "var(--black)" : "none",
                  color: size?.size === s.size ? "var(--white)" : "var(--ink)",
                  cursor: "pointer", transition: "all .15s", position: "relative",
                }}
              >
                {s.size}
                {s.price != null && s.price !== product.price && (
                  <span style={{ position: "absolute", top: -8, right: -4, fontSize: 8, background: "var(--emerald)", color: "white", padding: "1px 4px" }}>
                    ${s.price.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink)", marginBottom: 10 }}>
            Colour {color && <span style={{ color: "var(--emerald)", marginLeft: 8 }}>— {color.name}</span>}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {colors.map(c => (
              <div key={c.name} style={{ textAlign: "center" }}>
                <button
                  title={c.name}
                  onClick={() => setColor(c)}
                  style={{
                    width: 30, height: 30, borderRadius: "50%", background: c.hex,
                    cursor: "pointer", padding: 0, display: "block",
                    border: `2px solid ${color?.name === c.name ? "var(--black)" : "transparent"}`,
                    outline: `2px solid ${color?.name === c.name ? "var(--black)" : "var(--border)"}`,
                    outlineOffset: 2, transition: "outline .15s",
                  }}
                />
                {c.price != null && c.price !== product.price && (
                  <div style={{ fontSize: 8, color: "var(--ink-faint)", marginTop: 3 }}>
                    +${(c.price - product.price).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ color: "var(--red)", fontSize: 11, marginBottom: 12 }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <button className="btn-black" style={{ width: "100%" }} onClick={handleAddToBag}>
          Add to Bag — ${displayPrice.toLocaleString()}
        </button>
        <button
          onClick={() => toggleItem({ id: product.id, slug: product.slug, name: product.name, collection: product.collection, price: product.price, type: product.type, image: product.image ?? undefined })}
          style={{
            width: "100%", padding: "13px", fontSize: "10px", fontWeight: 600,
            letterSpacing: ".16em", textTransform: "uppercase", cursor: "pointer",
            border: `1.5px solid ${wishlisted ? "var(--emerald)" : "var(--border)"}`,
            background: wishlisted ? "var(--emerald-pale)" : "none",
            color: wishlisted ? "var(--emerald)" : "var(--ink-muted)",
            transition: "all .2s",
          }}
        >
          {wishlisted ? "♥ Saved to Wishlist" : "♡ Save to Wishlist"}
        </button>
        <Link href="/consultation" className="btn-outline-dark" style={{ textAlign: "center" }}>
          Request Consultation
        </Link>
      </div>
    </>
  );
}
