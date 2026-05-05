import { prisma } from "@/lib/db";
import AdminOrdersClient from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

const MOCK = [
  { id: "mock-1", displayId: "#PL-2026-0891", customer: "Sophia Chen",     email: "sophia@example.com",   country: "Singapore", address: "12 Orchard Rd, Singapore 238823",    total: "$3,800", totalNum: 3800,  status: "os-delivered",  label: "Delivered",  date: "Apr 28 2026", shippingMethod: "express",     items: [{ name: "Astral Ring",          qty: 1, price: 3800, image: null }], tracking: "DHL-9283746510", carrier: "DHL Express", isMock: true },
  { id: "mock-2", displayId: "#PL-2026-0890", customer: "Emma Williams",   email: "emma@example.com",     country: "London, UK", address: "45 Kensington High St, London W8 5ED", total: "$8,900", totalNum: 8900,  status: "os-shipped",    label: "Shipped",    date: "Apr 27 2026", shippingMethod: "white-glove", items: [{ name: "Heritage Watch",        qty: 1, price: 8900, image: null }], tracking: "FX-4829371650", carrier: "FedEx International", isMock: true },
  { id: "mock-3", displayId: "#PL-2026-0889", customer: "Yuki Tanaka",     email: "yuki@example.com",     country: "Tokyo, JP",  address: "3-1 Ginza, Chuo, Tokyo 104-0061",     total: "$3,900", totalNum: 3900,  status: "os-processing", label: "Processing", date: "Apr 26 2026", shippingMethod: "express",     items: [{ name: "Pearl Earrings",        qty: 2, price: 1950, image: null }], tracking: null, carrier: null, isMock: true },
  { id: "mock-4", displayId: "#PL-2026-0888", customer: "Marie Dupont",    email: "marie@example.com",    country: "Paris, FR",  address: "8 Rue du Faubourg Saint-Honoré, 75008", total: "$5,200", totalNum: 5200,  status: "os-delivered",  label: "Delivered",  date: "Apr 25 2026", shippingMethod: "white-glove", items: [{ name: "Serpentine Bracelet",   qty: 1, price: 5200, image: null }], tracking: "ARM-7364820193", carrier: "Aramex Premium", isMock: true },
  { id: "mock-5", displayId: "#PL-2026-0887", customer: "Layla Al-Rashid", email: "layla@example.com",    country: "Dubai, UAE", address: "DIFC Gate Ave, Dubai UAE",             total: "$6,800", totalNum: 6800,  status: "os-pending",    label: "Pending",    date: "Apr 24 2026", shippingMethod: "standard",    items: [{ name: "Jadore Choker",         qty: 1, price: 6800, image: null }], tracking: null, carrier: null, isMock: true },
];

export default async function AdminOrdersPage() {
  const dbOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      items: { include: { product: true } },
      shipment: true,
    },
  }).catch(() => []);

  const realOrders = dbOrders.map(o => ({
    id:             o.id,
    displayId:      `#PL-${o.id.slice(-8).toUpperCase()}`,
    customer:       o.customerName,
    email:          o.customerEmail,
    country:        o.country,
    address:        `${o.addressLine1}${o.addressLine2 ? `, ${o.addressLine2}` : ""}, ${o.city}, ${o.postCode}, ${o.country}`,
    total:          `$${o.total.toLocaleString()}`,
    totalNum:       o.total,
    status:         `os-${o.status}`,
    label:          o.status.charAt(0).toUpperCase() + o.status.slice(1),
    date:           new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    shippingMethod: o.shippingMethod,
    items:          o.items.map(i => ({
      name:  i.product.name,
      qty:   i.qty,
      price: i.price,
      image: i.product.image,
    })),
    tracking:  o.shipment?.tracking ?? null,
    carrier:   o.shipment?.carrier  ?? null,
    isMock:    false,
  }));

  // Real orders first, then mock examples
  const orders = [...realOrders, ...MOCK];

  return <AdminOrdersClient orders={orders} />;
}
