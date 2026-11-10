"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/format";
import type { ProductVariant } from "@/lib/catalogue-14kt";

interface Props {
  product: { id: string; slug: string; name: string; collection: string; type: string };
  variants: ProductVariant[];
}

type Attr = "metal" | "carat" | "size";

const shortMetal = (m: string) => m.replace(/^14K\s+/i, "");

/**
 * Options for a product made of several physical lots: metal, total carat weight and size.
 * Every combination maps to one variant with its own price, photo, stock and lot details.
 */
export default function VariantOptions({ product, variants }: Props) {
  const { addItem, toggleCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const cheapest = useMemo(() => variants.reduce((a, b) => (b.price < a.price ? b : a)), [variants]);
  const [selected, setSelected] = useState<ProductVariant>(cheapest);

  const metals = useMemo(() => [...new Set(variants.map(v => v.metal))], [variants]);
  const carats = useMemo(() => [...new Set(variants.map(v => v.carat))].sort((a, b) => Number(a) - Number(b)), [variants]);
  const sizes = useMemo(() => [...new Set(variants.map(v => v.size).filter((s): s is string => Boolean(s)))], [variants]);

  const valueOf = (v: ProductVariant, attr: Attr) => (attr === "size" ? v.size ?? "" : v[attr]);
  const isAvailable = (attr: Attr, value: string) =>
    variants.some(v => valueOf(v, attr) === value && (["metal", "carat", "size"] as Attr[]).every(a => a === attr || valueOf(v, a) === valueOf(selected, a)));

  // Pick the closest variant that has the chosen value: keep the other choices where possible.
  const choose = (attr: Attr, value: string) => {
    const candidates = variants.filter(v => valueOf(v, attr) === value);
    const score = (v: ProductVariant) =>
      (attr !== "metal" && v.metal === selected.metal ? 0 : 4) +
      (attr !== "size" && (v.size ?? "") === (selected.size ?? "") ? 0 : 2) +
      (attr !== "carat" ? Math.abs(Number(v.carat) - Number(selected.carat)) : 0);
    const next = candidates.reduce((a, b) => (score(b) < score(a) ? b : a));
    setSelected(next);
    window.dispatchEvent(new CustomEvent("product-image", { detail: next.image }));
  };

  const optionLabel = `${selected.metal} · ${selected.carat} ct${selected.size ? ` · ${selected.size}` : ""}`;
  const wishlisted = isInWishlist(product.id);

  const handleAddToBag = () => {
    addItem({
      id: `${product.id}__${selected.id}`,
      productId: product.id,
      variant: `${optionLabel} · Lot ${selected.id}`,
      slug: product.slug,
      name: product.name,
      collection: product.collection,
      price: selected.price,
      type: product.type,
      image: selected.image,
      size: selected.size ?? undefined,
      color: selected.metal,
    });
    toggleCart();
  };

  const chip = (active: boolean, available: boolean) => ({
    border: `1.5px solid ${active ? "var(--black)" : "var(--border)"}`,
    padding: "9px 14px", fontSize: 12, cursor: "pointer", transition: "all .15s",
    background: active ? "var(--black)" : "none",
    color: active ? "var(--white)" : available ? "var(--ink)" : "var(--ink-faint)",
    textDecoration: !active && !available ? "line-through" : "none",
  });
  const label = { fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase" as const, color: "var(--ink)", marginBottom: 10 };

  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, color: "var(--black)" }}>
          ${formatPrice(selected.price)}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 22 }}>
        {variants.length} options from ${formatPrice(cheapest.price)}
      </div>

      {/* Colour (metal) */}
      <div style={{ marginBottom: 22 }}>
        <div style={label}>Colour <span style={{ color: "var(--emerald)", marginLeft: 8 }}>— {shortMetal(selected.metal)}</span></div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {metals.map(m => {
            const hex = variants.find(v => v.metal === m)!.metalHex;
            const active = m === selected.metal;
            return (
              <button key={m} type="button" title={m} aria-label={m} aria-pressed={active} onClick={() => choose("metal", m)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, color: "var(--ink-muted)" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: hex, display: "block", border: `2px solid ${active ? "var(--black)" : "transparent"}`, outline: `2px solid ${active ? "var(--black)" : "var(--border)"}`, outlineOffset: 2 }} />
                {shortMetal(m)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Total carat weight */}
      {carats.length > 1 && (
        <div style={{ marginBottom: 22 }}>
          <div style={label}>Carat Weight <span style={{ color: "var(--emerald)", marginLeft: 8 }}>— {selected.carat} ct</span></div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {carats.map(c => (
              <button key={c} type="button" aria-pressed={c === selected.carat} onClick={() => choose("carat", c)} style={chip(c === selected.carat, isAvailable("carat", c))}>
                {c} ct
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={label}>Size <span style={{ color: "var(--emerald)", marginLeft: 8 }}>— {selected.size}</span></div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {sizes.map(s => (
              <button key={s} type="button" aria-pressed={s === selected.size} onClick={() => choose("size", s)} style={chip(s === selected.size, isAvailable("size", s))}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Details of the selected piece */}
      <div style={{ background: "var(--off-white)", border: "1px solid var(--border)", padding: "14px 16px", marginBottom: 20, fontSize: 12, lineHeight: 1.7, color: "var(--ink-muted)" }}>
        <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>Selected: {optionLabel}</div>
        {selected.details}
        <div style={{ marginTop: 6, color: selected.stock < 3 ? "var(--emerald)" : "var(--ink-muted)", fontWeight: 500 }}>
          {selected.stock === 1 ? "Only 1 available" : `${selected.stock} available`}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <button className="btn-black" style={{ width: "100%" }} onClick={handleAddToBag}>
          Add to Bag — ${formatPrice(selected.price)}
        </button>
        <button
          onClick={() => toggleItem({ id: product.id, slug: product.slug, name: product.name, collection: product.collection, price: cheapest.price, type: product.type, image: cheapest.image })}
          style={{
            width: "100%", padding: "13px", fontSize: "10px", fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", cursor: "pointer",
            border: `1.5px solid ${wishlisted ? "var(--emerald)" : "var(--border)"}`,
            background: wishlisted ? "var(--emerald-pale)" : "none",
            color: wishlisted ? "var(--emerald)" : "var(--ink-muted)", transition: "all .2s",
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
