import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
