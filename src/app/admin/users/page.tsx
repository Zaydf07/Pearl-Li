import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const MOCK = [
  { name: "Sophia Chen", email: "sophia@chen.sg", country: "🇸🇬 Singapore", orders: 3, total: "$12,400", joined: "Jan 2026" },
  { name: "Emma Williams", email: "emma@williams.co.uk", country: "🇬🇧 United Kingdom", orders: 5, total: "$28,600", joined: "Oct 2025" },
  { name: "Yuki Tanaka", email: "yuki@tanaka.jp", country: "🇯🇵 Japan", orders: 2, total: "$7,900", joined: "Feb 2026" },
  { name: "Marie Dupont", email: "marie@dupont.fr", country: "🇫🇷 France", orders: 4, total: "$18,200", joined: "Aug 2025" },
  { name: "Layla Al-Rashid", email: "layla@alrashid.ae", country: "🇦🇪 UAE", orders: 1, total: "$6,800", joined: "Apr 2026" },
];

export default async function AdminUsers() {
  const dbUsers = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { orders: true } }).catch(() => []);
  const users = dbUsers.length > 0
    ? dbUsers.map(u => ({ name: u.name || "—", email: u.email, country: u.country || "—", orders: u.orders.length, total: `$${u.orders.reduce((s: number, o: any) => s + o.total, 0).toLocaleString()}`, joined: new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) }))
    : MOCK;

  return (
    <>
      <div className="admin-topbar"><h2>Customers</h2></div>
      <div className="admin-content">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <input placeholder="Search customers…" style={{ flex: 1, border: "1.5px solid var(--border)", padding: "10px 14px", fontSize: 12, background: "var(--white)", outline: "none" }} />
          <select style={{ border: "1.5px solid var(--border)", padding: "10px 14px", fontSize: 12, background: "var(--white)", outline: "none" }}><option>All Regions</option><option>Europe</option><option>Asia Pacific</option><option>Middle East</option></select>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>Orders</th><th>Lifetime Value</th><th>Member Since</th><th>Action</th></tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ color: "var(--ink-muted)", fontSize: 11 }}>{u.email}</td>
                  <td>{u.country}</td>
                  <td style={{ textAlign: "center" }}>{u.orders}</td>
                  <td style={{ fontFamily: "'Playfair Display',serif" }}><strong>{u.total}</strong></td>
                  <td style={{ color: "var(--ink-faint)" }}>{u.joined}</td>
                  <td><button style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--emerald)", cursor: "pointer" }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
