import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        name:        body.name,
        type:        body.type,
        discount:    body.discount ? parseFloat(body.discount) : null,
        collections: body.collections ?? null,
        code:        body.code?.trim() || null,
        endsAt:      body.endsAt ? new Date(body.endsAt) : null,
        status:      body.status,
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

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.promotion.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
