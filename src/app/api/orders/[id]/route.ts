import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendStatusUpdate } from "@/lib/email";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, shipment: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status, tracking, carrier, eta, shippedAt, ...rest } = body;

  const order = await prisma.order.update({
    where: { id },
    data: { status, ...rest },
    include: { items: { include: { product: true } } },
  });

  // If status changed to something the customer should know about, send email
  if (["processing", "shipped", "delivered"].includes(status)) {
    sendStatusUpdate({
      to:           order.customerEmail,
      customerName: order.customerName,
      orderId:      order.id,
      status,
      tracking:     tracking ?? null,
      carrier:      carrier  ?? null,
      items:        order.items.map(i => ({ name: i.product.name, qty: i.qty, price: i.price })),
    }).catch(e => console.error("Status update email failed:", e));
  }

  // If marking as shipped, create or update the Shipment record
  if (status === "shipped" && tracking) {
    await prisma.shipment.upsert({
      where:  { orderId: id },
      create: {
        orderId:  id,
        carrier:  carrier  ?? "Unknown",
        tracking: tracking,
        fromCity: "Rome",
        toCity:   order.country,
        progress: 10,
        eta:      eta ?? null,
      },
      update: {
        carrier:  carrier  ?? "Unknown",
        tracking: tracking,
        progress: 10,
        eta:      eta ?? null,
      },
    });
  }

  // If marked delivered, update shipment progress to 100
  if (status === "delivered") {
    await prisma.shipment.updateMany({
      where: { orderId: id },
      data:  { progress: 100 },
    }).catch(() => {});
  }

  return NextResponse.json(order);
}
