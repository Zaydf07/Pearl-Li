import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AccountClient from "./AccountClient";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // Fetch real orders for this user by email
  const rawOrders = session?.user?.email
    ? await prisma.order.findMany({
        where: { customerEmail: session.user.email },
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } }, shipment: true },
      }).catch(() => [])
    : [];

  const orders = rawOrders.map(o => ({
    id:       o.id,
    date:     new Date(o.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    total:    `$${o.total.toLocaleString()}`,
    status:   o.status,
    shipping: o.shippingMethod,
    tracking:  o.shipment?.tracking  ?? null,
    carrier:   o.shipment?.carrier  ?? null,
    eta:       o.shipment?.eta      ?? null,
    shippedAt: o.status === "shipped" || o.status === "delivered" ? o.updatedAt.toISOString() : null,
    address:  `${o.addressLine1}, ${o.city}, ${o.country}`,
    updatedAt: o.updatedAt.toISOString(),
    items: o.items.map(i => ({
      name:  i.product.name,
      qty:   i.qty,
      price: i.price,
      image: i.product.image,
      slug:  i.product.slug,
    })),
  }));

  // Fetch inquiries submitted with this email
  const rawInquiries = session?.user?.email
    ? await prisma.inquiry.findMany({
        where: { email: session.user.email },
        orderBy: { createdAt: "desc" },
      }).catch(() => [])
    : [];

  const inquiries = rawInquiries.map(i => ({
    id:        i.id,
    type:      i.type,
    message:   i.message,
    status:    i.status,
    reply:     i.reply     ?? null,
    repliedAt: i.repliedAt ? i.repliedAt.toISOString() : null,
    date:      new Date(i.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    images:    i.images    ?? null,
  }));

  const userName = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Guest";

  // Unread replies = inquiries replied to that customer hasn't acknowledged
  const unreadReplies = inquiries.filter(i => i.reply && i.status === "responded").length;

  return (
    <>
      <div style={{ paddingTop: 116, background: "var(--off-white)", minHeight: "100vh" }}>
        <div style={{ background: "var(--black)", padding: "52px 0" }}>
          <div className="container">
            <span className="eyebrow" style={{ color: "var(--emerald-mid)", display: "block", marginBottom: 8 }}>Welcome Back</span>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 400, color: "var(--white)", marginBottom: 4 }}>
              {userName}
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "rgba(255,255,255,.45)" }}>
              Manage orders, wishlist, addresses and preferences
            </p>
          </div>
        </div>
        <AccountClient
          orders={orders}
          inquiries={inquiries}
          unreadReplies={unreadReplies}
          userEmail={session?.user?.email ?? ""}
          userName={session?.user?.name ?? ""}
        />
      </div>
      <Footer />
    </>
  );
}
