import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const MOCK = [
  { displayId: "#PL-2026-0890", from: "🇮🇹 Rome", to: "🇬🇧 London",  carrier: "DHL Express",          tracking: "DHL-9283746510", progress: 75, eta: "May 6",  isMock: true },
  { displayId: "#PL-2026-0889", from: "🇮🇹 Rome", to: "🇯🇵 Tokyo",   carrier: "FedEx International",  tracking: "FX-4829371650",  progress: 40, eta: "May 8",  isMock: true },
  { displayId: "#PL-2026-0887", from: "🇮🇹 Rome", to: "🇦🇪 Dubai",   carrier: "Aramex Premium",       tracking: "ARM-7364820193", progress: 15, eta: "May 10", isMock: true },
  { displayId: "#PL-2026-0886", from: "🇮🇹 Rome", to: "🇮🇹 Milan",   carrier: "SDA Express",          tracking: "SDA-1928374650", progress: 60, eta: "May 5",  isMock: true },
];

export default async function AdminShipping() {
  const dbShipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" },
    include: { order: true },
  }).catch(() => []);

  const realShipments = dbShipments.map(s => ({
    displayId: `#PL-${s.orderId.slice(-8).toUpperCase()}`,
    from:      s.fromCity || "🇮🇹 Rome",
    to:        s.toCity   || s.order.country,
    carrier:   s.carrier,
    tracking:  s.tracking,
    progress:  s.progress,
    eta:       s.eta || "TBC",
    isMock:    false,
  }));

  // Also pull shipped orders that have tracking stored on the order but no Shipment record yet
  const shippedOrders = await prisma.order.findMany({
    where: { status: "shipped", shipment: null },
    orderBy: { updatedAt: "desc" },
  }).catch(() => []);

  const orderShipments = shippedOrders
    .filter(o => (o as unknown as Record<string, string>).tracking)
    .map(o => {
      const ord = o as unknown as Record<string, string>;
      return {
        displayId: `#PL-${o.id.slice(-8).toUpperCase()}`,
        from:      "🇮🇹 Rome",
        to:        o.country,
        carrier:   ord.carrier || "—",
        tracking:  ord.tracking || "—",
        progress:  50,
        eta:       "TBC",
        isMock:    false,
      };
    });

  const allShipments = [...realShipments, ...orderShipments, ...MOCK];
  const activeCount  = realShipments.length + orderShipments.length;

  return (
    <>
      <div className="admin-topbar"><h2>International Shipping</h2></div>
      <div className="admin-content">
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          {[
            { label: "Active Shipments",  value: activeCount || "—", change: activeCount ? `${activeCount} in transit` : "No live shipments yet" },
            { label: "Avg. Delivery Time", value: "4.2 days", change: "International express", featured: true },
            { label: "On-Time Rate",       value: "97.4%",    change: "↑ 2% vs last month" },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.featured ? "featured" : ""}`}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{String(s.value)}</div>
              <div className="stat-change">{s.change}</div>
            </div>
          ))}
        </div>

        {activeCount === 0 && (
          <div style={{ background: "var(--off-white)", border: "1.5px dashed var(--border)", padding: "24px 28px", marginBottom: 20, fontSize: 12, color: "var(--ink-faint)" }}>
            No live shipments yet. When you mark an order as <strong>Shipped</strong> in the Orders page and add a tracking number, it will appear here.
          </div>
        )}

        <div className="admin-table-wrap">
          <div className="admin-table-head">
            <h3>
              {activeCount > 0 ? "Live Shipment Tracking" : "Example Shipments"}
            </h3>
          </div>
          {allShipments.map((s, idx) => (
            <div key={idx} style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", opacity: s.isMock && activeCount > 0 ? 0.5 : 1 }}>
              {s.isMock && activeCount > 0 && (
                <div style={{ fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Example</div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--emerald)", marginBottom: 4 }}>{s.displayId}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
                    <span>{s.from}</span>
                    <span style={{ color: "var(--ink-faint)" }}>→</span>
                    <span>{s.to}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>ETA: {s.eta}</div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 2 }}>{s.carrier}</div>
                </div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--emerald)", letterSpacing: ".08em", marginBottom: 8 }}>{s.tracking}</div>
              <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", background: "var(--emerald)", width: `${s.progress}%`, transition: "width .5s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-faint)" }}>
                <span>Origin</span><span>{s.progress}% in transit</span><span>Destination</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
