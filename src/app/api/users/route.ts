import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, phone: true, country: true, role: true, createdAt: true, orders: { select: { total: true } } },
  });
  return NextResponse.json(users);
}
