"use client";
import React, { useState } from "react";

interface OrderItem { name: string; qty: number; price: number; image?: string | null; }
interface Order {
  id: string; displayId: string; customer: string; email: string;
  country: string; address: string; total: string; totalNum: number;
  status: string; label: string; date: string; shippingMethod: string;
  items: OrderItem[]; tracking?: string | null; carrier?: string | null;
  eta?: string | null; shippedAt?: string | null;
  isMock?: boolean;
}

const STATUSES = [
  { value: "pending",    label: "Pending",    color: "#fef9e8", text: "#7a6010" },
  { value: "processing", label: "Processing", color: "#e8f0fe", text: "#1a56db" },
  { value: "shipped",    label: "Shipped",    color: "#e8f5ef", text: "var(--emerald-dark)" },
  { value: "delivered",  label: "Delivered",  color: "#f0fdf4", text: "#15803d" },
  { value: "cancelled",  label: "Cancelled",  color: "#fef2f2", text: "#b91c1c" },
];

const statusStyle = (s: string) => {
  const st = STATUSES.find(x => x.value === s.replace("os-", "")) ?? STATUSES[0];
  return { padding: "3px 10px", fontSize: 8, letterSpacing: ".12em", textTransform: "uppercase" as const, fontWeight: 600, background: st.color, color: st.text };
};

export default function AdminOrdersClient({ orders: initial }: { orders: Order[] }) {
  const [orders, setOrders]   = useState(initial);
  const [selected, setSelected] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [tracking, setTracking]   = useState("");
  const [carrier, setCarrier]     = useState("");
  const [eta, setEta]             = useState("");
  const [saving, setSaving]       = useState(false);

  const openOrder = (o: Order) => {
    setSelected(o);
    setNewStatus(o.status.replace("os-", ""));
    setTracking(o.tracking ?? "");
    setCarrier(o.carrier ?? "");
    setEta(o.eta ? o.eta.slice(0, 10) : "");
  };

  const handleUpdate = async () => {
    if (!selected || selected.isMock) return;
    setSaving(true);
    const body: Record<string, string> = { status: newStatus };
    if (newStatus === "shipped") {
      body.tracking = tracking;
      body.carrier  = carrier;
      body.eta      = eta;
      body.shippedAt = new Date().toISOString();
    }
    await fetch(`/api/orders/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setOrders(prev => prev.map(o =>
      o.id === selected.id
        ? { ...o, status: `os-${newStatus}`, label: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), tracking, carrier, eta }
        : o
    ));
    setSelected(prev => prev ? { ...prev, status: `os-${newStatus}`, label: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), tracking, carrier, eta } : null);
    setSaving(false);
  };

  const LBL: React.CSSProperties = { fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase" as const, color: "var(--ink-muted)", display: "block", marginBottom: 6 };
  const INP: React.CSSProperties = { width: "100%", border: "1.5px solid var(--border)", padding: "10px 12px", fontSize: 13, outline: "none", background: "var(--white)", color: "var(--ink)" };

  return (
    <>
      <div className="admin-topbar"><h2>Orders</h2></div>
      <div className="admin-content">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <input placeholder="Search orders, customers…" style={{ flex: 1, border: "1.5px solid var(--border)", padding: "10px 14px", fontSize: 12, background: "var(--white)", outline: "none" }} />
          <select style={{ border: "1.5px solid var(--border)", padding: "10px 14px", fontSize: 12, background: "var(--white)", outline: "none" }}>
            <option>All Statuses</option>{STATUSES.map(s => <option key={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Ship To</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.displayId}>
                  <td style={{ fontFamily: "monospace", color: "var(--emerald)", fontSize: 11 }}>{o.displayId}</td>
                  <td><strong>{o.customer}</strong><div style={{ fontSize: 10, color: "var(--ink-faint)" }}>{o.email}</div></td>
                  <td style={{ fontSize: 11 }}>{o.country}</td>
                  <td style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                    {o.items.length > 0 ? o.items.map(i => `${i.name} × ${i.qty}`).join(", ") : o.country}
                  </td>
                  <td style={{ fontFamily: "'Playfair Display',serif" }}><strong>{o.total}</strong></td>
                  <td><span style={statusStyle(o.status)}>{o.label}</span></td>
                  <td style={{ color: "var(--ink-faint)", fontSize: 11 }}>{o.date}</td>
                  <td>
                    <button onClick={() => openOrder(o)} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--emerald)", cursor: "pointer" }}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ORDER DETAIL MODAL ── */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 3000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 20px" }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: "var(--white)", width: "100%", maxWidth: 680, padding: 40 }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--emerald)", marginBottom: 4 }}>{selected.displayId}</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, marginBottom: 4 }}>{selected.customer}</h2>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{selected.email} · {selected.date}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-faint)" }}>×</button>
            </div>

            {/* Items */}
            <div style={{ borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)", padding: "16px 0", marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Items Ordered</div>
              {selected.items.length > 0 ? selected.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, background: "var(--cream)", backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundSize: "cover", flexShrink: 0, border: "1px solid var(--border)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Qty: {item.qty} · ${item.price.toLocaleString()} each</div>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14 }}>${(item.price * item.qty).toLocaleString()}</div>
                </div>
              )) : (
                <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>Item details not available for this order.</div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)", fontFamily: "'Playfair Display',serif", fontSize: 16 }}>
                <strong>Order Total</strong><strong>{selected.total}</strong>
              </div>
            </div>

            {/* Shipping address */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>Shipping Address</div>
              <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>
                {selected.address || `${selected.country}`}<br />
                Shipping: <span style={{ color: "var(--emerald)", textTransform: "capitalize" }}>{selected.shippingMethod}</span>
              </div>
            </div>

            {/* Existing tracking info */}
            {selected.tracking && (
              <div style={{ background: "var(--off-white)", border: "1.5px solid var(--border)", padding: "16px 18px", marginBottom: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 10 }}>Current Shipping Info</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>Carrier</div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{selected.carrier || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>Tracking</div>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--emerald)" }}>{selected.tracking}</div>
                  </div>
                  {selected.eta && (
                    <div>
                      <div style={{ fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>Est. Delivery</div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{new Date(selected.eta).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status update */}
            {selected.isMock ? (
              <div style={{ background: "var(--off-white)", border: "1.5px dashed var(--border)", padding: 16, fontSize: 12, color: "var(--ink-faint)", textAlign: "center" }}>
                This is example data — status updates are available for real orders only.
              </div>
            ) : (
              <div style={{ background: "var(--off-white)", border: "1.5px solid var(--border)", padding: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 16 }}>Update Order Status</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div style={{ marginBottom: 14, gridColumn: "1/-1" }}>
                    <label style={LBL}>Status</label>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={INP}>
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  {newStatus === "shipped" && (
                    <>
                      <div style={{ marginBottom: 14 }}>
                        <label style={LBL}>Carrier</label>
                        <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5 }}>e.g. DHL Express, FedEx, Aramex</div>
                        <input value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="DHL Express" style={INP} />
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <label style={LBL}>Tracking Number</label>
                        <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5 }}>Customer will see this in their account</div>
                        <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="e.g. DHL-928374651" style={INP} />
                      </div>
                      <div style={{ marginBottom: 14, gridColumn: "1/-1" }}>
                        <label style={LBL}>Estimated Delivery Date</label>
                        <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5 }}>Customer will see this alongside their tracking info</div>
                        <input
                          type="date"
                          value={eta}
                          onChange={e => setEta(e.target.value)}
                          min={new Date().toISOString().slice(0, 10)}
                          style={INP}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button onClick={() => setSelected(null)} className="btn-outline-dark" style={{ padding: "10px 20px" }}>Close</button>
                  <button onClick={handleUpdate} disabled={saving} className="btn-emerald" style={{ padding: "10px 28px" }}>
                    {saving ? "Saving…" : "Update Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
