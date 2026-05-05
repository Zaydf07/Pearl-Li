import ConsultForm from "@/components/ConsultForm";
import Footer from "@/components/Footer";

export default function ConsultationPage() {
  return (
    <>
      <div style={{ paddingTop: 116, background: "var(--white)" }}>
        <div className="shop-hero" style={{ padding: "80px 0 60px" }}>
          <span className="eyebrow">Private Service</span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 400 }}>
            Book a <em style={{ fontStyle: "italic", color: "var(--emerald-mid)" }}>Consultation</em>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "rgba(255,255,255,.5)", maxWidth: 500, margin: "10px auto" }}>
            Share your vision — our advisors will guide you to the perfect creation
          </p>
        </div>
        <div className="consult-inner">
          <div className="consult-left">
            <span className="eyebrow">What to Expect</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, lineHeight: 1.2, color: "var(--black)", marginBottom: 14 }}>
              Your journey <em className="t-italic">begins here</em>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: 28 }}>
              Whether searching for a bespoke engagement ring, a custom commission, or expert guidance — our team is here for you.
            </p>
            {[
              { title: "Response in 24 hours", desc: "Our team confirms your appointment and gathers further details" },
              { title: "In-Store or Virtual", desc: "Available at our atelier or via private video appointment" },
              { title: "Share References", desc: "Upload inspiration images, sketches, or reference pieces" },
              { title: "Completely Confidential", desc: "Your details and creative vision handled with absolute discretion" },
            ].map(f => (
              <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 6, height: 6, background: "var(--emerald)", borderRadius: "50%", marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--black)", marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="consult-right">
            <ConsultForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
