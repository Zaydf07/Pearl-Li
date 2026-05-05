"use client";
import { useState } from "react";
import Link from "next/link";

interface OrderItem { name: string; qty: number; price: number; image: string | null; slug: string; }
interface Order {
  id: string; date: string; total: string; status: string;
  shipping: string; tracking: string | null; carrier: string | null;
  eta: string | null; shippedAt: string | null;
  address: string; updatedAt: string; items: OrderItem[];
}

interface Inquiry {
  id: string; type: string; message: string; status: string;
  reply: string | null; repliedAt: string | null;
  date: string; images: string | null;
}

const MOCK_ORDERS: Order[] = [
  { id: "mock-1", date: "April 28, 2026", total: "$3,800", status: "delivered",  shipping: "express",     tracking: "DHL-9283746510", carrier: "DHL Express",         eta: null,           shippedAt: new Date(Date.now() - 4 * 86400000).toISOString(), address: "12 Orchard Rd, Singapore",          updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(), items: [{ name: "Astral Ring",         qty: 1, price: 3800, image: null, slug: "astral-ring" }] },
  { id: "mock-2", date: "March 12, 2026", total: "$5,200", status: "shipped",    shipping: "white-glove", tracking: "FX-4829371650",  carrier: "FedEx International", eta: new Date(Date.now() + 2 * 86400000).toISOString(), shippedAt: new Date(Date.now() - 1 * 86400000).toISOString(), address: "45 Kensington High St, London", updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(), items: [{ name: "Serpentine Bracelet", qty: 1, price: 5200, image: null, slug: "serpentine-bracelet" }] },
  { id: "mock-3", date: "Feb 3, 2026",    total: "$8,900", status: "processing", shipping: "standard",    tracking: null,             carrier: null,                  eta: null,           shippedAt: null,                                              address: "3-1 Ginza, Tokyo",                  updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(), items: [{ name: "Heritage Watch",      qty: 1, price: 8900, image: null, slug: "heritage-watch" }] },
];

const STATUS_MAP: Record<string, { label: string; color: string; text: string; desc: string }> = {
  pending:    { label: "Pending",    color: "#fef9e8", text: "#7a6010",              desc: "Your order has been received and is being reviewed." },
  processing: { label: "Processing", color: "#e8f0fe", text: "#1a56db",              desc: "Your order is being prepared and will ship soon." },
  shipped:    { label: "Shipped",    color: "#e8f5ef", text: "var(--emerald-dark)",  desc: "Your order is on its way." },
  delivered:  { label: "Delivered",  color: "#f0fdf4", text: "#15803d",              desc: "Your order has been delivered. Enjoy!" },
  cancelled:  { label: "Cancelled",  color: "#fef2f2", text: "#b91c1c",              desc: "This order was cancelled." },
};

const TABS = ["Orders", "Inquiries", "Wishlist", "Addresses", "Profile"];

const isRecentlyUpdated = (updatedAt: string) =>
  Date.now() - new Date(updatedAt).getTime() < 48 * 3600 * 1000;

export default function AccountClient({
  orders: realOrders = [],
  inquiries = [],
  unreadReplies = 0,
  userEmail = "",
  userName = "",
}: {
  orders?: Order[];
  inquiries?: Inquiry[];
  unreadReplies?: number;
  userEmail?: string;
  userName?: string;
}) {
  const [tab, setTab]               = useState("Orders");
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [expandedInq, setExpandedInq] = useState<string | null>(null);

  // Show real orders at top, mock examples below if no real ones
  const orders = realOrders.length > 0 ? realOrders : MOCK_ORDERS;
  const usingMock = realOrders.length === 0;

  // Count recently updated shipped/delivered orders for notification dot
  const notifications = realOrders.filter(o =>
    ["shipped", "delivered"].includes(o.status) && isRecentlyUpdated(o.updatedAt)
  ).length;

  const renderOrders = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400 }}>My Orders</h2>
        {notifications > 0 && (
          <div style={{ background: "var(--emerald)", color: "white", fontSize: 10, padding: "5px 14px", letterSpacing: ".1em" }}>
            {notifications} order{notifications > 1 ? "s" : ""} updated
          </div>
        )}
      </div>

      {usingMock && (
        <div style={{ background: "#fef9e8", border: "1px solid #f0e0a0", padding: "10px 16px", fontSize: 11, color: "#7a6010", marginBottom: 20 }}>
          Sign in to see your real orders. Showing example orders below.
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink-faint)" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 12 }}>No orders yet</div>
          <Link href="/shop" className="btn-emerald" style={{ display: "inline-block" }}>Start Shopping</Link>
        </div>
      ) : (
        orders.map(o => {
          const st = STATUS_MAP[o.status] ?? STATUS_MAP.pending;
          const isNew = isRecentlyUpdated(o.updatedAt) && ["shipped", "delivered"].includes(o.status);
          const open  = expanded === o.id;

          return (
            <div key={o.id} style={{ border: `1.5px solid ${isNew ? "var(--emerald)" : "var(--border)"}`, marginBottom: 14, background: "var(--white)" }}>
              {/* Order header row */}
              <div style={{ display: "flex", gap: 16, padding: "18px 20px", alignItems: "center", cursor: "pointer" }} onClick={() => setExpanded(open ? null : o.id)}>
                {/* Product thumbnail */}
                <div style={{ width: 60, height: 60, flexShrink: 0, background: o.items[0]?.image ? undefined : "var(--cream)", backgroundImage: o.items[0]?.image ? `url(${o.items[0].image})` : undefined, backgroundSize: "cover", border: "1px solid var(--border)" }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>
                    {o.items.map(i => `${i.name}${i.qty > 1 ? ` × ${i.qty}` : ""}`).join(", ")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                    Ordered {o.date} · {o.total}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isNew && <span style={{ fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--emerald)", fontWeight: 700 }}>Updated</span>}
                    <span style={{ padding: "3px 10px", fontSize: 8, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600, background: st.color, color: st.text }}>
                      {st.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--ink-faint)" }}>{open ? "▲ Hide" : "▼ Details"}</span>
                </div>
              </div>

              {/* Expanded detail */}
              {open && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "20px 20px 20px" }}>
                  {/* Status description */}
                  <div style={{ background: st.color, border: `1px solid ${st.text}22`, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: st.text, lineHeight: 1.5 }}>
                    {st.desc}
                  </div>

                  {/* All items */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 10 }}>Items</div>
                    {o.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 44, height: 44, flexShrink: 0, background: item.image ? undefined : "var(--cream)", backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundSize: "cover", border: "1px solid var(--border)" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>Qty {item.qty} · ${item.price.toLocaleString()}</div>
                        </div>
                        <Link href={`/products/${item.slug}`} style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--emerald)", textDecoration: "none" }}>View →</Link>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Delivery Address</div>
                      <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>{o.address}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Shipping Method</div>
                      <div style={{ fontSize: 12, color: "var(--ink)", textTransform: "capitalize" }}>{o.shipping.replace("-", " ")}</div>
                    </div>
                  </div>

                  {/* Shipping timeline */}
                  {(o.shippedAt || o.tracking || o.eta) && (
                    <div style={{ background: "var(--off-white)", border: "1.5px solid var(--border)", padding: "16px 18px" }}>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 14 }}>Shipping Information</div>

                      {/* Timeline */}
                      <div style={{ display: "flex", gap: 0, marginBottom: o.tracking ? 16 : 0, position: "relative" }}>
                        {[
                          { label: "Order Placed",  date: o.date,                                                                done: true },
                          { label: "Dispatched",    date: o.shippedAt ? new Date(o.shippedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", done: !!o.shippedAt },
                          { label: "Est. Delivery", date: o.eta ? new Date(o.eta).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—", done: o.status === "delivered" },
                        ].map((step, i) => (
                          <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                            {i > 0 && <div style={{ position: "absolute", left: 0, top: 10, right: "50%", height: 2, background: step.done ? "var(--emerald)" : "var(--border)" }} />}
                            {i < 2 && <div style={{ position: "absolute", right: 0, top: 10, left: "50%", height: 2, background: step.done && i < 1 ? "var(--emerald)" : "var(--border)" }} />}
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: step.done ? "var(--emerald)" : "var(--border)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                              {step.done && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: step.done ? "var(--ink)" : "var(--ink-faint)", marginBottom: 2 }}>{step.label}</div>
                            <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>{step.date}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking number */}
                      {o.tracking && (
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
                          <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>Carrier &amp; Tracking</div>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{o.carrier} · <span style={{ fontFamily: "monospace", color: "var(--emerald)" }}>{o.tracking}</span></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderInquiries = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400 }}>My Inquiries</h2>
        {unreadReplies > 0 && (
          <div style={{ background: "var(--emerald)", color: "white", fontSize: 10, padding: "5px 14px", letterSpacing: ".1em" }}>
            {unreadReplies} new repl{unreadReplies > 1 ? "ies" : "y"}
          </div>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink-faint)" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 12 }}>No inquiries yet</div>
          <p style={{ fontSize: 12, marginBottom: 24 }}>Have a bespoke request or question? Our team is here to help.</p>
          <Link href="/consultation" className="btn-emerald" style={{ display: "inline-block" }}>Make an Inquiry</Link>
        </div>
      ) : (
        inquiries.map(inq => {
          const hasReply = !!inq.reply;
          const open = expandedInq === inq.id;
          const parseImages = (s: string | null): string[] => { try { return s ? JSON.parse(s) : []; } catch { return []; } };
          const imgs = parseImages(inq.images);

          return (
            <div key={inq.id} style={{ border: `1.5px solid ${hasReply && inq.status === "responded" ? "var(--emerald)" : "var(--border)"}`, marginBottom: 14, background: "var(--white)" }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 20px", cursor: "pointer" }} onClick={() => setExpandedInq(open ? null : inq.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{inq.type}</span>
                    {hasReply && (
                      <span style={{ fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", background: "#e8f5ef", color: "var(--emerald-dark)", padding: "2px 8px", fontWeight: 600 }}>
                        Reply received
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{inq.date}</div>
                </div>
                <span style={{ fontSize: 10, color: "var(--ink-faint)", flexShrink: 0, marginLeft: 12 }}>{open ? "▲ Hide" : "▼ View"}</span>
              </div>

              {/* Expanded */}
              {open && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "20px" }}>
                  {/* Customer's message */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>Your Message</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, lineHeight: 1.7, color: "var(--ink-muted)", padding: "14px 16px", background: "var(--off-white)", borderLeft: "3px solid var(--border)" }}>
                      "{inq.message}"
                    </div>
                  </div>

                  {/* Reference images if any */}
                  {imgs.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>Reference Images</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {imgs.map((url, i) => (
                          <img key={i} src={url} alt={`Ref ${i+1}`} style={{ width: 72, height: 72, objectFit: "cover", border: "1.5px solid var(--border)" }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin reply */}
                  {hasReply ? (
                    <div style={{ background: "#f0fdf4", border: "1.5px solid var(--emerald)", padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--emerald)" }}>
                          Reply from Pearl &amp; Li
                        </div>
                        {inq.repliedAt && (
                          <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>
                            {new Date(inq.repliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.7, fontFamily: "'Cormorant Garamond',serif" }}>
                        {inq.reply}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "var(--off-white)", border: "1.5px dashed var(--border)", padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                        Our team will respond to your inquiry soon. You'll see their reply here.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderContent = () => {
    if (tab === "Addresses") return (
      <div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>Saved Addresses</h2>
        <div style={{ border: "1.5px solid var(--border)", padding: 24, marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Default · Home</div>
          <div style={{ fontSize: 13, lineHeight: 1.9 }}>
            {userName || "Guest"}<br />
            {realOrders[0]?.address || "No saved address yet"}
          </div>
        </div>
        <button className="btn-outline-dark">+ Add New Address</button>
      </div>
    );

    if (tab === "Profile") return (
      <div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>My Profile</h2>
        <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
          <div>
            <label style={{ display: "block", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 7, fontWeight: 600 }}>Full Name</label>
            <input type="text" defaultValue={userName} style={{ width: "100%", border: "1.5px solid var(--border)", padding: 12, fontSize: 13, background: "var(--off-white)", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 7, fontWeight: 600 }}>Email</label>
            <input type="email" defaultValue={userEmail} style={{ width: "100%", border: "1.5px solid var(--border)", padding: 12, fontSize: 13, background: "var(--off-white)", outline: "none" }} />
          </div>
          <button className="btn-emerald" style={{ width: "fit-content" }}>Save Changes</button>
        </div>
      </div>
    );

    return (
      <div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>My Wishlist</h2>
        <p style={{ color: "var(--ink-muted)", fontFamily: "'Cormorant Garamond',serif", fontSize: 17 }}>
          Your wishlist is empty. <Link href="/shop" style={{ color: "var(--emerald)" }}>Browse collections →</Link>
        </p>
      </div>
    );
  };

  return (
    <div className="account-grid-override" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 36, maxWidth: 1100, margin: "48px auto", padding: "0 48px" }}>
      {/* Sidebar */}
      <div className="account-sidebar-override" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "12px 18px", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 600, color: tab === t ? "var(--black)" : "var(--ink-muted)", background: tab === t ? "var(--white)" : "none", border: "none", textAlign: "left", cursor: "pointer", borderLeft: `2.5px solid ${tab === t ? "var(--emerald)" : "transparent"}`, position: "relative" }}>
            {t}
            {t === "Orders" && notifications > 0 && (
              <span style={{ position: "absolute", top: 10, right: 14, width: 8, height: 8, borderRadius: "50%", background: "var(--emerald)" }} />
            )}
            {t === "Inquiries" && unreadReplies > 0 && (
              <span style={{ position: "absolute", top: 10, right: 14, width: 8, height: 8, borderRadius: "50%", background: "var(--emerald)" }} />
            )}
          </button>
        ))}
        <Link href="/login">
          <button style={{ marginTop: 24, padding: "12px 18px", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 600, color: "var(--ink-faint)", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}>
            Sign Out
          </button>
        </Link>
      </div>

      {/* Content */}
      <div style={{ background: "var(--white)", padding: 36 }}>{renderContent()}</div>
    </div>
  );
}
