import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORIES_DATA, COLLECTIONS_DATA } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import PromoTimer from "@/components/PromoTimer";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({ where: { isNew: true }, take: 4 });
  } catch { return []; }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-section hero-centered">
        <HeroCarousel />
        <div className="hero-overlay" />
        <div className="hero-content hero-content--centered">

          {/* Brand mark — clearly separate from the headline */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
            padding: "8px 24px",
            border: "1px solid rgba(168,216,192,0.35)",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{ width: 20, height: 1, background: "var(--emerald-mid)" }} />
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "var(--emerald-mid)",
            }}>
              Pearl &amp; Li
            </span>
            <div style={{ width: 20, height: 1, background: "var(--emerald-mid)" }} />
          </div>

          {/* Main headline */}
          <h1 className="hero-title" style={{ marginBottom: 0 }}>Crafted for</h1>
          <span className="hero-title-italic">Eternity</span>

          {/* Divider */}
          <div style={{ width: 40, height: 1, background: "rgba(168,216,192,0.5)", margin: "28px auto" }} />

          {/* Subtitle */}
          <p className="hero-sub" style={{ margin: "0 auto 44px", fontSize: "clamp(15px,1.6vw,19px)" }}>
            Where Italian artistry meets Eastern grace — fine jewellery and luxury goods for the discerning collector.
          </p>

          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link href="/shop" className="btn-emerald">Explore Collection</Link>
            <Link href="/consultation" className="btn-white">Book Consultation</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── CATEGORY INTRO ── */}
      <div style={{ background: "var(--white)", textAlign: "center", padding: "72px 0 52px" }}>
        <span className="eyebrow" style={{ display: "block", marginBottom: 14 }}>Collections &amp; Categories</span>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 3vw, 42px)",
          fontWeight: 400,
          color: "var(--black)",
          margin: "0 auto 10px",
          lineHeight: 1.15,
        }}>
          Every Piece Tells a Story
        </p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18,
          fontWeight: 300,
          color: "var(--ink-muted)",
          margin: 0,
          letterSpacing: "0.02em",
        }}>
          Discover what calls to you.
        </p>
      </div>

      {/* ── CATEGORY STRIP ── */}
      <div className="cat-strip">
        {CATEGORIES_DATA.map((cat) => (
          <Link href={`/shop?filter=${cat.type}`} key={cat.name} style={{ textDecoration: "none" }}>
            <div className="cat-cell" style={{ aspectRatio: "2/3" }}>
              <div className="cat-bg" style={{ backgroundImage: `url(${cat.image})` }} />
              <div className="cat-dark-overlay" />
              <div className="cat-content">
                <div className="cat-name">{cat.name}</div>
                <div className="cat-sub">{cat.sub}</div>
                <span className="cat-cta">Explore →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: "140px 0", background: "var(--white)" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 80 }}>
            <div className="home-divider" />
            <span className="eyebrow" style={{ display: "block", marginBottom: 20 }}>New Arrivals</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 58px)",
              fontWeight: 400,
              color: "var(--black)",
              margin: "0 0 20px",
              lineHeight: 1.1,
            }}>
              Celestial Collection
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              fontWeight: 300,
              color: "var(--ink-muted)",
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.75,
            }}>
              Star-mapped geometry in 18k gold and South Sea pearls — each piece a wearable universe.
            </p>
          </div>
        </div>
        <div className="product-grid" style={{ maxWidth: 1400, margin: "0 auto" }}>
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <Link href="/shop" className="btn-outline-e">View All Pieces</Link>
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ── */}
      <div className="editorial-split">
        <div className="editorial-media">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9519f94f4d90?w=900&q=80"
            alt="Pearl & Li editorial"
          />
        </div>
        <div className="editorial-text-panel" style={{ padding: "100px 96px" }}>
          <span className="eyebrow" style={{ color: "var(--emerald-mid)", marginBottom: 24, display: "block", letterSpacing: "0.36em" }}>
            The Pearl &amp; Li Story
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.2vw, 46px)", lineHeight: 1.1, marginBottom: 28 }}>
            Born from <em>Two Worlds</em>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 300, lineHeight: 1.85, color: "rgba(255,255,255,.65)", marginBottom: 52 }}>
            A dialogue between Italian goldsmithing and Eastern pearl cultivation — each piece carries centuries of mastery, shaped for those who seek the extraordinary.
          </p>
          <Link href="/collections" className="btn-emerald" style={{ alignSelf: "flex-start" }}>
            Discover Our Heritage
          </Link>
        </div>
      </div>

      {/* ── PROMO BANNER ── */}
      <section className="promo-bar" style={{ padding: "120px 0" }}>
        <div className="container">
          <div className="home-divider" style={{ background: "rgba(255,255,255,.3)", marginBottom: 24 }} />
          <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)", display: "block", marginBottom: 20, letterSpacing: "0.36em" }}>
            Limited Time
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 4.5vw, 64px)",
            fontWeight: 400,
            margin: "0 0 16px",
            lineHeight: 1.05,
          }}>
            The Celestial Sale
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            color: "rgba(255,255,255,.65)",
            fontWeight: 300,
            margin: "0 auto 52px",
            lineHeight: 1.65,
            maxWidth: 480,
          }}>
            Up to 30% off selected jewellery and accessories
          </p>
          <PromoTimer />
          <div style={{ marginTop: 56 }}>
            <Link href="/specials" className="btn-white">Shop the Sale</Link>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS BAND ── */}
      <section className="collections-band" style={{ padding: "120px 0" }}>
        <div className="container">
          <div className="collections-header">
            <div>
              <span className="eyebrow" style={{ color: "var(--emerald-mid)", display: "block", marginBottom: 12 }}>
                Iconic Collections
              </span>
              <h2 className="collections-header h2" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 3.5vw, 52px)",
                fontWeight: 400,
                color: "var(--white)",
                margin: 0,
                lineHeight: 1.1,
              }}>
                Defining <em className="t-italic" style={{ color: "var(--emerald-mid)" }}>Elegance</em>
              </h2>
            </div>
            <Link href="/collections" className="btn-ghost-white">All Collections</Link>
          </div>
        </div>
        <div className="collections-grid">
          {COLLECTIONS_DATA.map((coll) => (
            <Link href="/shop" key={coll.name} style={{ textDecoration: "none" }}>
              <div className="coll-card">
                <img src={coll.image} alt={coll.name} className="coll-bg" />
                <div className="coll-overlay" />
                <div className="coll-content">
                  <div className="coll-eyebrow">{coll.eyebrow}</div>
                  <h3>{coll.name}</h3>
                  <p>{coll.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
