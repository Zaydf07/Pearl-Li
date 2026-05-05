"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COUNTRIES = ["Italy","United Kingdom","United States","France","Japan","Singapore","Hong Kong","UAE","Australia","Sri Lanka"];

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", country: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${form.firstName} ${form.lastName}`, email: form.email, password: form.password, phone: form.phone, country: form.country }),
    });
    setLoading(false);
    if (res.ok) router.push("/login?registered=1");
    else { const d = await res.json(); setError(d.error || "Registration failed"); }
  };

  return (
    <div className="auth-form-wrap">
      <button onClick={() => router.push("/")} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)", cursor: "pointer", marginBottom: 40 }}>← Back to Store</button>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 400, marginBottom: 6 }}>Create Account</h1>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: "var(--ink-muted)", marginBottom: 36 }}>Join Pearl & Li for exclusive access</p>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="auth-field"><label>First Name *</label><input type="text" placeholder="Jane" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required /></div>
          <div className="auth-field"><label>Last Name *</label><input type="text" placeholder="Li" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required /></div>
        </div>
        <div className="auth-field"><label>Email Address *</label><input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
        <div className="auth-field"><label>Phone Number</label><input type="tel" placeholder="+1 (000) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
        <div className="auth-field">
          <label>Country of Residence</label>
          <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} style={{ width: "100%", border: "1.5px solid var(--border)", padding: "14px 16px", fontSize: 13, background: "var(--off-white)", outline: "none", fontFamily: "'Montserrat',sans-serif" }}>
            <option value="">Select country…</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="auth-field"><label>Password *</label><input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} /></div>
        <div className="auth-field"><label>Confirm Password *</label><input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required /></div>
        {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button type="submit" className="btn-emerald" style={{ width: "100%", padding: 16, fontSize: 11, letterSpacing: ".18em", marginTop: 4 }} disabled={loading}>{loading ? "Creating…" : "Create Account ✦"}</button>
        <p style={{ fontSize: 10, color: "var(--ink-faint)", lineHeight: 1.6, marginTop: 16, textAlign: "center" }}>By creating an account you agree to our Privacy Policy and Terms & Conditions.</p>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--ink-muted)" }}>Already have an account? <Link href="/login" style={{ color: "var(--emerald)", textDecoration: "underline" }}>Sign in</Link></p>
      </form>
    </div>
  );
}
