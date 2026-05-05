import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const COLLECTION_META: Record<string, { eyebrow: string; desc: string; image: string }> = {
  Celestial:   { eyebrow: "New 2026",  desc: "Star-mapped geometry and South Sea pearls set in 18k gold — our most celestial chapter yet.",      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80" },
  Serpentine:  { eyebrow: "Signature", desc: "Fluid gold forms inspired by Roman antiquity, punctuated with diamonds and precious stones.",        image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1400&q=80" },
  Jadore:      { eyebrow: "Heritage",  desc: "Imperial jade meets diamond halos — a dialogue between East and West, ancient and modern.",          image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1400&q=80" },
  Timepieces:  { eyebrow: "Curated",  desc: "Swiss-movement timepieces housed in precious metal cases with fine leather straps.",                  image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1400&q=80" },
  Accessories: { eyebrow: "Luxury",   desc: "Silk scarves, python leather goods and accessories with precious hardware.",                          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=80" },
};

const DEFAULT_META = {
  eyebrow: "Collection",
  desc:    "A curated selection of fine pieces.",
  image:   "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80",
};

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const collectionName = decodeURIComponent(name);

  // Check this collection exists in the DB
  const exists = await prisma.product.findFirst({
    where: { collection: collectionName },
  }).catch(() => null);

  // Also allow known collections even if no products yet
  const knownCollection = COLLECTION_META[collectionName];
  if (!exists && !knownCollection) notFound();

  const meta = COLLECTION_META[collectionName] ?? DEFAULT_META;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products = await prisma.product.findMany({
    where: { collection: collectionName },
    orderBy: { createdAt: "desc" },
  }).catch(() => []) as any[];
  if (products.length === 0) products = PRODUCTS_DATA.filter(p => p.collection === collectionName);

  const allCollections = Object.keys(COLLECTION_META).filter(c => c !== collectionName);

  return (
    <>
      {/* Hero */}
      <div style={{ position: "relative", height: 520, overflow: "hidden" }}>
        <img
          src={meta.image}
          alt={collectionName}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.3) 0%, rgba(0,0,0,.6) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 40px" }}>
          <span style={{ display: "block", fontSize: 9, letterSpacing: ".32em", textTransform: "uppercase", color: "var(--emerald-mid)", marginBottom: 16 }}>{meta.eyebrow}</span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(44px,6vw,80px)", fontWeight: 400, color: "var(--white)", margin: "0 0 20px", lineHeight: 1.1 }}>
            {collectionName}
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,2vw,22px)", fontWeight: 300, color: "rgba(255,255,255,.7)", maxWidth: 560, lineHeight: 1.6 }}>
            {meta.desc}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "14px 48px", display: "flex", alignItems: "center", gap: 8, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
        <Link href="/"            style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
        <span>/</span>
        <Link href="/collections" style={{ textDecoration: "none", color: "inherit" }}>Collections</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>{collectionName}</span>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <>
          <div style={{ background: "var(--white)", padding: "28px 48px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Pearl &amp; Li · {collectionName}</span>
              <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>{products.length} {products.length === 1 ? "piece" : "pieces"}</div>
            </div>
          </div>
          <div className="product-grid" style={{ background: "var(--border)" }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      ) : (
        <div style={{ background: "var(--off-white)", minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.15 }}>◇</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, marginBottom: 12 }}>Coming Soon</h2>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 300, color: "var(--ink-muted)", marginBottom: 36, maxWidth: 420 }}>
            We're curating pieces for the {collectionName} collection. Check back soon.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop"         className="btn-emerald">Browse All Pieces</Link>
            <Link href="/consultation" className="btn-outline-dark">Request a Piece</Link>
          </div>
        </div>
      )}

      {/* Other collections */}
      <div style={{ background: "var(--white)", padding: "60px 48px", borderTop: "1px solid var(--border)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>Continue Exploring</span>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 400 }}>Other Collections</h3>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {allCollections.map(c => (
            <Link key={c} href={`/collections/${encodeURIComponent(c)}`} className="filter-chip" style={{ textDecoration: "none", fontFamily: "'Playfair Display',serif", fontSize: 13 }}>
              {c}
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
