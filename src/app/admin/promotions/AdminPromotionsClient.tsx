"use client";
import React, { useState } from "react";

interface Promotion {
  id: string;
  name: string;
  type: string;
  discount: number | null;
  collections: string | null;
  code: string | null;
  endsAt: string | null;
  status: string;
  image: string | null;
  description: string | null;
  badge: string | null;
  sortOrder: number;
  isMock?: boolean;
}

const TYPES = ["percentage", "free_shipping", "fixed"];
const TYPE_LABEL: Record<string, string> = { percentage: "Percentage Off", free_shipping: "Free Shipping", fixed: "Fixed Amount Off" };
const STATUS_OPTIONS = ["active", "draft", "expired"];

const EMPTY = { name: "", type: "percentage", discount: "", collections: "", code: "", endsAt: "", status: "active", image: "", description: "", badge: "", sortOrder: "0" };

export default function AdminPromotionsClient({ promotions: initial }: { promotions: Promotion[] }) {
  const [promotions, setPromotions] = useState(initial);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState<Promotion | null>(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState("");

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { url } = await res.json();
    return url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) setForm(p => ({ ...p, image: url }));
    setUploading(false);
    e.target.value = "";
  };

  const LBL: React.CSSProperties = { display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase" as const, color: "var(--ink-muted)", marginBottom: 6 };
  const HINT: React.CSSProperties = { fontSize: 10, color: "var(--ink-faint)", marginBottom: 6 };
  const INP: React.CSSProperties = { width: "100%", border: "1.5px solid var(--border)", padding: "10px 12px", fontSize: 13, outline: "none", background: "var(--white)", color: "var(--ink)" };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(""); setModal(true); };
  const openEdit = (p: Promotion) => {
    setEditing(p);
    setForm({
      name: p.name, type: p.type,
      discount:    p.discount    != null ? String(p.discount)    : "",
      collections: p.collections ?? "",
      code:        p.code        ?? "",
      endsAt:      p.endsAt      ? p.endsAt.slice(0, 10) : "",
      status:      p.status,
      image:       p.image       ?? "",
      description: p.description ?? "",
      badge:       p.badge       ?? "",
      sortOrder:   String(p.sortOrder ?? 0),
    });
    setError(""); setModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true); setError("");
    const payload = {
      ...form,
      discount:    form.discount    ? parseFloat(form.discount)    : null,
      collections: form.collections || null,
      code:        form.code        || null,
      endsAt:      form.endsAt      || null,
      image:       form.image       || null,
      description: form.description || null,
      badge:       form.badge       || null,
      sortOrder:   parseInt(form.sortOrder) || 0,
    };
    const res = editing
      ? await fetch(`/api/admin/promotions/${editing.id}`, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/admin/promotions",               { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      const saved = await res.json();
      if (editing) setPromotions(prev => prev.map(p => p.id === editing.id ? saved : p));
      else         setPromotions(prev => [saved, ...prev]);
      setModal(false);
    } else {
      const d = await res.json(); setError(d.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promotion?")) return;
    setDeleting(id);
    await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
    setPromotions(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const formatDiscount = (p: Promotion) => {
    if (p.type === "free_shipping") return "Free Shipping";
    if (p.type === "percentage")    return p.discount != null ? `${p.discount}% off` : "—";
    if (p.type === "fixed")         return p.discount != null ? `$${p.discount} off` : "—";
    return "—";
  };

  const statusStyle = (s: string) => ({
    padding: "3px 10px", fontSize: 8, letterSpacing: ".12em", textTransform: "uppercase" as const, fontWeight: 600,
    background: s === "active" ? "#e8f5ef" : s === "draft" ? "#fef9e8" : "var(--off-white)",
    color:      s === "active" ? "var(--emerald-dark)" : s === "draft" ? "#7a6010" : "var(--ink-faint)",
  });

  const realPromos = promotions.filter(p => !p.isMock);
  const mockPromos = promotions.filter(p => p.isMock);

  return (
    <>
      <div className="admin-topbar"><h2>Promotions</h2></div>
      <div className="admin-content">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "var(--ink-muted)", margin: 0 }}>
            Create promotions with images and descriptions — they appear as posts on the Specials page below the hero banner.
          </p>
          <button className="btn-emerald" style={{ padding: "10px 20px", whiteSpace: "nowrap" }} onClick={openAdd}>+ New Promotion</button>
        </div>

        {/* Real promotions — card layout showing image previews */}
        {realPromos.length === 0 ? (
          <div style={{ background: "var(--off-white)", border: "1.5px dashed var(--border)", padding: 32, textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>No promotions yet</div>
            <button className="btn-emerald" style={{ padding: "10px 24px" }} onClick={openAdd}>Create your first promotion</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 16 }}>Your Promotions</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
              {realPromos.map(p => (
                <div key={p.id} style={{ background: "var(--white)", border: "1.5px solid var(--border)", overflow: "hidden" }}>
                  {/* Image preview */}
                  <div style={{ height: 160, background: p.image ? undefined : "var(--cream)", backgroundImage: p.image ? `url(${p.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                    {!p.image && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--ink-faint)", letterSpacing: ".1em" }}>No image</div>}
                    {p.badge && <div style={{ position: "absolute", top: 10, left: 10, background: "var(--emerald)", color: "white", fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 700, padding: "4px 10px" }}>{p.badge}</div>}
                    <span style={{ position: "absolute", top: 10, right: 10, ...statusStyle(p.status) }}>{p.status}</span>
                  </div>
                  {/* Info */}
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, marginBottom: 4 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 8, lineHeight: 1.5 }}>{p.description}</div>}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, background: "var(--off-white)", padding: "3px 8px", color: "var(--red)", fontWeight: 600 }}>{formatDiscount(p)}</span>
                      {p.code && <span style={{ fontSize: 10, background: "var(--off-white)", padding: "3px 8px", fontFamily: "monospace" }}>{p.code}</span>}
                      {p.endsAt && <span style={{ fontSize: 10, background: "var(--off-white)", padding: "3px 8px", color: "var(--ink-faint)" }}>Ends {new Date(p.endsAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ flex: 1, background: "none", border: "1.5px solid var(--border)", padding: "8px", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--emerald)", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ flex: 1, background: "none", border: "1.5px solid var(--border)", padding: "8px", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--red)", cursor: "pointer" }}>
                        {deleting === p.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mock examples */}
        {mockPromos.length > 0 && (
          <>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Example Promotions</div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Type</th><th>Discount</th><th>Code</th><th>Ends</th><th>Status</th></tr></thead>
                <tbody>
                  {mockPromos.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td style={{ fontSize: 11 }}>{TYPE_LABEL[p.type] || p.type}</td>
                      <td style={{ color: "var(--red)", fontWeight: 600 }}>{formatDiscount(p)}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{p.code || "—"}</td>
                      <td style={{ fontSize: 11, color: "var(--ink-faint)" }}>{p.endsAt ? new Date(p.endsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                      <td><span style={statusStyle(p.status)}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 3000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 20px" }}
          onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{ background: "var(--white)", width: "100%", maxWidth: 680, padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 400 }}>{editing ? "Edit Promotion" : "New Promotion"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-faint)" }}>×</button>
            </div>

            {/* Section: Promo Post */}
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 14, paddingBottom: 8, borderBottom: "1.5px solid var(--border)" }}>
              Promo Post — Appears on Specials Page
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", marginBottom: 8 }}>
              <div style={{ gridColumn: "1/-1", marginBottom: 14 }}>
                <label style={LBL}>Promotion Title</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. The Summer Gala Sale" style={INP} />
              </div>

              {/* Banner image */}
              <div style={{ gridColumn: "1/-1", marginBottom: 14 }}>
                <label style={LBL}>Banner Image</label>

                {/* Size guidance */}
                <div style={{ background: "var(--off-white)", border: "1px solid var(--border)", padding: "10px 14px", marginBottom: 10, fontSize: 11, lineHeight: 1.7, color: "var(--ink-muted)" }}>
                  <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>📐 Recommended banner specs</strong>
                  <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Ratio: 16:7 (wide landscape)</span> — matches the promo card frame exactly<br />
                  <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Min size: 1200 × 525 px</span> — sharp on all screens<br />
                  <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Format: JPG or WebP</span> · Max 10 MB<br />
                  <span style={{ color: "var(--ink-faint)", fontSize: 10 }}>Tip: use a wide jewellery lifestyle shot — the title overlays the bottom of the image</span>
                </div>

                {/* Live preview at correct 16:7 ratio */}
                {form.image ? (
                  <div style={{ position: "relative", marginBottom: 10 }}>
                    <div style={{ aspectRatio: "16/7", overflow: "hidden", border: "1.5px solid var(--border)", background: "var(--cream)", position: "relative" }}>
                      <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => (e.currentTarget.style.display = "none")} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.55))" }} />
                      <div style={{ position: "absolute", bottom: 12, left: 14, fontSize: 13, color: "white", fontFamily: "'Playfair Display',serif" }}>{form.name || "Promotion Title"}</div>
                    </div>
                    <div style={{ fontSize: 9, color: "var(--ink-faint)", marginTop: 4, letterSpacing: ".1em", textTransform: "uppercase" }}>Live preview — 16:7 frame</div>
                    <button onClick={() => setForm(p => ({ ...p, image: "" }))}
                      style={{ position: "absolute", top: 6, right: 6, background: "var(--red)", color: "white", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ) : (
                  <label style={{ display: "block", cursor: "pointer", marginBottom: 8 }}>
                    <div style={{ aspectRatio: "16/7", border: "1.5px dashed var(--border)", background: "var(--off-white)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      {uploading ? (
                        <span style={{ fontSize: 12, color: "var(--emerald)" }}>Uploading…</span>
                      ) : (
                        <>
                          <div style={{ fontSize: 24 }}>🖼</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-muted)" }}>Click to upload banner image</div>
                          <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>16:7 ratio · 1200 × 525 px · JPG or WebP</div>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                  </label>
                )}

                {/* Also allow URL paste */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                    placeholder="Or paste an image URL…" style={{ ...INP, flex: 1, fontSize: 12 }} />
                  {!form.image && (
                    <label style={{ flexShrink: 0, cursor: "pointer" }}>
                      <span className="btn-outline-e" style={{ padding: "10px 14px", fontSize: 9, whiteSpace: "nowrap", display: "inline-block" }}>
                        {uploading ? "…" : "Upload"}
                      </span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>

              <div style={{ gridColumn: "1/-1", marginBottom: 14 }}>
                <label style={LBL}>Description</label>
                <div style={HINT}>Short text shown on the post card under the title</div>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="e.g. Exclusive savings across our Celestial and Jadore collections…" style={{ ...INP, resize: "vertical", fontFamily: "inherit" }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Badge Label (optional)</label>
                <div style={HINT}>Small tag on the image e.g. "New", "Limited"</div>
                <input value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} placeholder="e.g. Limited Time" style={INP} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Sort Order</label>
                <div style={HINT}>Lower number = shown first</div>
                <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} style={INP} />
              </div>
            </div>

            {/* Section: Discount */}
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 14, paddingBottom: 8, borderBottom: "1.5px solid var(--border)" }}>
              Discount Settings
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Discount Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={INP}>
                  {TYPES.map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                </select>
              </div>

              {form.type !== "free_shipping" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={LBL}>{form.type === "percentage" ? "Discount %" : "Discount Amount ($)"}</label>
                  <input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
                    placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 100"} style={INP} />
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Applies To (Collections)</label>
                <div style={HINT}>Leave blank for all products</div>
                <input value={form.collections} onChange={e => setForm(p => ({ ...p, collections: e.target.value }))} placeholder="e.g. Celestial, Jadore" style={INP} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Promo Code (optional)</label>
                <div style={HINT}>Customers enter this at checkout</div>
                <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SUMMER20" style={INP} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>End Date (optional)</label>
                <input type="date" value={form.endsAt} onChange={e => setForm(p => ({ ...p, endsAt: e.target.value }))} style={INP} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={INP}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>

            {error && <p style={{ color: "var(--red)", fontSize: 12, margin: "0 0 16px" }}>{error}</p>}

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setModal(false)} className="btn-outline-dark" style={{ padding: "12px 24px" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-emerald" style={{ padding: "12px 32px" }}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
