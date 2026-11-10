import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/account");

  return (
    <>
      <div style={{ paddingTop: 116, minHeight: "calc(100vh / var(--zoom, 1))", background: "linear-gradient(135deg, var(--off-white) 0%, var(--cream) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 520, padding: "0 24px" }}>
          {/* Card Container */}
          <div style={{ background: "var(--white)", borderRadius: 8, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "40px 40px 32px", borderBottom: "1px solid var(--border)" }}>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, margin: "0 0 8px", color: "var(--black)" }}>
                Welcome Back
              </h1>
              <p style={{ fontSize: 14, color: "var(--ink-faint)", margin: 0 }}>
                Sign in to your Pearl & Li account
              </p>
            </div>

            {/* Form */}
            <div style={{ padding: "40px" }}>
              <LoginForm />

              {/* Divider */}
              <div style={{ textAlign: "center", margin: "24px 0", position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--border)" }} />
                <span style={{ position: "relative", background: "var(--white)", padding: "0 12px", fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".1em" }}>New Customer?</span>
              </div>

              {/* Register Link */}
              <a href="/register" style={{ display: "block", width: "100%", padding: "13px", textAlign: "center", background: "transparent", border: "1.5px solid var(--border)", color: "var(--ink)", fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none", borderRadius: 4, transition: "all .2s", cursor: "pointer" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--off-white)"; (e.target as HTMLElement).style.borderColor = "var(--emerald)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.borderColor = "var(--border)"; }}>
                Create an Account
              </a>
            </div>

            {/* Footer Text */}
            <div style={{ padding: "20px 40px", background: "var(--off-white)", fontSize: 11, color: "var(--ink-faint)", textAlign: "center", borderTop: "1px solid var(--border)" }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Need help? <a href="/consultation" style={{ color: "var(--emerald)", textDecoration: "none" }}>Request a consultation</a>
              </p>
            </div>
          </div>

          {/* Close Link */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <a href="/" style={{ color: "var(--ink-faint)", textDecoration: "none", fontSize: 11, letterSpacing: ".1em", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
              ← Back to Store
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
