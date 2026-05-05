"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { section: "Overview", items: [{ label: "Dashboard", icon: "◈", href: "/admin" }] },
  { section: "Commerce", items: [{ label: "Orders", icon: "◻", href: "/admin/orders" }, { label: "Shipping", icon: "◈", href: "/admin/shipping" }, { label: "Products", icon: "◇", href: "/admin/products" }, { label: "Categories", icon: "⊞", href: "/admin/categories" }] },
  { section: "Customers", items: [{ label: "Users", icon: "◯", href: "/admin/users" }, { label: "Inquiries", icon: "✉", href: "/admin/inquiries" }] },
  { section: "Settings", items: [{ label: "Promotions", icon: "✦", href: "/admin/promotions" }] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <div className="logo">Pearl <span>&</span> Li</div>
        <span className="badge">Admin Panel</span>
      </div>
      <nav className="admin-nav">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <div className="admin-nav-section">{section}</div>
            {items.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <button className={`admin-nav-item ${pathname === item.href ? "active" : ""}`}>
                  <span style={{ width: 16, textAlign: "center", fontSize: 14 }}>{item.icon}</span>
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        ))}
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="admin-nav-item" style={{ marginTop: 16, color: "rgba(255,255,255,.3)" }}>
            <span style={{ width: 16 }}>←</span> View Store
          </button>
        </Link>
      </nav>
    </div>
  );
}
