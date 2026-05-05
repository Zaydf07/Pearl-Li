import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const meta = await prisma.collectionMeta.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(meta);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
