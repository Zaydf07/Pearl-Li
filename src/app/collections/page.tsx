import Link from "next/link";
import { prisma } from "@/lib/db";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const DEFAULT_META = {
  eyebrow: "Collection",
  description: "Explore this curated selection of fine pieces.",
  image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80",
};

export default async function CollectionsPage() {
  // Pull all unique collection names from DB
  const rows = await prisma.product.findMany({
    select: { collection: true },
    distinct: ["collection"],
    orderBy: { collection: "asc" },
  }).catch(() => []);

  let metadata: any[] = [];
  try {
    metadata = await prisma.collectionMeta.findMany();
  } catch {
    // Table may not exist yet, continue with empty metadata
  }
  const metaMap = new Map(metadata.map((m: any) => [m.name, m]));
  const collections = rows.map(r => r.collection);

  return (
    <>
      <div className="shop-hero" style={{ background: "var(--black)", color: "var(--white)", paddingTop: 140, paddingBottom: 60, textAlign: "center" }}>
        <span className="eyebrow" style={{ color: "var(--emerald-mid)", display: "block", marginBottom: 14 }}>Pearl &amp; Li</span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 400, color: "var(--white)" }}>
          Our <em style={{ fontStyle: "italic", color: "var(--emerald-mid)" }}>Collections</em>
        </h1>
      </div>

      <div className="collections-band" style={{ padding: "80px 0" }}>
        <div className="collections-grid">
          {collections.map(name => {
            const meta = metaMap.get(name) ?? DEFAULT_META;
            return (
              <Link href={`/collections/${encodeURIComponent(name)}`} key={name} style={{ textDecoration: "none" }}>
                <div className="coll-card">
                  <img src={meta.image ?? DEFAULT_META.image} alt={name} className="coll-bg" style={{ minHeight: 400 }} />
                  <div className="coll-overlay" />
                  <div className="coll-content">
                    <div className="coll-eyebrow">{meta.eyebrow ?? DEFAULT_META.eyebrow}</div>
                    <h3>{name}</h3>
                    <p>{meta.description ?? DEFAULT_META.description}</p>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--emerald-mid)" }}>
                      Shop Collection →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
