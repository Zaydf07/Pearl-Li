"use client";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export default function SearchFilters({ categories, currentCategory, currentSort, q }: { categories: Category[]; currentCategory?: string; currentSort: string; q: string }) {
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (value) params.set("category", value);
    if (currentSort) params.set("sort", currentSort);
    router.push(`/search?${params}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (currentCategory) params.set("category", currentCategory);
    params.set("sort", value);
    router.push(`/search?${params}`);
  };

  return (
    <div style={{ padding: "24px 48px", background: "var(--off-white)", borderBottom: "1px solid var(--border)", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <div>
        <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "var(--ink-faint)", display: "block", marginBottom: 6 }}>Category</label>
        <select
          value={currentCategory || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid var(--border)", fontSize: 12, borderRadius: 4 }}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
        </select>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "var(--ink-faint)", display: "block", marginBottom: 6 }}>Sort By</label>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid var(--border)", fontSize: 12, borderRadius: 4 }}>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
}
