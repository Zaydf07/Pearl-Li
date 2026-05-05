"use client";
import { useState, useRef } from "react";

interface ConsultFormProps {
  dark?: boolean;
}

export default function ConsultForm({ dark = true }: ConsultFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", type: "", message: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles).filter(f => f.type.startsWith("image/")).slice(0, 5 - files.length);
    setFiles(prev => [...prev, ...arr].slice(0, 5));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append("images", f));
      await fetch("/api/inquiries", { method: "POST", body: fd });
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "var(--white)" }}>
      <span style={{ fontSize: 44, color: "var(--emerald-mid)", display: "block", marginBottom: 14 }}>✦</span>
      <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, marginBottom: 8 }}>Consultation Requested</h4>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "rgba(255,255,255,.5)" }}>Our team will contact you within 24 hours to confirm your appointment.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <h3>Request a Consultation</h3>
      <p className="sub">Share your details — we&apos;ll be in touch within 24 hours.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
        <div className="fg">
          <label>First Name *</label>
          <input type="text" placeholder="Jane" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
        </div>
        <div className="fg">
          <label>Last Name *</label>
          <input type="text" placeholder="Li" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required />
        </div>
      </div>
      <div className="fg">
        <label>Email Address *</label>
        <input type="email" placeholder="jane@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      </div>
      <div className="fg">
        <label>Phone Number</label>
        <input type="tel" placeholder="+1 (000) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="fg">
        <label>Consultation Type</label>
        <select
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          style={{ color: "#1a1a1a", background: "#ffffff", border: "1px solid rgba(255,255,255,.15)", padding: "12px 14px", width: "100%", fontSize: 12.5, outline: "none", fontFamily: "inherit" }}
        >
          <option value="">— Select a type —</option>
          <option value="Engagement Ring">Engagement Ring</option>
          <option value="Bespoke Commission">Bespoke Commission</option>
          <option value="Collection Viewing">Collection Viewing</option>
          <option value="Investment Advice">Investment Advice</option>
          <option value="Gift Recommendation">Gift Recommendation</option>
        </select>
      </div>
      <div className="fg">
        <label>Your Vision / Message</label>
        <textarea placeholder="Tell us about the piece you have in mind…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
      </div>
      <div className="fg">
        <label>Reference Images (optional · max 5)</label>
        <div
          className="upload-box"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
          <div style={{ fontSize: 26, opacity: .28, marginBottom: 6 }}>⊕</div>
          <div>
            <strong style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--emerald-mid)", display: "block", marginBottom: 3 }}>Upload Images</strong>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,.3)" }}>Drag & drop or click · JPG, PNG, WEBP</span>
          </div>
          {files.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, justifyContent: "center" }}>
              {files.map((f, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={URL.createObjectURL(f)} style={{ width: 52, height: 52, objectFit: "cover", border: "1px solid rgba(255,255,255,.1)" }} alt="preview" />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter((_, j) => j !== i)); }}
                    style={{ position: "absolute", top: -5, right: -5, background: "var(--red)", color: "white", border: "none", borderRadius: "50%", width: 15, height: 15, fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,.28)", marginTop: 6, letterSpacing: ".04em" }}>Images are kept confidential and used only by our advisors.</p>
      </div>
      <button type="submit" className="btn-emerald" style={{ width: "100%", padding: 16 }} disabled={loading}>
        {loading ? "Sending…" : "Submit Inquiry ✦"}
      </button>
    </form>
  );
}
