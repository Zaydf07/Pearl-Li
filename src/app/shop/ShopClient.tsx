"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { COLLECTIONS_14KT, FALLBACK_CATEGORIES, isStyleSection } from "@/lib/categories";

const PAGE_SIZE = 48;
const SPECIAL_FILTERS: Record<string, string> = { new: "New", sale: "Sale" };
const HEADINGS: Record<string, string> = { All: "All Pieces", New: "New Arrivals", Sale: "Sale" };

type Product = {
  id: string; slug: string; name: string; collection: string;
  price: number; type: string; isNew: boolean; isSale: boolean;
  image: string | null; subCategory?: string | null;
};

interface Category { id: string; name: string; slug: string; parentType: string; }
interface CollectionMeta { image?: string | null; caption?: string | null; description?: string | null; }

const slugify = (name: string) => name.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-");

export default function ShopClient({
  products,
  initialCategoryName,
  collectionMeta,
}: {
  products: Product[];
  /** Name the server resolved for the ?category= slug in the first request (covers database-only categories). */
  initialCategoryName?: string;
  collectionMeta?: CollectionMeta | null;
}) {
  // The address is the single source of truth for the active filter, so the heading, chips and
  // products always agree, whether the change came from a chip, the menu or the Back button.
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [paging, setPaging] = useState({ key: "", count: PAGE_SIZE });

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  const allCategories: Category[] = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const categorySlug = searchParams.get("category")?.toLowerCase();
  const collection = searchParams.get("collection") ?? undefined;
  const filterParam = searchParams.get("filter");

  const active = categorySlug
    ? allCategories.find(c => c.slug === categorySlug)?.name ?? initialCategoryName ?? categorySlug
    : collection
    ? collection
    : (filterParam && SPECIAL_FILTERS[filterParam.toLowerCase()]) || filterParam || "All";

  const categoryNames = allCategories.map(c => c.name);
  const filterChips = ["All", ...categoryNames.filter(n => !isStyleSection(n)), "New", "Sale"];
  // Style chips only show for the selected main category, so the sticky bar stays short.
  const activeParent = COLLECTIONS_14KT.find(c => c.name === active)?.parent ?? active;
  const styleChips = COLLECTIONS_14KT.filter(c => c.parent === activeParent).map(c => c.name);

  const visibleCount = paging.key === active ? paging.count : PAGE_SIZE;

  const choose = (f: string) => {
    let query = "";
    if (f === "New" || f === "Sale") query = `?filter=${f}`;
    else if (f !== "All") query = `?category=${allCategories.find(c => c.name === f)?.slug ?? slugify(f)}`;
    window.history.pushState(null, "", `/shop${query}`);
  };

  const activeKey = active.toLowerCase();
  const filtered = products.filter(p => {
    if (active === "All")  return true;
    if (active === "New")  return p.isNew;
    if (active === "Sale") return p.isSale;
    // collection match
    if (p.collection.toLowerCase() === activeKey) return true;
    // subCategory match
    if (p.subCategory?.toLowerCase() === activeKey) return true;
    // broad type match
    if (p.type.toLowerCase() === activeKey) return true;
    return false;
  });

  const showingCollection = Boolean(collection) && active === collection;
  const heading = showingCollection ? `${collection} Collection` : HEADINGS[active] ?? active;
  const heroImage = showingCollection ? collectionMeta?.image ?? "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&q=80" : undefined;

  return (
    <>
      <div className="shop-hero" style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined, backgroundSize: heroImage ? "cover" : undefined, backgroundPosition: heroImage ? "center" : undefined }}>
        <span className="eyebrow">Pearl &amp; Li</span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,calc(5vw / var(--zoom, 1)),60px)", fontWeight: 400 }}>
          {heading}
        </h1>
        {showingCollection && (
          <div style={{ marginTop: 18, maxWidth: 720, color: collectionMeta ? "var(--white)" : "var(--ink)", textShadow: collectionMeta ? "0 8px 24px rgba(0,0,0,.45)" : undefined }}>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6 }}>
              {collectionMeta?.caption ?? `Discover the refined pieces from the ${collection} collection.`}
            </p>
            {collectionMeta?.description && <p style={{ marginTop: 12, fontSize: 15, opacity: 0.85 }}>{collectionMeta.description}</p>}
          </div>
        )}
      </div>

      <div className="shop-filter-bar">
        <span className="shop-filter-label">Filter:</span>
        {filterChips.map(f => (
          <button key={f} className={`filter-chip${activeParent === f ? " active" : ""}`} onClick={() => choose(f)}>{f}</button>
        ))}
        <span className="shop-filter-label" style={{ marginLeft: "auto" }}>{filtered.length} {filtered.length === 1 ? "piece" : "pieces"}</span>
        {styleChips.length > 0 && (
          <div style={{ flexBasis: "100%", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span className="shop-filter-label">Style:</span>
            {styleChips.map(f => (
              <button key={f} className={`filter-chip${active === f ? " active" : ""}`} onClick={() => choose(f)}>{f}</button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-faint)", fontFamily: "'Cormorant Garamond',serif", fontSize: 20 }}>
          No pieces found in this category.
        </div>
      ) : (
        <>
          <div className="product-grid" style={{ maxWidth: "100%", background: "var(--border)" }}>
            {filtered.slice(0, visibleCount).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {visibleCount < filtered.length && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 14 }}>Showing {visibleCount} of {filtered.length}</div>
              <button className="btn-outline-dark" onClick={() => setPaging({ key: active, count: visibleCount + PAGE_SIZE })}>Load More</button>
            </div>
          )}
        </>
      )}
    </>
  );
}
