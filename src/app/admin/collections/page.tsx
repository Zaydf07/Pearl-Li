import { prisma } from "@/lib/db";
import AdminCollectionsClient from "./AdminCollectionsClient";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const productCollections = await prisma.product.findMany({
    select: { collection: true },
    distinct: ["collection"],
    orderBy: { collection: "asc" },
  }).catch(() => []);

  type CollectionMeta = { id: string; name: string; eyebrow: string | null; caption: string | null; description: string | null; image: string | null };
  let collections: CollectionMeta[] = [];
  try {
    collections = await prisma.collectionMeta.findMany({ orderBy: { name: "asc" } });
  } catch {
    // Table may not exist yet
  }
  const allCollections = Array.from(new Set(productCollections.map(p => p.collection))).sort();

  return <AdminCollectionsClient collections={collections} allCollections={allCollections} />;
}
