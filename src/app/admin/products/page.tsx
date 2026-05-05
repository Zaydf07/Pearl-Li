import { prisma } from "@/lib/db";
import AdminProductsClient from "./AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []) as any[];
  return <AdminProductsClient products={products} />;
}
