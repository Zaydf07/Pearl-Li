"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password");
    else router.push("/account");
  };

  return (
    <div className="auth-form-wrap">
      <button className="auth-back" onClick={() => router.push("/")} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)", cursor: "pointer", marginBottom: 40, display: "flex", alignItems: "center", gap: 8 }}>← Back to Store</button>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 400, color: "var(--black)", marginBottom: 6 }}>Welcome Back</h1>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: "var(--ink-muted)", marginBottom: 36 }}>Sign in to your Pearl & Li account</p>
      <form onSubmit={handleSubmit}>
        <div className="auth-field"><label>Email Address</label><input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
        <div className="auth-field"><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required /></div>
        {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button type="submit" className="btn-black" style={{ width: "100%", padding: 16, fontSize: 11, letterSpacing: ".18em" }} disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
      </form>
      <div style={{ textAlign: "center", margin: "20px 0", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--border)" }} />
        <span style={{ position: "relative", background: "var(--white)", padding: "0 12px", fontSize: 11, color: "var(--ink-faint)" }}>or</span>
      </div>
      <Link href="/register"><button className="btn-outline-dark" style={{ width: "100%", padding: 13 }}>Create Account</button></Link>
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--ink-muted)" }}>New to Pearl & Li? <Link href="/register" style={{ color: "var(--emerald)", textDecoration: "underline" }}>Create an account</Link></p>
      <div style={{ marginTop: 20, textAlign: "center", padding: 14, background: "var(--off-white)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>Store Owner?</div>
        <Link href="/admin"><button style={{ background: "var(--emerald)", color: "white", border: "none", padding: "10px 24px", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", cursor: "pointer", fontWeight: 600 }}>Go to Admin Dashboard →</button></Link>
      </div>
    </div>
  );
}
