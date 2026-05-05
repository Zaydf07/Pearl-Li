import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");
  const collection = searchParams.get("collection");

  const where: any = {};
  if (filter === "New") where.isNew = true;
  else if (filter === "Sale") where.isSale = true;
  else if (filter && filter !== "All") where.type = filter;
  if (collection) where.collection = collection;

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const data = await req.json();
  const product = await prisma.product.create({ data });
  return NextResponse.json(product, { status: 201 });
}
