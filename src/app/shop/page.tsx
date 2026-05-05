import { prisma } from "@/lib/db";
import ShopClient from "./ShopClient";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; category?: string; collection?: string }>;
}) {
  const { filter, category, collection } = await searchParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []) as any[];

  let meta = null;
  if (collection) {
    try {
      meta = await prisma.collectionMeta.findUnique({ where: { name: collection } });
    } catch {
      // Table may not exist yet, continue with null
    }
  }

  const heading = collection
    ? `${collection} Collection`
    : category
    ? category
    : "All Pieces";

  return (
    <>
      <div className="shop-hero" style={{ backgroundImage: collection ? `url(${meta?.image ?? "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&q=80"})` : undefined, backgroundSize: collection ? "cover" : undefined, backgroundPosition: collection ? "center" : undefined }}>
        <span className="eyebrow">Pearl &amp; Li</span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 400 }}>
          {heading}
        </h1>
        {collection && (
          <div style={{ marginTop: 18, maxWidth: 720, color: meta ? "var(--white)" : "var(--ink)", textShadow: meta ? "0 8px 24px rgba(0,0,0,.45)" : undefined }}>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6 }}>
              {meta?.caption ?? `Discover the refined pieces from the ${collection} collection.`}
            </p>
            {meta?.description && <p style={{ marginTop: 12, fontSize: 15, opacity: 0.85 }}>{meta.description}</p>}
          </div>
        )}
      </div>
      <ShopClient products={products} initialFilter={filter} initialCategory={category} initialCollection={collection} />
      <Footer />
    </>
  );
}
