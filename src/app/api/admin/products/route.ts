import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const product = await prisma.product.create({
      data: {
        slug: `${slug}-${Date.now()}`,
        name: body.name,
        collection: body.collection,
        price: parseFloat(body.price),
        type: body.type,
        description: body.description,
        material: body.material ?? "",
        gemstone: body.gemstone ?? "",
        origin: body.origin ?? "",
        image: body.image ?? null,
        images: body.images ?? null,
        sizes: body.sizes ?? null,
        colors: body.colors ?? null,
        subCategory: body.subCategory || null,
        isNew: body.isNew ?? false,
        isSale: body.isSale ?? false,
        stock: parseInt(body.stock ?? "10"),
      } as Parameters<typeof prisma.product.create>[0]["data"],
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
