import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">Pearl <span>&</span> Li</div>
            <p className="footer-tagline">Fine jewellery and luxury goods — where Italian goldsmithing meets Eastern pearl cultivation. Est. 2019.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop" style={{ color: "inherit", textDecoration: "none" }}>All Collections</Link></li>
              <li><Link href="/collections" style={{ color: "inherit", textDecoration: "none" }}>Collections</Link></li>
              <li><Link href="/specials" style={{ color: "inherit", textDecoration: "none" }}>Specials & Sale</Link></li>
              <li><Link href="/shop?filter=new" style={{ color: "inherit", textDecoration: "none" }}>New Arrivals</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link href="/consultation" style={{ color: "inherit", textDecoration: "none" }}>Book a Consultation</Link></li>
              <li><span>Bespoke Commission</span></li>
              <li><span>Jewellery Care</span></li>
              <li><span>Gift Engraving</span></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Information</h4>
            <ul>
              <li><span>Shipping & Returns</span></li>
              <li><span>Privacy Policy</span></li>
              <li><span>Terms & Conditions</span></li>
              <li><span>Contact Us</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Pearl & Li. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Instagram", "Pinterest", "WeChat"].map(s => (
              <span key={s} style={{ fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.3)", cursor: "pointer" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
