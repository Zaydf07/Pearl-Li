import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/account");

  return (
    <>
      <div style={{ paddingTop: 116, minHeight: "calc(100vh / var(--zoom, 1))", background: "linear-gradient(135deg, var(--off-white) 0%, var(--cream) 100%)", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
        <div style={{ width: "100%", maxWidth: 560, padding: "0 24px" }}>
          {/* Card Container */}
          <div style={{ background: "var(--white)", borderRadius: 8, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "40px 40px 32px", borderBottom: "1px solid var(--border)" }}>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, margin: "0 0 8px", color: "var(--black)" }}>
                Create an Account
              </h1>
              <p style={{ fontSize: 14, color: "var(--ink-faint)", margin: 0 }}>
                Join Pearl & Li for exclusive access to new collections and member benefits
              </p>
            </div>

            {/* Benefits */}
            <div style={{ padding: "32px 40px", background: "var(--off-white)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--black)", marginBottom: 4 }}>Early Access</div>
                  <div style={{ color: "var(--ink-faint)" }}>New collections and exclusive releases</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--black)", marginBottom: 4 }}>Order History</div>
                  <div style={{ color: "var(--ink-faint)" }}>Track orders and manage preferences</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--black)", marginBottom: 4 }}>Saved Addresses</div>
                  <div style={{ color: "var(--ink-faint)" }}>Faster checkout experience</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--black)", marginBottom: 4 }}>Wishlist</div>
                  <div style={{ color: "var(--ink-faint)" }}>Save and share your favorites</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: "40px" }}>
              <RegisterForm />

              {/* Divider */}
              <div style={{ textAlign: "center", margin: "24px 0", position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--border)" }} />
                <span style={{ position: "relative", background: "var(--white)", padding: "0 12px", fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".1em" }}>Already have an account?</span>
              </div>

              {/* Sign In Link */}
              <a href="/login" style={{ display: "block", width: "100%", padding: "13px", textAlign: "center", background: "transparent", border: "1.5px solid var(--border)", color: "var(--ink)", fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none", borderRadius: 4, transition: "all .2s", cursor: "pointer" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--off-white)"; (e.target as HTMLElement).style.borderColor = "var(--emerald)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.borderColor = "var(--border)"; }}>
                Sign In
              </a>
            </div>

            {/* Footer Text */}
            <div style={{ padding: "20px 40px", background: "var(--off-white)", fontSize: 11, color: "var(--ink-faint)", textAlign: "center", borderTop: "1px solid var(--border)" }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                By creating an account, you agree to our <a href="#" style={{ color: "var(--emerald)", textDecoration: "none" }}>Terms & Conditions</a>
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
