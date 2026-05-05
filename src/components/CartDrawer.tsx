"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, total, open, toggleCart, removeItem } = useCart();
  const router = useRouter();

  return (
    <>
      <div className={`cart-overlay ${open ? "open" : ""}`} onClick={toggleCart} />
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-head">
          <h3>Shopping Bag</h3>
          <button onClick={toggleCart} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--ink-faint)" }}>✕</button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink-faint)" }}>
              <div style={{ fontSize: 36, opacity: 0.25, marginBottom: 12 }}>◇</div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Your bag is empty</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 76, height: 76, background: "var(--cream)", flexShrink: 0, backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 3 }}>{item.collection}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, marginBottom: 6 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>${item.price.toLocaleString()} · Qty {item.qty}</div>
                <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", fontSize: 10, color: "var(--ink-faint)", textDecoration: "underline", marginTop: 5, cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-foot">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Subtotal</span>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22 }}>${total.toLocaleString()}</span>
          </div>
          <button className="btn-emerald" style={{ width: "100%", marginBottom: 10 }} onClick={() => { toggleCart(); router.push("/checkout"); }}>
            Checkout
          </button>
          <button className="btn-outline-dark" style={{ width: "100%" }} onClick={() => { toggleCart(); router.push("/shop"); }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}
