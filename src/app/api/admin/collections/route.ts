import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const collection = await prisma.collectionMeta.create({
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
    return NextResponse.json({ error: "Failed to create collection meta. The CollectionMeta table may not exist yet. Run migrations." }, { status: 500 });
  }
}
