import { prisma } from "@/lib/db";
import { PRODUCTS_DATA } from "@/lib/data";
import { FALLBACK_CATEGORIES } from "@/lib/categories";
import ShopClient from "./ShopClient";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; category?: string; collection?: string }>;
}) {
  const { category, collection } = await searchParams;
  const categorySlug = category?.toLowerCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []) as any[];
  if (products.length === 0) products = PRODUCTS_DATA;
  // Send only what a card needs, as this page can list hundreds of products.
  const cards = products.map(({ id, slug, name, collection, price, type, isNew, isSale, image, subCategory }) => ({ id, slug, name, collection, price, type, isNew, isSale, image, subCategory }));

  let meta = null;
  if (collection) {
    try {
      meta = await prisma.collectionMeta.findUnique({ where: { name: collection } });
    } catch {
      // Table may not exist yet, continue with null
    }
  }

  let categoryName = FALLBACK_CATEGORIES.find(c => c.slug === categorySlug)?.name ?? category;
  if (categorySlug) {
    try {
      const categoryRecord = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (categoryRecord) categoryName = categoryRecord.name;
    } catch {
      // ignore lookup failures
    }
  }

  // The heading and filters live in ShopClient and follow the address, so they always match.
  return (
    <>
      <ShopClient
        products={cards}
        initialCategoryName={categoryName ?? undefined}
        collectionMeta={meta ? { image: meta.image, caption: meta.caption, description: meta.description } : null}
      />
      <Footer />
    </>
  );
}
