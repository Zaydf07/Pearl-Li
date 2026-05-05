"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const COUNTRIES = [
  "Australia","Bahrain","Canada","China","Egypt","France","Germany","Hong Kong",
  "India","Italy","Japan","Kuwait","Malaysia","Netherlands","New Zealand",
  "Nigeria","Norway","Oman","Pakistan","Qatar","Saudi Arabia","Singapore",
  "South Africa","South Korea","Spain","Sweden","Switzerland","Thailand",
  "Turkey","UAE","United Kingdom","United States",
];

const SHIP_OPTS = [
  { id: "standard",    label: "Standard Delivery",   detail: "5–7 business days",                       price: 0  },
  { id: "express",     label: "Express Delivery",     detail: "2–3 business days",                       price: 32 },
  { id: "white-glove", label: "White Glove Service",  detail: "Next business day · Signature required",  price: 95 },
];

const LBL: React.CSSProperties = { display: "block", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase" as const, color: "var(--ink-muted)", marginBottom: 7, fontWeight: 600 };
const INP: React.CSSProperties = { width: "100%", border: "1.5px solid var(--border)", padding: "12px 14px", fontSize: 13, background: "var(--off-white)", outline: "none", color: "var(--ink)" };
const GRID2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };

export default function CheckoutClient() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep]       = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [info, setInfo] = useState({
    email: "", firstName: "", lastName: "", phone: "",
    address: "", address2: "", city: "", postCode: "", country: "United Kingdom",
  });
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment]   = useState({ name: "", card: "", expiry: "", cvv: "" });

  const shippingOpt  = SHIP_OPTS.find(o => o.id === shipping)!;
  const shippingCost = shippingOpt.price;
  const orderTotal   = total + shippingCost;

  const goToShipping = () => {
    if (!info.email || !info.firstName || !info.lastName || !info.address || !info.city || !info.postCode) {
      setError("Please fill in all required fields before continuing.");
      return;
    }
    setError("");
    setStep(2);
  };

  const placeOrder = async () => {
    if (items.length === 0) {
      setError("Your bag is empty.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  `${info.firstName} ${info.lastName}`,
          customerEmail: info.email,
          phone:         info.phone,
          addressLine1:  info.address,
          addressLine2:  info.address2 || "",
          city:          info.city,
          postCode:      info.postCode,
          country:       info.country,
          shippingMethod: shipping,
          total:         orderTotal,
          items:         items.map(i => ({ productId: i.id, qty: i.qty, price: i.price })),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Something went wrong. Please try again.");
        return;
      }
      clearCart();
      setSuccess(true);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) return (
    <>
      <div style={{ paddingTop: 116, background: "var(--off-white)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "var(--white)", padding: 60, textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 52, color: "var(--emerald)", marginBottom: 18 }}>✦</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 400, marginBottom: 10 }}>Thank You</h2>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "var(--ink-muted)", marginBottom: 8 }}>
            Your order has been received and is being prepared.
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 28 }}>
            A confirmation will appear in your account. You'll receive shipping updates once your order is dispatched.
          </p>
          <button className="btn-black" onClick={() => router.push("/account")}>View My Orders</button>
        </div>
      </div>
      <Footer />
    </>
  );

  // ── Step review badge ─────────────────────────────────────────────────────
  const ReviewRow = ({ label, value, onEdit, step: s }: { label: string; value: string; onEdit: () => void; step: number }) =>
    step > s ? (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>{label}</div>
          <div style={{ fontSize: 12, color: "var(--ink)" }}>{value}</div>
        </div>
        <button onClick={onEdit} style={{ background: "none", border: "none", fontSize: 10, color: "var(--emerald)", cursor: "pointer", letterSpacing: ".12em", textTransform: "uppercase" }}>Edit</button>
      </div>
    ) : null;

  // ── Order summary sidebar ─────────────────────────────────────────────────
  const Summary = () => (
    <div style={{ background: "var(--black)", padding: 32, color: "var(--white)", position: "sticky", top: 140, height: "fit-content" }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
        Order Summary
      </h3>

      {/* Items */}
      {items.length === 0 ? (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>Your bag is empty.</p>
      ) : (
        items.map(i => (
          <div key={i.id + (i.size ?? "") + (i.color ?? "")} style={{ display: "flex", gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ width: 56, height: 56, flexShrink: 0, background: "rgba(255,255,255,.06)", backgroundImage: i.image ? `url(${i.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "var(--white)", marginBottom: 3, lineHeight: 1.4 }}>{i.name}</div>
              {(i.size || i.color) && (
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 3 }}>
                  {[i.size && `Size ${i.size}`, i.color].filter(Boolean).join(" · ")}
                </div>
              )}
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>
                ${i.price.toLocaleString()} × {i.qty}
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--white)", fontFamily: "'Playfair Display',serif", flexShrink: 0 }}>
              ${(i.price * i.qty).toLocaleString()}
            </div>
          </div>
        ))
      )}

      {/* Totals */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.55)" }}>
          <span>Subtotal</span><span>${total.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.55)" }}>
          <span>Shipping</span>
          <span>
            {step < 2
              ? "Calculated at next step"
              : shippingCost === 0 ? "Free" : `$${shippingCost}`}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.35)" }}>
          <span>Tax</span><span>$0.00</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 14, marginTop: 4, fontFamily: "'Playfair Display',serif", fontSize: 19, color: "var(--white)" }}>
          <span>Total</span>
          <span>${(step >= 2 ? orderTotal : total).toLocaleString()}</span>
        </div>
      </div>

      <p style={{ fontSize: 9, letterSpacing: ".1em", color: "rgba(255,255,255,.25)", textAlign: "center", marginTop: 20, textTransform: "uppercase" }}>
        Secured · 256-bit SSL Encryption
      </p>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      <div className="checkout-page">
        {/* Progress steps */}
        <div className="container">
          <div className="ck-steps" style={{ paddingTop: 32 }}>
            {([["Information", 1], ["Shipping", 2], ["Payment", 3]] as const).map(([label, n], i) => (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <div className="ck-step-div" />}
                <div className={`ck-step ${step === n ? "active" : step > n ? "done" : ""}`}>
                  <div className="ck-step-num">{step > n ? "✓" : n}</div>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px" }}>
          <div>

            {/* ── Collapsed step summaries ── */}
            {(step === 2 || step === 3) && (
              <div style={{ background: "var(--white)", padding: "4px 24px", marginBottom: 16, border: "1.5px solid var(--border)" }}>
                <ReviewRow label="Contact" value={info.email} onEdit={() => setStep(1)} step={1} />
                <ReviewRow
                  label="Ship to"
                  value={`${info.firstName} ${info.lastName} · ${info.address}${info.address2 ? `, ${info.address2}` : ""}, ${info.city}, ${info.postCode}, ${info.country}`}
                  onEdit={() => setStep(1)}
                  step={1}
                />
              </div>
            )}
            {step === 3 && (
              <div style={{ background: "var(--white)", padding: "4px 24px", marginBottom: 16, border: "1.5px solid var(--border)" }}>
                <ReviewRow
                  label="Shipping method"
                  value={`${shippingOpt.label} · ${shippingCost === 0 ? "Free" : `$${shippingCost}`} · ${shippingOpt.detail}`}
                  onEdit={() => setStep(2)}
                  step={2}
                />
              </div>
            )}

            {/* ── Step 1: Information ── */}
            {step === 1 && (
              <div style={{ background: "var(--white)", padding: 36, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400, marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>
                  Contact Information
                </h3>
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>Email Address</label>
                  <input type="email" placeholder="your@email.com" value={info.email ?? ""} onChange={e => setInfo(f => ({ ...f, email: e.target.value }))} style={INP} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>Phone Number</label>
                  <input type="tel" placeholder="+1 234 567 8900" value={info.phone ?? ""} onChange={e => setInfo(f => ({ ...f, phone: e.target.value }))} style={INP} />
                </div>

                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 400, margin: "24px 0 16px", paddingBottom: 10, borderBottom: "1.5px solid var(--border)" }}>
                  Shipping Address
                </h3>
                <div style={{ ...GRID2, marginBottom: 14 }}>
                  <div><label style={LBL}>First Name</label><input value={info.firstName ?? ""} onChange={e => setInfo(f => ({ ...f, firstName: e.target.value }))} style={INP} /></div>
                  <div><label style={LBL}>Last Name</label><input value={info.lastName ?? ""} onChange={e => setInfo(f => ({ ...f, lastName: e.target.value }))} style={INP} /></div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={LBL}>Street Address</label>
                  <input value={info.address ?? ""} onChange={e => setInfo(f => ({ ...f, address: e.target.value }))} placeholder="123 Main Street" style={INP} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={LBL}>Apartment, Suite, Building <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <input value={info.address2 ?? ""} onChange={e => setInfo(f => ({ ...f, address2: e.target.value }))} style={INP} />
                </div>
                <div style={{ ...GRID2, marginBottom: 14 }}>
                  <div><label style={LBL}>Post Code / ZIP</label><input value={info.postCode ?? ""} onChange={e => setInfo(f => ({ ...f, postCode: e.target.value }))} style={INP} /></div>
                  <div><label style={LBL}>City</label><input value={info.city ?? ""} onChange={e => setInfo(f => ({ ...f, city: e.target.value }))} style={INP} /></div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={LBL}>Country</label>
                  <select value={info.country ?? ""} onChange={e => setInfo(f => ({ ...f, country: e.target.value }))} style={{ ...INP, fontFamily: "inherit" }}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}
                <button className="btn-black" style={{ width: "100%", padding: 16 }} onClick={goToShipping}>
                  Continue to Shipping →
                </button>
              </div>
            )}

            {/* ── Step 2: Shipping ── */}
            {step === 2 && (
              <div style={{ background: "var(--white)", padding: 36, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400, marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>
                  Shipping Method
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {SHIP_OPTS.map(opt => (
                    <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 18, border: `1.5px solid ${shipping === opt.id ? "var(--black)" : "var(--border)"}`, cursor: "pointer", background: shipping === opt.id ? "var(--off-white)" : "var(--white)" }}>
                      <input type="radio" name="ship" checked={shipping === opt.id} onChange={() => setShipping(opt.id)} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", marginBottom: 3 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{opt.detail}</div>
                      </div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 400 }}>
                        {opt.price === 0 ? <span style={{ color: "var(--emerald)" }}>Free</span> : `$${opt.price}`}
                      </div>
                    </label>
                  ))}
                </div>
                <button className="btn-black" style={{ width: "100%", padding: 16 }} onClick={() => setStep(3)}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── Step 3: Payment ── */}
            {step === 3 && (
              <div style={{ background: "var(--white)", padding: 36 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400, marginBottom: 24, paddingBottom: 14, borderBottom: "1.5px solid var(--border)" }}>
                  Payment Details
                </h3>

                {/* Payment disabled notice */}
                <div style={{ background: "#fef9e8", border: "1.5px solid #f0d080", padding: "14px 18px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>🔒</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#7a6010", marginBottom: 3 }}>Payment processing coming soon</div>
                    <div style={{ fontSize: 11, color: "#9a8020", lineHeight: 1.5 }}>
                      Stripe integration is being set up. Click Place Order to confirm your order — no payment will be charged.
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 16, opacity: 0.4, pointerEvents: "none" }}>
                  <label style={LBL}>Name on Card</label>
                  <input value="" placeholder="As it appears on your card" style={INP} readOnly />
                </div>
                <div style={{ marginBottom: 16, opacity: 0.4, pointerEvents: "none" }}>
                  <label style={LBL}>Card Number</label>
                  <input value="" placeholder="•••• •••• •••• ••••" style={INP} readOnly />
                </div>
                <div style={{ ...GRID2, marginBottom: 24, opacity: 0.4, pointerEvents: "none" }}>
                  <div>
                    <label style={LBL}>Expiry Date</label>
                    <input value="" placeholder="MM / YY" style={INP} readOnly />
                  </div>
                  <div>
                    <label style={LBL}>Security Code (CVV)</label>
                    <input value="" placeholder="•••" style={INP} readOnly />
                  </div>
                </div>

                {/* Order total recap */}
                <div style={{ background: "var(--off-white)", border: "1.5px solid var(--border)", padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Order Total</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-muted)" }}><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-muted)" }}><span>{shippingOpt.label}</span><span>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-muted)" }}><span>Tax</span><span>$0.00</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)", fontFamily: "'Playfair Display',serif", fontSize: 18 }}>
                      <strong>Total</strong><strong>${orderTotal.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}
                <button className="btn-emerald" style={{ width: "100%", padding: 18, fontSize: 13 }} onClick={placeOrder} disabled={loading}>
                  {loading ? "Placing Order…" : `Place Order · $${orderTotal.toLocaleString()} ✦`}
                </button>
                <p style={{ fontSize: 10, color: "var(--ink-faint)", textAlign: "center", marginTop: 10, letterSpacing: ".04em" }}>
                  Secured with 256-bit SSL encryption · All transactions are safe and encrypted
                </p>
              </div>
            )}
          </div>

          {/* Sticky order summary */}
          <Summary />
        </div>
      </div>
      <Footer />
    </>
  );
}
