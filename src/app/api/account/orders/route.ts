import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 200 });

  const orders = await prisma.order.findMany({
    where: { customerEmail: session.user.email },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      shipment: true,
    },
  }).catch(() => []);

  return NextResponse.json(orders);
}
