import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } }, shipment: true },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName, customerEmail, phone,
      addressLine1, addressLine2, city, postCode, country,
      shippingMethod, total, items, userId,
    } = body;

    // Basic validation
    if (!customerName?.trim() || !customerEmail?.trim() || !addressLine1?.trim() || !city?.trim() || !postCode?.trim() || !country?.trim()) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 });
    }

    // Verify which product IDs actually exist in the DB
    const productIds = items.map((i: { productId: string }) => i.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const validIds = new Set(existingProducts.map(p => p.id));

    // Filter to only valid items — if none are valid, create order with no items for now
    const validItems = (items as { productId: string; qty: number; price: number }[])
      .filter(i => validIds.has(i.productId));

    const order = await prisma.order.create({
      data: {
        customerName:   customerName.trim(),
        customerEmail:  customerEmail.trim(),
        phone:          phone          || null,
        addressLine1:   addressLine1.trim(),
        addressLine2:   addressLine2   || "",
        city:           city.trim(),
        postCode:       postCode.trim(),
        country:        country.trim(),
        shippingMethod: shippingMethod || "standard",
        total:          parseFloat(String(total)),
        userId:         userId         || null,
        status:         "pending",
        ...(validItems.length > 0 && {
          items: {
            create: validItems.map(i => ({
              productId: i.productId,
              qty:       i.qty,
              price:     parseFloat(String(i.price)),
            })),
          },
        }),
      },
      include: { items: { include: { product: true } } },
    });

    // Send confirmation email — non-blocking
    sendOrderConfirmation({
      to:             customerEmail.trim(),
      customerName:   customerName.trim(),
      orderId:        order.id,
      items:          order.items.map(i => ({ name: i.product.name, qty: i.qty, price: i.price })),
      total:          parseFloat(String(total)),
      address:        `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}, ${city}, ${postCode}, ${country}`,
      shippingMethod: shippingMethod || "standard",
    }).catch(e => console.error("Confirmation email failed:", e));

    return NextResponse.json(order, { status: 201 });
  } catch (e: unknown) {
    console.error("Order creation failed:", e);
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
