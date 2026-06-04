import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Link from "next/link";
import SearchFilters from "./SearchFilters";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; category?: string }>;
}) {
  const { q = "", sort = "newest", category } = await searchParams;

  let products = await prisma.product.findMany();

  // Client-side filtering (since SQLite doesn't support mode: "insensitive")
  products = products.filter(p => {
    const searchLower = q.toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.material.toLowerCase().includes(searchLower) ||
      p.gemstone.toLowerCase().includes(searchLower);

    const matchesCategory = !category || p.subCategory === category;

    return matchesSearch && matchesCategory;
  });

  // Sort
  if (sort === "price-low") products.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") products.sort((a, b) => b.price - a.price);
  else if (sort === "rating") products.sort((a, b) => b.avgRating - a.avgRating);
  else products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const categories = await prisma.category.findMany({
    where: { parentType: "Jewellery" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <div style={{ paddingTop: 140, background: "var(--white)" }}>
        {/* Hero */}
        <div style={{ padding: "40px 48px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 400, marginBottom: 12 }}>
            Search Results
          </h1>
          <p style={{ color: "var(--ink-faint)", marginBottom: 20 }}>
            {q && <>for "<strong>{q}</strong>"</>}
            {products.length > 0 && <> — Found {products.length} result{products.length !== 1 ? "s" : ""}</>}
          </p>
        </div>

        {/* Filters */}
        <SearchFilters categories={categories} currentCategory={category} currentSort={sort} q={q} />

        {/* Results */}
        {products.length > 0 ? (
          <div style={{ padding: "32px 48px" }}>
            <div className="product-grid" style={{ background: "var(--border)" }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        ) : (
          <div style={{ padding: "80px 48px", textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.15 }}>◇</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, marginBottom: 12 }}>No results found</h2>
            <p style={{ color: "var(--ink-faint)", marginBottom: 24 }}>Try adjusting your search or browse our collections</p>
            <Link href="/shop" className="btn-emerald" style={{ padding: "12px 28px", textDecoration: "none", display: "inline-block" }}>
              Browse All Products
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
