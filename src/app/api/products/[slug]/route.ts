import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await req.json();
  const product = await prisma.product.update({ where: { slug }, data });
  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await prisma.product.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
}
