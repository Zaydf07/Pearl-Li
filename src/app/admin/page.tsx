import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [orders, users, inquiries] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 4, include: { items: true } }),
      prisma.user.count(),
      prisma.inquiry.count({ where: { status: "new" } }),
    ]);
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    return { orders, users, inquiries, revenue };
  } catch { return { orders: [], users: 0, inquiries: 0, revenue: 0 }; }
}

const MOCK_ORDERS = [
  { id: "#PL-2026-0891", customer: "Sophia Chen", country: "🇸🇬 Singapore", items: "Astral Ring × 1", total: "$3,800", status: "os-delivered", label: "Delivered", date: "Apr 28" },
  { id: "#PL-2026-0890", customer: "Emma Williams", country: "🇬🇧 London", items: "Heritage Watch × 1", total: "$8,900", status: "os-shipped", label: "Shipped", date: "Apr 27" },
  { id: "#PL-2026-0889", customer: "Yuki Tanaka", country: "🇯🇵 Tokyo", items: "Pearl Earrings × 2", total: "$3,900", status: "os-processing", label: "Processing", date: "Apr 26" },
  { id: "#PL-2026-0888", customer: "Marie Dupont", country: "🇫🇷 Paris", items: "Serpentine Bracelet × 1", total: "$5,200", status: "os-delivered", label: "Delivered", date: "Apr 25" },
];

const MOCK_INQUIRIES = [
  { name: "Priya Mehta", country: "🇮🇳 India", type: "Engagement Ring", status: "is-new", label: "New" },
  { name: "Charlotte Brown", country: "🇦🇺 Australia", type: "Bespoke Commission", status: "is-pending", label: "Pending" },
];

const MOCK_SHIPPING = [
  { id: "#PL-2026-0890", from: "🇮🇹 Rome", to: "🇬🇧 London", carrier: "DHL Express", progress: 75, eta: "May 6" },
  { id: "#PL-2026-0889", from: "🇮🇹 Rome", to: "🇯🇵 Tokyo", carrier: "FedEx International", progress: 40, eta: "May 8" },
];

export default async function AdminDashboard() {
  const { orders: dbOrders, users, inquiries, revenue } = await getStats();

  const stats = [
    { label: "Revenue (May)", value: dbOrders.length ? `$${revenue.toLocaleString()}` : "$184,200", change: "↑ 23% vs last month", featured: true },
    { label: "Orders", value: dbOrders.length || 47, change: "↑ 12% vs last month", featured: false },
    { label: "New Customers", value: users || 28, change: "↑ 8% vs last month", featured: false },
    { label: "Open Inquiries", value: inquiries || 12, change: "↑ 4 new today", featured: false },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h2>Dashboard</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--ink-muted)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--emerald)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>A</div>
            <span>Admin</span>
          </div>
        </div>
      </div>
      <div className="admin-content">
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className={`stat-card ${s.featured ? "featured" : ""}`}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-change">{s.change}</div>
            </div>
          ))}
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-head"><h3>Recent Orders</h3></div>
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Region</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {MOCK_ORDERS.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: "monospace", color: "var(--emerald)" }}>{o.id}</td>
                  <td><strong>{o.customer}</strong></td>
                  <td>{o.country}</td>
                  <td>{o.items}</td>
                  <td style={{ fontFamily: "'Playfair Display',serif" }}><strong>{o.total}</strong></td>
                  <td><span className={`order-status ${o.status}`}>{o.label}</span></td>
                  <td style={{ color: "var(--ink-faint)" }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="admin-table-wrap">
            <div className="admin-table-head"><h3>New Inquiries</h3></div>
            {MOCK_INQUIRIES.map(i => (
              <div key={i.name} style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <strong style={{ fontSize: 13 }}>{i.name}</strong>
                  <span className={`order-status ${i.status}`}>{i.label}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{i.country} · {i.type}</div>
              </div>
            ))}
          </div>

          <div className="admin-table-wrap">
            <div className="admin-table-head"><h3>Active Shipments</h3></div>
            {MOCK_SHIPPING.map(s => (
              <div key={s.id} style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--emerald)" }}>{s.id}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>ETA {s.eta}</span>
                </div>
                <div style={{ fontSize: 12, marginBottom: 8 }}>{s.from} → {s.to}</div>
                <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "var(--emerald)", width: `${s.progress}%` }} />
                </div>
                <div style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 6 }}>{s.carrier} · {s.progress}% in transit</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
