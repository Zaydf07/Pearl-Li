import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(promotions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const promotion = await prisma.promotion.create({
      data: {
        name:        body.name,
        type:        body.type        ?? "percentage",
        discount:    body.discount    ? parseFloat(body.discount) : null,
        collections: body.collections ?? null,
        code:        body.code?.trim() || null,
        endsAt:      body.endsAt ? new Date(body.endsAt) : null,
        status:      body.status      ?? "active",
        image:       body.image       ?? null,
        description: body.description ?? null,
        badge:       body.badge       ?? null,
        sortOrder:   body.sortOrder   ? parseInt(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(promotion);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
