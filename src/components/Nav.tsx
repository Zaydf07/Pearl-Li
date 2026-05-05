"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface Category { id: string; name: string; slug: string; parentType: string; sortOrder: number; }
interface CollectionMeta { name: string; eyebrow?: string | null; caption?: string | null; description?: string | null; image?: string | null; href: string; }

const FALLBACK_COLLECTIONS: CollectionMeta[] = [
  { name: "Celestial",   eyebrow: "New 2026",  image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", href: "/collections/Celestial"   },
  { name: "Serpentine",  eyebrow: "Signature", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", href: "/collections/Serpentine"  },
  { name: "Jadore",      eyebrow: "Heritage",  image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", href: "/collections/Jadore"      },
  { name: "Timepieces",  eyebrow: "Curated",   image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80", href: "/collections/Timepieces"  },
  { name: "Accessories", eyebrow: "Luxury",    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", href: "/collections/Accessories" },
];

export default function Nav() {
  const { count, toggleCart }   = useCart();
  const { count: wishCount }    = useWishlist();
  const [atTop, setAtTop]       = useState(true);
  const [dark, setDark]         = useState(false);
  const [openMenu, setOpenMenu]       = useState<"shop" | "collections" | null>(null);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [categories, setCategories]   = useState<Category[]>([]);
  const [collections, setCollections] = useState<CollectionMeta[]>(FALLBACK_COLLECTIONS);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
    fetch("/api/collections")
      .then(r => r.json())
      .then((data: Omit<CollectionMeta, "href">[]) => {
        if (Array.isArray(data) && data.length > 0)
          setCollections(data.map(c => ({ ...c, href: `/collections/${encodeURIComponent(c.name)}` })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    setDark(path === "/" || path === "/collections" || path === "/specials");
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (menu: "shop" | "collections") =>
    setOpenMenu(prev => (prev === menu ? null : menu));

  const transparent = atTop && dark;

  return (
    <>
      <div className="announcement-bar">
        Complimentary worldwide shipping on orders over $800 &nbsp;·&nbsp; New: <strong>Celestial 2026</strong> &nbsp;·&nbsp; Book a private consultation
      </div>

      <nav id="main-nav" className={transparent ? "at-top" : ""} ref={navRef}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo" style={{ textDecoration: "none" }}>
            Pearl <span>&</span> Li
          </Link>

          <div className="nav-links">
            {/* Shop dropdown */}
            <Link
              href="/shop"
              className={`nav-link${openMenu === "shop" ? " nav-link-active" : ""}`}
              onMouseEnter={() => setOpenMenu("shop")}
              onFocus={() => setOpenMenu("shop")}
              onClick={() => setOpenMenu(null)}
            >
              Shop
            </Link>

            {/* Collections dropdown */}
            <Link
              href="/collections"
              className={`nav-link${openMenu === "collections" ? " nav-link-active" : ""}`}
              onMouseEnter={() => setOpenMenu("collections")}
              onFocus={() => setOpenMenu("collections")}
              onClick={() => setOpenMenu(null)}
            >
              Collections
            </Link>

            <Link href="/specials"     className="nav-link">Specials</Link>
            <Link href="/consultation" className="nav-link">Consultation</Link>
          </div>

          <div className="nav-actions">
            <Link href="/account"  className="nav-act-btn nav-desktop-only">Account</Link>
            <Link href="/wishlist" className="nav-act-btn nav-desktop-only">
              Wishlist {wishCount > 0 && <span className="cart-dot">{wishCount}</span>}
            </Link>
            <Link href="/admin" className="nav-act-btn nav-desktop-only"
              style={{ color: "var(--emerald)", fontWeight: 700, border: "1px solid var(--emerald)", padding: "4px 10px" }}>
              Admin ⚙
            </Link>
            <button className="nav-act-btn" onClick={toggleCart}>
              Bag <span className="cart-dot">{count}</span>
            </button>
            {/* Hamburger — mobile only */}
            <button className="nav-hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
              <span className={`ham-line${mobileOpen ? " open" : ""}`} />
              <span className={`ham-line${mobileOpen ? " open" : ""}`} />
              <span className={`ham-line${mobileOpen ? " open" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── SHOP DROPDOWN ── */}
      <div
        className={`nav-dropdown${openMenu === "shop" ? " open" : ""}`}
        onClick={() => setOpenMenu(null)}
      >
        <div className="nav-dd-inner">
          {/* Col 1 — Jewellery categories */}
          <div>
            <div className="nav-dd-title">Jewellery</div>
            {categories.filter(c => c.parentType === "Jewellery").map(cat => (
              <Link key={cat.id} href={`/shop/${cat.slug}`} className="nav-dd-link">{cat.name}</Link>
            ))}
            <Link href="/shop" className="nav-dd-link-all">View All Jewellery →</Link>
          </div>

          {/* Col 2 — Other */}
          <div>
            <div className="nav-dd-title">More</div>
            {categories.filter(c => c.parentType === "Watches").map(cat => (
              <Link key={cat.id} href={`/shop/${cat.slug}`} className="nav-dd-link">{cat.name}</Link>
            ))}
            {categories.filter(c => c.parentType === "Accessories").map(cat => (
              <Link key={cat.id} href={`/shop/${cat.slug}`} className="nav-dd-link">{cat.name}</Link>
            ))}
            <Link href="/specials" className="nav-dd-link">Gifts &amp; Sale</Link>
            <Link href="/shop" className="nav-dd-link-all" style={{ marginTop: 28 }}>Browse Everything →</Link>
          </div>

          {/* Col 3 — Featured */}
          <div>
            <div className="nav-dd-title">Featured</div>
            <Link href="/shop?filter=New"  className="nav-dd-link">New Arrivals</Link>
            <Link href="/shop?filter=Sale" className="nav-dd-link">On Sale</Link>
            <Link href="/consultation"     className="nav-dd-link">Private Consultation</Link>
          </div>

          {/* Col 4 — Image */}
          <div>
            <div className="nav-dd-title">New This Season</div>
            <Link href="/collections/Celestial" style={{ textDecoration: "none" }}>
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"
                alt="Celestial Collection"
                className="nav-dd-img"
              />
              <div className="nav-dd-caption">Celestial Collection — 2026</div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── COLLECTIONS DROPDOWN ── */}
      <div
        className={`nav-dropdown${openMenu === "collections" ? " open" : ""}`}
        onClick={() => setOpenMenu(null)}
      >
        <div className="nav-dd-inner" style={{ gridTemplateColumns: "1fr 1fr 1fr 1.4fr" }}>
          {/* Collections list */}
          <div style={{ gridColumn: "1 / 3" }}>
            <div className="nav-dd-title">Our Collections</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
              {collections.map(c => (
                <div key={c.name} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 8, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 4 }}>{c.eyebrow || "Collection"}</div>
                  <Link href={c.href} className="nav-dd-link" style={{ marginBottom: 0, fontSize: 20 }}>{c.name}</Link>
                </div>
              ))}
            </div>
            <Link href="/collections" className="nav-dd-link-all" style={{ marginTop: 16 }}>Explore All Collections →</Link>
          </div>

          {/* Spacer */}
          <div />

          {/* Featured image */}
          <div>
            <div className="nav-dd-title">Currently Featuring</div>
            <Link href={collections[0]?.href ?? "/collections/Celestial"} style={{ textDecoration: "none" }}>
              <img
                src={collections[0]?.image ?? "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"}
                alt={collections[0]?.name ?? "Celestial"}
                className="nav-dd-img"
              />
              <div className="nav-dd-caption">
                {collections[0]?.caption ?? `The ${collections[0]?.name ?? "Celestial"} Collection — ${collections[0]?.eyebrow ?? "New 2026"}`}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`mobile-nav-drawer${mobileOpen ? " open" : ""}`}>
        <div className="mobile-nav-head">
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18 }}>Pearl <span style={{ color: "var(--emerald)" }}>&</span> Li</span>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-faint)" }}>×</button>
        </div>
        <div className="mobile-nav-body">
          <div className="mobile-nav-section">Shop</div>
          <Link href="/shop"         className="mobile-nav-link" onClick={() => setMobileOpen(false)}>All Pieces</Link>
          {categories.filter(c => c.parentType === "Jewellery").map(c => (
            <Link key={c.id} href={`/shop/${c.slug}`} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>{c.name}</Link>
          ))}
          {categories.filter(c => c.parentType !== "Jewellery").map(c => (
            <Link key={c.id} href={`/shop/${c.slug}`} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>{c.name}</Link>
          ))}

          <div className="mobile-nav-section">Collections</div>
          {collections.map(c => (
            <Link key={c.name} href={c.href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{c.name}</Link>
          ))}

          <div className="mobile-nav-section">More</div>
          <Link href="/specials"     className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Specials</Link>
          <Link href="/consultation" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Consultation</Link>
          <Link href="/account"      className="mobile-nav-link" onClick={() => setMobileOpen(false)}>My Account</Link>
          <Link href="/wishlist"     className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Wishlist {wishCount > 0 && `(${wishCount})`}</Link>
          <Link href="/admin"        className="mobile-nav-link" onClick={() => setMobileOpen(false)} style={{ color: "var(--emerald)" }}>Admin ⚙</Link>
        </div>
      </div>
    </>
  );
}
