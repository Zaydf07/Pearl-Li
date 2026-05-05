"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string; slug: string; name: string; collection: string;
  price: number; type: string; isNew: boolean; isSale: boolean;
  image: string | null; subCategory?: string | null;
};

interface Category { id: string; name: string; parentType: string; }

export default function ShopClient({
  products,
  initialFilter,
  initialCategory,
  initialCollection,
}: {
  products: Product[];
  initialFilter?: string;
  initialCategory?: string;
  initialCollection?: string;
}) {
  const [active, setActive] = useState(
    initialCategory || initialCollection || initialFilter || "All"
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  const filterChips = ["All", ...categories.map(c => c.name), "New", "Sale"];

  const filtered = products.filter(p => {
    if (active === "All")  return true;
    if (active === "New")  return p.isNew;
    if (active === "Sale") return p.isSale;
    // collection match
    if (p.collection === active) return true;
    // subCategory match
    if (p.subCategory === active) return true;
    // broad type match
    if (p.type === active) return true;
    return false;
  });

  return (
    <>
      <div className="shop-filter-bar">
        <span className="shop-filter-label">Filter:</span>
        {filterChips.map(f => (
          <button key={f} className={`filter-chip${active === f ? " active" : ""}`} onClick={() => setActive(f)}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-faint)", fontFamily: "'Cormorant Garamond',serif", fontSize: 20 }}>
          No pieces found in this category.
        </div>
      ) : (
        <div className="product-grid" style={{ maxWidth: "100%", background: "var(--border)" }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}
