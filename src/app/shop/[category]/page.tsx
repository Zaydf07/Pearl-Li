import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const slug = category.toLowerCase();

  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = await prisma.product.findMany({
    where: { subCategory: cat.name },
    orderBy: { createdAt: "desc" },
  }).catch(() => []) as any[];

  const allCategories = await prisma.category.findMany({ orderBy: [{ parentType: "asc" }, { sortOrder: "asc" }] });

  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--black)", paddingTop: 140, paddingBottom: 72, textAlign: "center" }}>
        <span className="eyebrow" style={{ color: "var(--emerald-mid)", display: "block", marginBottom: 16 }}>
          Pearl &amp; Li
        </span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,5vw,72px)", fontWeight: 400, color: "var(--white)", margin: "0 0 16px" }}>
          {cat.name}
        </h1>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "14px 48px", display: "flex", alignItems: "center", gap: 8, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
        <Link href="/"     style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
        <span>/</span>
        <Link href="/shop" style={{ textDecoration: "none", color: "inherit" }}>Shop</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>{cat.name}</span>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <>
          <div style={{ background: "var(--white)", padding: "32px 48px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--ink-muted)" }}>
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </span>
          </div>
          <div className="product-grid" style={{ background: "var(--border)" }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      ) : (
        <div style={{ background: "var(--off-white)", minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.15 }}>◇</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, marginBottom: 12, color: "var(--black)" }}>
            Coming Soon
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 300, color: "var(--ink-muted)", marginBottom: 36, maxWidth: 400 }}>
            We&apos;re curating pieces for this category. Check back soon or explore our other collections.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop" className="btn-emerald">Browse All Pieces</Link>
            <Link href="/consultation" className="btn-outline-dark">Request a Piece</Link>
          </div>
          <Link href="/admin/products" style={{ marginTop: 40, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}>
            Admin: Add products to {cat.name} →
          </Link>
        </div>
      )}

      {/* Cross-shop */}
      <div style={{ background: "var(--white)", padding: "60px 0", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <span className="eyebrow" style={{ display: "block", marginBottom: 20 }}>Continue Exploring</span>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "0 48px" }}>
          {allCategories.filter(c => c.slug !== slug).map(c => (
            <Link key={c.id} href={`/shop/${c.slug}`} className="filter-chip">{c.name}</Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
