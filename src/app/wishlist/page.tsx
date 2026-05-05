"use client";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleMoveToBag = (item: typeof items[0]) => {
    addToCart({ id: item.id, slug: item.slug, name: item.name, collection: item.collection, price: item.price, type: item.type, image: item.image });
    removeItem(item.id);
  };

  return (
    <>
      {/* Header */}
      <div style={{ background: "var(--black)", paddingTop: 140, paddingBottom: 60, textAlign: "center", color: "var(--white)" }}>
        <span className="eyebrow" style={{ color: "var(--emerald-mid)", display: "block", marginBottom: 14 }}>Your Saved Pieces</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 400, margin: 0 }}>
          Wishlist
        </h1>
        {items.length > 0 && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,.5)", marginTop: 12 }}>
            {items.length} {items.length === 1 ? "piece" : "pieces"} saved
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ background: "var(--off-white)", minHeight: "60vh", padding: "80px 0" }}>
        <div className="container">
          {items.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.2 }}>♡</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: "var(--black)", marginBottom: 12 }}>
                Nothing saved yet
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: "var(--ink-muted)", marginBottom: 36 }}>
                Browse our collections and save the pieces that speak to you.
              </p>
              <Link href="/shop" className="btn-emerald">Explore the Shop</Link>
            </div>
          ) : (
            <>
              <div className="wishlist-grid">
                {items.map(item => (
                  <div key={item.id} className="wishlist-card">
                    <Link href={`/products/${item.slug}`} style={{ textDecoration: "none", display: "block" }}>
                      <div className="wishlist-card-img">
                        {item.image
                          ? <img src={item.image} alt={item.name} />
                          : <div style={{ background: "var(--cream)", width: "100%", height: "100%" }} />
                        }
                      </div>
                    </Link>

                    <div className="wishlist-card-info">
                      <div className="product-collection">{item.collection}</div>
                      <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
                        <div className="wishlist-card-name">{item.name}</div>
                      </Link>
                      <div className="wishlist-card-price">${item.price.toLocaleString()}</div>

                      <div className="wishlist-card-actions">
                        <button className="btn-emerald" style={{ fontSize: "9px", padding: "12px 24px" }} onClick={() => handleMoveToBag(item)}>
                          Move to Bag
                        </button>
                        <button className="wishlist-remove-btn" onClick={() => removeItem(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: 64 }}>
                <Link href="/shop" className="btn-outline-e">Continue Browsing</Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
