import { prisma } from "@/lib/db";
import AdminPromotionsClient from "./AdminPromotionsClient";

export const dynamic = "force-dynamic";

const MOCK_PROMOTIONS = [
  { id: "mock-1", name: "Celestial Sale",   type: "percentage",    discount: 20,   collections: "Celestial, Jadore", code: "CELESTIAL20", endsAt: "2026-05-31T00:00:00Z", status: "active", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", description: "Up to 20% off across Celestial and Jadore collections.", badge: "Limited Time", sortOrder: 0, isMock: true },
  { id: "mock-2", name: "Spring Welcome",   type: "free_shipping", discount: null, collections: null,                code: "SPRING",      endsAt: "2026-05-31T00:00:00Z", status: "active", image: null, description: "Complimentary shipping on all orders this season.", badge: null, sortOrder: 1, isMock: true },
  { id: "mock-3", name: "VIP Member Offer", type: "percentage",    discount: 10,   collections: null,                code: "VIP10",       endsAt: "2026-06-30T00:00:00Z", status: "draft",  image: null, description: null, badge: null, sortOrder: 2, isMock: true },
];

export default async function AdminPromotionsPage() {
  const dbPromos = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  const realPromos = dbPromos.map(p => ({
    id:          p.id,
    name:        p.name,
    type:        p.type,
    discount:    p.discount,
    collections: p.collections,
    code:        p.code,
    endsAt:      p.endsAt?.toISOString() ?? null,
    status:      p.status,
    image:       p.image       ?? null,
    description: p.description ?? null,
    badge:       p.badge       ?? null,
    sortOrder:   p.sortOrder   ?? 0,
    isMock:      false,
  }));

  const promotions = [...realPromos, ...MOCK_PROMOTIONS];

  return <AdminPromotionsClient promotions={promotions} />;
}
