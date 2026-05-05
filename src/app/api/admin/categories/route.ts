import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ parentType: "asc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        parentType: body.parentType ?? "Jewellery",
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(category);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
