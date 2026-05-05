import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const collection = await prisma.collectionMeta.update({
      where: { id },
      data: {
        name: body.name,
        eyebrow: body.eyebrow ?? null,
        caption: body.caption ?? null,
        description: body.description ?? null,
        image: body.image ?? null,
      },
    });
    return NextResponse.json(collection);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update collection meta. The CollectionMeta table may not exist yet. Run migrations." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.collectionMeta.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete collection meta. The CollectionMeta table may not exist yet. Run migrations." }, { status: 500 });
  }
}
