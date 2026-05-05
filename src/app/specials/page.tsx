import { prisma } from "@/lib/db";
import Link from "next/link";
import PromoTimer from "@/components/PromoTimer";
import Footer from "@/components/Footer";
import SpecialsClient from "./SpecialsClient";

export const dynamic = "force-dynamic";

export default async function SpecialsPage() {
  // Fetch all active promotions — first one drives the hero, rest appear as posts
  const activePromos = await prisma.promotion.findMany({
    where: { status: "active" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);

  const activePromo = activePromos[0] ?? null;
  const promoPosts  = activePromos; // all shown as posts below hero

  const products = await prisma.product.findMany({
    where: { isSale: true },
    take: 12,
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  // Build hero text from the active promotion, or fall back to defaults
  const heroEyebrow  = "Limited Time";
  const heroTitle    = activePromo?.name ?? "The Celestial Sale";
  const heroSubtitle = activePromo
    ? activePromo.type === "percentage" && activePromo.discount
      ? `Up to ${activePromo.discount}% off${activePromo.collections ? ` · ${activePromo.collections}` : ""}`
      : activePromo.type === "free_shipping"
      ? "Complimentary shipping on all orders"
      : activePromo.type === "fixed" && activePromo.discount
      ? `$${activePromo.discount} off your order`
      : "Exclusive savings — ends soon"
    : "Up to 30% off — ends soon";

  const endDate = activePromo?.endsAt?.toISOString() ?? null;

  return (
    <>
      <div style={{ background: "var(--black)", color: "var(--white)", padding: "140px 0 80px", textAlign: "center" }}>
        <span className="eyebrow" style={{ color: "var(--emerald-mid)", display: "block", marginBottom: 12 }}>
          {heroEyebrow}
        </span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(34px,5vw,60px)", fontWeight: 400, marginBottom: 10 }}>
          {heroTitle}
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "rgba(255,255,255,.55)" }}>
          {heroSubtitle}
        </p>
        {activePromo?.code && (
          <div style={{ marginTop: 16, display: "inline-block", border: "1px solid rgba(255,255,255,.2)", padding: "8px 20px", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>
            Use code: <strong style={{ color: "var(--emerald-mid)" }}>{activePromo.code}</strong>
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          <PromoTimer endDate={endDate} />
        </div>
      </div>

      {/* Promo posts — all active promotions shown as image cards */}
      {promoPosts.length > 0 && (
        <div style={{ background: "var(--off-white)", padding: "60px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 28, textAlign: "center" }}>
              Current Offers
            </div>
            <div style={{ display: "grid", gridTemplateColumns: promoPosts.length === 1 ? "1fr" : promoPosts.length === 2 ? "1fr 1fr" : "repeat(3, 1fr)", gap: 20 }}>
              {promoPosts.map(promo => (
                <div key={promo.id} style={{ background: "var(--white)", border: "1.5px solid var(--border)", overflow: "hidden" }}>
                  {/* Banner image */}
                  {promo.image ? (
                    <div style={{ position: "relative", aspectRatio: "16/7", overflow: "hidden" }}>
                      <img src={promo.image} alt={promo.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.55))" }} />
                      {promo.badge && (
                        <div style={{ position: "absolute", top: 14, left: 14, background: "var(--emerald)", color: "white", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, padding: "5px 12px" }}>
                          {promo.badge}
                        </div>
                      )}
                      <div style={{ position: "absolute", bottom: 18, left: 20, right: 20 }}>
                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,2.5vw,28px)", fontWeight: 400, color: "var(--white)", margin: 0, lineHeight: 1.2 }}>{promo.name}</h3>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "var(--black)", padding: "32px 28px" }}>
                      {promo.badge && (
                        <div style={{ fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--emerald-mid)", marginBottom: 10 }}>{promo.badge}</div>
                      )}
                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 400, color: "var(--white)", margin: 0 }}>{promo.name}</h3>
                    </div>
                  )}
                  {/* Post body */}
                  <div style={{ padding: 24 }}>
                    {promo.description && (
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, lineHeight: 1.6, color: "var(--ink-muted)", marginBottom: 16 }}>
                        {promo.description}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      {promo.type === "percentage" && promo.discount && (
                        <span style={{ fontSize: 13, fontFamily: "'Playfair Display',serif", color: "var(--red)", fontWeight: 400 }}>
                          {promo.discount}% off
                        </span>
                      )}
                      {promo.type === "free_shipping" && (
                        <span style={{ fontSize: 13, color: "var(--emerald)" }}>Free Shipping</span>
                      )}
                      {promo.type === "fixed" && promo.discount && (
                        <span style={{ fontSize: 13, fontFamily: "'Playfair Display',serif", color: "var(--red)" }}>
                          ${promo.discount} off
                        </span>
                      )}
                      {promo.collections && (
                        <span style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: ".08em" }}>· {promo.collections}</span>
                      )}
                      {promo.code && (
                        <span style={{ fontSize: 10, background: "var(--off-white)", border: "1px solid var(--border)", padding: "4px 10px", letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "monospace" }}>
                          {promo.code}
                        </span>
                      )}
                      {promo.endsAt && (
                        <span style={{ fontSize: 10, color: "var(--ink-faint)" }}>
                          Ends {new Date(promo.endsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-faint)" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 12 }}>No sale items yet</div>
            <p style={{ fontSize: 13 }}>Mark products as &quot;On Sale&quot; in the admin panel to show them here.</p>
            <Link href="/shop" className="btn-emerald" style={{ display: "inline-block", marginTop: 24 }}>Browse All Pieces</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, padding: "60px 0" }}>
            {products.map((p, i) => {
              const discountPct =
                activePromo?.type === "percentage" && activePromo.discount
                  ? activePromo.discount
                  : [15, 20, 25, 30, 15, 20][i % 6];
              const salePrice = Math.round(p.price * (1 - discountPct / 100));
              return (
                <Link key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ aspectRatio: "4/3", backgroundImage: p.image ? `url(${p.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center", background: p.image ? undefined : "var(--cream)", position: "relative" }}>
                      <div style={{ position: "absolute", top: 14, left: 14, padding: "4px 10px", fontSize: 8, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, background: "var(--red)", color: "white" }}>
                        -{discountPct}%
                      </div>
                    </div>
                    <div style={{ padding: 22 }}>
                      <div style={{ fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--emerald)", fontWeight: 600, marginBottom: 6 }}>{p.collection}</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, marginBottom: 8 }}>{p.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0 14px" }}>
                        <span style={{ fontSize: 12, color: "var(--ink-faint)", textDecoration: "line-through" }}>${p.price.toLocaleString()}</span>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "var(--red)" }}>${salePrice.toLocaleString()}</span>
                      </div>
                      <SpecialsClient product={{ id: p.id, slug: p.slug, name: p.name, collection: p.collection, price: p.price, type: p.type, image: p.image }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
