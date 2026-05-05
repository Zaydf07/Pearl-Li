import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "./ProductGallery";
import ProductOptions from "./ProductOptions";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

function parseJson<T>(val: unknown, fallback: T): T {
  if (!val || typeof val !== "string") return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = await prisma.product.findUnique({ where: { slug } }).catch(() => null) as any;
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { collection: product.collection, NOT: { id: product.id } }, take: 4,
  }).catch(() => []);

  const extraImages = parseJson<string[]>(product.images, []);
  // Support both old string[] and new {size,price}[] formats
  const rawSizes = parseJson<unknown[]>(product.sizes, []);
  const sizes = rawSizes.map((s: unknown) =>
    typeof s === "string" ? { size: s, price: null } : s as { size: string; price: number | null }
  );
  const rawColors = parseJson<unknown[]>(product.colors, []);
  const colors = rawColors.map((c: unknown) =>
    typeof c === "object" && c !== null ? c as { name: string; hex: string; price: number | null } : { name: String(c), hex: "#ccc", price: null }
  );

  return (
    <>
      <div style={{ paddingTop: 116, background: "var(--white)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 600 }}>

          {/* Gallery */}
          <div style={{ background: "var(--cream)" }}>
            <ProductGallery mainImage={product.image} extraImages={extraImages} name={product.name} />
          </div>

          {/* Info */}
          <div style={{ padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 12 }}>
              {product.collection} Collection
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 400, color: "var(--black)", lineHeight: 1.2, marginBottom: 8 }}>
              {product.name}
            </h1>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, color: "var(--black)", marginBottom: 20 }}>
              ${product.price.toLocaleString()}
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 300, lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: 28 }}>
              {product.description}
            </p>

            <ProductOptions product={{ id: product.id, slug: product.slug, name: product.name, collection: product.collection, price: product.price, type: product.type, image: product.image }} sizes={sizes} colors={colors} />

            <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Material", product.material], ["Gemstone", product.gemstone], ["Ships in", "3–5 Business Days"], ["Origin", product.origin]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".1em" }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="section" style={{ background: "var(--off-white)" }}>
            <div className="container">
              <div className="section-header">
                <span className="eyebrow">You May Also Love</span>
                <h2>Complete the Look</h2>
              </div>
            </div>
            <div className="product-grid" style={{ maxWidth: 1400, margin: "0 auto" }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
