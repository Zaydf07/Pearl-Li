import { prisma } from "@/lib/db";
import AdminInquiriesClient from "./AdminInquiriesClient";

export const dynamic = "force-dynamic";

const MOCK = [
  { id: "mock-1", name: "Priya Mehta",       email: "priya@mehta.in",       country: "🇮🇳 India",        type: "Engagement Ring",     message: "Looking for a bespoke engagement ring with emerald and diamond. Budget around $15,000.", status: "is-new",       label: "New",       date: "May 4",  reply: null, images: null },
  { id: "mock-2", name: "Charlotte Brown",   email: "c.brown@email.com",    country: "🇦🇺 Australia",    type: "Bespoke Commission",  message: "Would like to commission a pearl necklace to match my wedding dress.",                  status: "is-pending",   label: "Pending",   date: "May 3",  reply: null, images: null },
  { id: "mock-3", name: "Aisha Mohammed",    email: "aisha@gmail.com",      country: "🇸🇦 Saudi Arabia", type: "Collection Viewing",  message: "Interested in viewing the full Celestial collection. Available for virtual appointment.", status: "is-responded", label: "Responded", date: "May 2",  reply: "Thank you Aisha — we would love to arrange a virtual viewing. Please let us know your preferred time.", images: null },
  { id: "mock-4", name: "Lin Wei",           email: "linwei@outlook.com",   country: "🇨🇳 China",        type: "Investment Piece",    message: "Looking for investment-grade pieces. Prefer jade and diamond combinations.",             status: "is-new",       label: "New",       date: "May 1",  reply: null, images: null },
];

export default async function AdminInquiries() {
  const dbInquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  const realInquiries = dbInquiries.map(i => ({
    id: i.id,
    name: i.name,
    email: i.email,
    country: i.country || "—",
    type: i.type,
    message: i.message,
    status: `is-${i.status}`,
    label: i.status.charAt(0).toUpperCase() + i.status.slice(1),
    date: new Date(i.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    reply: i.reply ?? null,
    images: i.images ?? null,
  }));

  // Show real inquiries first, then mock ones below
  const inquiries = [...realInquiries, ...MOCK];

  return <AdminInquiriesClient inquiries={inquiries} />;
}
