"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { COLLECTIONS_14KT, FALLBACK_CATEGORIES, isStyleSection } from "@/lib/categories";

interface Category { id: string; name: string; slug: string; parentType: string; sortOrder: number; }

// Shop menu: built from the curated category list so it is the same with or without a database.
// Categories that have styles get their own column; the rest go under "More".
const SHOP_MENU_ORDER = ["Rings", "Bracelets", "Earrings", "Pendants"];
const SHOP_MENU_GROUPS = SHOP_MENU_ORDER.map(name => ({
  name,
  slug: FALLBACK_CATEGORIES.find(c => c.name === name)?.slug ?? name.toLowerCase(),
  styles: COLLECTIONS_14KT.filter(c => c.parent === name).map(c => ({ name: c.name, slug: FALLBACK_CATEGORIES.find(f => f.name === c.name)?.slug ?? c.name.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-") })),
}));
const SHOP_MENU_OTHER = FALLBACK_CATEGORIES.filter(c => !isStyleSection(c.name) && !SHOP_MENU_ORDER.includes(c.name));
interface CollectionMeta { name: string; eyebrow?: string | null; caption?: string | null; description?: string | null; image?: string | null; href: string; }

const FALLBACK_COLLECTIONS: CollectionMeta[] = [
  { name: "CT Bracelets", eyebrow: "Signature", image: "/ct-jewellery/Bracelet/LOVE_BRACELET_6.1MM_10_DIAMONDS/image11.png", href: "/collections/CT%20Bracelets" },
  { name: "CT Necklaces", eyebrow: "New 2026", image: "/ct-jewellery/Necklace/LOVE_NECKLACE_16MM_2_DIAMONDS/image61.png", href: "/collections/CT%20Necklaces" },
  { name: "CT Rings",     eyebrow: "Heritage",  image: "/ct-jewellery/Ring/LOVE_RING_5.5MM_3_DIAMONDS/image71.png", href: "/collections/CT%20Rings"     },
  { name: "CT Earrings",  eyebrow: "Luxury",    image: "/ct-jewellery/Earrings/LOVE_HOOP_EARRINGS_5.7MM_2_DIAMONDS/image98.png", href: "/collections/CT%20Earrings"  },
  ...COLLECTIONS_14KT.map(c => ({ ...c, href: `/collections/${encodeURIComponent(c.name)}` })),
];

export default function Nav() {
  const router = useRouter();
  const { count, toggleCart }   = useCart();
  const { count: wishCount }    = useWishlist();
  const [atTop, setAtTop]       = useState(true);
  const [dark, setDark]         = useState(false);
  const [openMenu, setOpenMenu]       = useState<"shop" | "collections" | null>(null);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [categories, setCategories]   = useState<Category[]>([]);
  const [collections, setCollections] = useState<CollectionMeta[]>(FALLBACK_COLLECTIONS);
  const [search, setSearch]     = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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
    setDark(path === "/" || path === "/collections" || path === "/specials" || path === "/consultation");
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // The dropdown panels sit outside <nav>, so a press inside one must not count as an
      // outside click. Closing here would disable the panel before the link's click lands.
      const target = e.target as Element;
      if (target.closest?.(".nav-dropdown")) return;
      if (navRef.current && !navRef.current.contains(target))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (menu: "shop" | "collections") =>
    setOpenMenu(prev => (prev === menu ? null : menu));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
      setSearch("");
    } else {
      // On laptop widths the box is collapsed to its icon; clicking the icon opens it.
      searchRef.current?.focus();
    }
  };

  const transparent = atTop && dark;

  return (
    <>
      <div className="announcement-bar">
        <span className="announcement-text">
          Complimentary worldwide shipping on orders over $800
          <span className="announcement-extra"> &nbsp;·&nbsp; New: <strong>CT Series</strong> &nbsp;·&nbsp; Book a private consultation</span>
        </span>
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
            {/* Search form — desktop only */}
            <form onSubmit={handleSearch} className="nav-search nav-desktop-only" style={{ position: "relative", display: "flex", alignItems: "center", background: "transparent" }}>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jewels..."
                style={{
                  width: 120,
                  padding: "6px 8px 6px 8px",
                  fontSize: 11,
                  border: "none",
                  borderBottom: `1px solid ${transparent ? "rgba(255,255,255,0.3)" : "var(--border)"}`,
                  background: "transparent",
                  color: transparent ? "white" : "var(--ink)",
                  outline: "none",
                  transition: "all .2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor = transparent ? "rgba(255,255,255,0.6)" : "var(--emerald)";
                  e.currentTarget.style.paddingBottom = "4px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottomColor = transparent ? "rgba(255,255,255,0.3)" : "var(--border)";
                  e.currentTarget.style.paddingBottom = "6px";
                }}
              />
              <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: transparent ? "rgba(255,255,255,0.7)" : "var(--ink-faint)", padding: "0 0 6px 6px", transition: "color .2s" }} title="Search">
                🔍
              </button>
            </form>

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
        <div className="nav-dd-inner nav-dd-shop">
          {/* One column per category, with its styles listed underneath */}
          {SHOP_MENU_GROUPS.map(group => (
            <div key={group.name}>
              <div className="nav-dd-title">{group.name}</div>
              <Link href={`/shop?category=${group.slug}`} className="nav-dd-link nav-dd-link-strong">All {group.name}</Link>
              {group.styles.map(s => (
                <Link key={s.slug} href={`/shop?category=${s.slug}`} className="nav-dd-link">{s.name}</Link>
              ))}
            </div>
          ))}

          {/* Categories without styles, plus the store-wide filters */}
          <div>
            <div className="nav-dd-title">More</div>
            {SHOP_MENU_OTHER.map(c => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className="nav-dd-link">{c.name}</Link>
            ))}
            <Link href="/shop?filter=New" className="nav-dd-link">New Arrivals</Link>
            <Link href="/shop?filter=Sale" className="nav-dd-link">Sale</Link>
            <Link href="/specials" className="nav-dd-link">Specials</Link>
            <Link href="/shop" className="nav-dd-link-all">Browse Everything →</Link>
          </div>

          {/* Featured image */}
          <div>
            <div className="nav-dd-title">Featured Now</div>
            <Link href="/shop?category=heart-pendants" style={{ textDecoration: "none" }}>
              <img
                src="/14kt-jewellery/Pendants/PBZHS0105Y-24b97f84.jpg"
                alt="Heart diamond pendant in 14K yellow gold"
                className="nav-dd-img nav-dd-img-contain"
              />
              <div className="nav-dd-caption">Heart Pendants — 14K Yellow Gold</div>
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
          <div style={{ gridColumn: "1 / 4" }}>
            <div style={{ fontSize: 8, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 12, fontWeight: 600 }}>Collections</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 400, color: "var(--black)", marginBottom: 4, lineHeight: 1.1 }}>Signature Collections</h3>
            <p style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 32, lineHeight: 1.6 }}>Explore our signature jewellery collections</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 40px" }}>
              {collections.map(c => (
                <div key={c.name} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 8, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 4 }}>{c.eyebrow || "Collection"}</div>
                  <Link href={c.href} className="nav-dd-link" style={{ marginBottom: 0, fontSize: 20 }}>{c.name}</Link>
                </div>
              ))}
            </div>
            <Link href="/collections" className="nav-dd-link-all" style={{ marginTop: 32 }}>Explore All Collections →</Link>
          </div>

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
          {/* Mobile search */}
          <form onSubmit={handleSearch} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--off-white)", padding: "6px 12px", borderRadius: 4 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  flex: 1,
                  padding: 0,
                  fontSize: 12,
                  border: "none",
                  background: "transparent",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
              <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--ink-faint)" }}>
                🔍
              </button>
            </div>
          </form>

          <div className="mobile-nav-section">Shop</div>
          <Link href="/shop"         className="mobile-nav-link" onClick={() => setMobileOpen(false)}>All Pieces</Link>
          {(categories.length ? categories : FALLBACK_CATEGORIES).filter(c => c.parentType === "Jewellery" && !isStyleSection(c.name)).map(c => (
            <Link key={c.id} href={`/shop?category=${encodeURIComponent(c.slug)}`} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>{c.name}</Link>
          ))}
          {(categories.length ? categories : FALLBACK_CATEGORIES).filter(c => c.parentType !== "Jewellery").map(c => (
            <Link key={c.id} href={`/shop?category=${encodeURIComponent(c.slug)}`} className="mobile-nav-link mobile-nav-sub" onClick={() => setMobileOpen(false)}>{c.name}</Link>
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
