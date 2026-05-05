import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const inquiry = await prisma.inquiry.update({ where: { id }, data });
  return NextResponse.json(inquiry);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.inquiry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
