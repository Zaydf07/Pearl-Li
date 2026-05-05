import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
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
      } as Parameters<typeof prisma.product.update>[0]["data"],
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
