"use client";
import React, { useEffect, useState } from "react";

interface SizeVariant  { size: string;  price: number | null; }
interface ColorVariant { name: string;  hex: string; price: number | null; }

interface Product {
  id: string; name: string; slug: string; collection: string; price: number;
  type: string; subCategory: string | null; description: string;
  material: string; gemstone: string; origin: string;
  image: string | null; images: string | null;
  sizes: string | null; colors: string | null;
  isNew: boolean; isSale: boolean; stock: number;
}

interface Category { id: string; name: string; slug: string; parentType: string; }

const EMPTY = {
  name: "", collection: "", price: 0, type: "Jewellery", subCategory: "" as string,
  description: "", material: "", gemstone: "", origin: "",
  image: null as string | null, isNew: false, isSale: false, stock: 10,
};

function parseSizes(s: string | null): SizeVariant[] {
  try {
    const d = s ? JSON.parse(s) : [];
    return d.map((v: unknown) => typeof v === "string" ? { size: v, price: null } : v as SizeVariant);
  } catch { return []; }
}
function parseColors(s: string | null): ColorVariant[] {
  try { return s ? JSON.parse(s) : []; } catch { return []; }
}
function parseImages(s: string | null): string[] {
  try { return s ? JSON.parse(s) : []; } catch { return []; }
}

export default function AdminProductsClient({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  const [form,        setForm]        = useState(EMPTY);
  const [sizes,       setSizes]       = useState<SizeVariant[]>([]);
  const [colors,      setColors]      = useState<ColorVariant[]>([]);
  const [extraImages, setExtraImages] = useState<string[]>([]);

  // Size add state
  const [sizeInput, setSizeInput] = useState(""); const [sizePrice, setSizePrice] = useState("");
  // Color add state
  const [colorName, setColorName] = useState(""); const [colorHex,  setColorHex]  = useState("#D4A96A"); const [colorPrice,setColorPrice]= useState("");
  // Image add state
  const [imgInput,  setImgInput]  = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { url } = await res.json();
    return url;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) setForm(p => ({ ...p, image: url }));
    setUploading(false);
    e.target.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(uploadFile));
    setExtraImages(prev => [...prev, ...(urls.filter(Boolean) as string[])]);
    setUploading(false);
    e.target.value = "";
  };

  const openAdd = () => {
    setEditing(null); setForm(EMPTY);
    setSizes([]); setColors([]); setExtraImages([]);
    setSizeInput(""); setSizePrice(""); setColorName(""); setColorHex("#D4A96A"); setColorPrice(""); setImgInput("");
    setModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, collection: p.collection, price: p.price, type: p.type, subCategory: p.subCategory ?? "",
      description: p.description, material: p.material, gemstone: p.gemstone, origin: p.origin,
      image: p.image, isNew: p.isNew, isSale: p.isSale, stock: p.stock });
    setSizes(parseSizes(p.sizes)); setColors(parseColors(p.colors)); setExtraImages(parseImages(p.images));
    setSizeInput(""); setSizePrice(""); setColorName(""); setColorHex("#D4A96A"); setColorPrice(""); setImgInput("");
    setModal(true);
  };

  const addSize = () => {
    const v = sizeInput.trim(); if (!v) return;
    const price = sizePrice ? parseFloat(sizePrice) : null;
    setSizes(prev => prev.find(s => s.size === v) ? prev : [...prev, { size: v, price }]);
    setSizeInput(""); setSizePrice("");
  };

  const addColor = () => {
    if (!colorName.trim()) return;
    const price = colorPrice ? parseFloat(colorPrice) : null;
    setColors(prev => [...prev, { name: colorName.trim(), hex: colorHex, price }]);
    setColorName(""); setColorHex("#D4A96A"); setColorPrice("");
  };

  const addImage = () => {
    const v = imgInput.trim(); if (!v) return;
    setExtraImages(prev => [...prev, v]); setImgInput("");
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      sizes:  sizes.length        ? JSON.stringify(sizes)        : null,
      colors: colors.length       ? JSON.stringify(colors)       : null,
      images: extraImages.length  ? JSON.stringify(extraImages)  : null,
    };
    try {
      const res = editing
        ? await fetch(`/api/admin/products/${editing.id}`, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/products",                { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setModal(false); window.location.reload(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this product? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const existingCollections = Array.from(new Set(products.map(p => p.collection).filter(Boolean)));

  const LBL: React.CSSProperties = { display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase" as const, color: "var(--ink-muted)", marginBottom: 7 };
  const INP: React.CSSProperties = { width: "100%", border: "1.5px solid var(--border)", padding: "10px 12px", fontSize: 13, outline: "none", background: "var(--white)", color: "var(--ink)" };

  const inp = (label: string, key: keyof typeof EMPTY, type = "text", hint?: string) => (
    <div style={{ marginBottom: 14 }}>
      <label style={LBL}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5 }}>{hint}</div>}
      <input type={type} value={String(form[key] ?? "")}
        onChange={e => setForm(p => ({ ...p, [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
        style={INP} />
    </div>
  );

  return (
    <>
      <div className="admin-topbar"><h2>Products</h2></div>
      <div className="admin-content">
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          <input placeholder="Search products…" style={{ flex: 1, border: "1.5px solid var(--border)", padding: "10px 14px", fontSize: 12, background: "var(--white)", outline: "none" }} />
          <button className="btn-emerald" style={{ padding: "10px 20px", whiteSpace: "nowrap" }} onClick={openAdd}>+ Add Product</button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Collection</th><th>Category</th><th>Price</th><th>Sizes</th><th>Colours</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, backgroundImage: p.image ? `url(${p.image})` : undefined, backgroundSize: "cover", background: p.image ? undefined : "var(--cream)", flexShrink: 0 }} />
                    <div><strong>{p.name}</strong><div style={{ fontSize: 10, color: "var(--ink-faint)" }}>{p.subCategory || p.type}</div></div>
                  </td>
                  <td style={{ color: "var(--emerald)" }}>{p.collection}</td>
                  <td style={{ color: "var(--ink-muted)", fontSize: 11 }}>{p.subCategory || p.type}</td>
                  <td style={{ fontFamily: "'Playfair Display',serif" }}><strong>${p.price.toLocaleString()}</strong></td>
                  <td style={{ fontSize: 11 }}>{parseSizes(p.sizes).map(s => s.size).join(", ") || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      {parseColors(p.colors).slice(0,5).map(c => (
                        <div key={c.name} title={c.name} style={{ width: 14, height: 14, borderRadius: "50%", background: c.hex, border: "1px solid var(--border)" }} />
                      ))}
                      {!parseColors(p.colors).length && <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>—</span>}
                    </div>
                  </td>
                  <td>{p.stock}</td>
                  <td>
                    {p.isNew  && <span className="order-status os-processing" style={{ marginRight: 4 }}>New</span>}
                    {p.isSale && <span className="order-status os-pending">Sale</span>}
                  </td>
                  <td>
                    <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--emerald)", cursor: "pointer", marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--red)", cursor: "pointer" }}>
                      {deleting === p.id ? "…" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 3000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 20px" }} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{ background: "var(--white)", width: "100%", maxWidth: 800, padding: 40 }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400 }}>{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-faint)" }}>×</button>
            </div>

            {/* Basic fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              {inp("Product Name", "name")}

              {/* Collection — datalist lets admin pick existing or type a new one */}
              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Collection</label>
                <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5 }}>Pick existing or type a new collection name — it will appear on the Collections page automatically</div>
                <input
                  list="collection-list"
                  value={form.collection}
                  onChange={e => setForm(p => ({ ...p, collection: e.target.value }))}
                  placeholder="e.g. Celestial, Serpentine…"
                  style={INP}
                />
                <datalist id="collection-list">
                  {existingCollections.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              {inp("Base Price ($)", "price", "number")}

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Type</label>
                <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5 }}>The broad product type</div>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={INP}>
                  <option>Jewellery</option><option>Watches</option><option>Accessories</option>
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Sub-Category</label>
                <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5 }}>The specific category — appears in the Shop navigation</div>
                <select value={form.subCategory} onChange={e => setForm(p => ({ ...p, subCategory: e.target.value }))} style={INP}>
                  <option value="">— Select —</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name} ({c.parentType})</option>)}
                </select>
              </div>

              {inp("Material", "material", "text")}
              {inp("Gemstone", "gemstone", "text")}
              {inp("Origin",   "origin",   "text")}
              {inp("Stock Quantity", "stock", "number")}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={LBL}>Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                style={{ ...INP, resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={LBL}>Main Image</label>
              <div style={{ background: "var(--off-white)", border: "1px solid var(--border)", padding: "10px 14px", marginBottom: 10, fontSize: 11, lineHeight: 1.7, color: "var(--ink-muted)" }}>
                <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>📐 Recommended image specs</strong>
                <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Ratio: 1:1 (square)</span> — works perfectly on all pages<br />
                <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Min size: 800 × 800 px</span> — ensures sharp display on all screens<br />
                <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Format: JPG or WebP</span> — smaller file size, faster loading<br />
                <span style={{ color: "var(--ink-faint)", fontSize: 10 }}>The product detail page crops to 4:5 portrait · Shop cards crop to 4:3 landscape · Square handles both perfectly</span>
              </div>

              {/* Preview */}
              {form.image && (
                <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
                  <img src={form.image} alt="Main" style={{ width: 120, height: 120, objectFit: "cover", border: "1.5px solid var(--border)", display: "block" }} />
                  <button onClick={() => setForm(p => ({ ...p, image: null }))}
                    style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "var(--red)", color: "white", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={form.image ?? ""} onChange={e => setForm(p => ({ ...p, image: e.target.value || null }))}
                  style={{ ...INP, flex: 1 }} placeholder="https://... or upload below" />
                <label style={{ flexShrink: 0, cursor: "pointer" }}>
                  <span className="btn-outline-e" style={{ padding: "10px 16px", fontSize: 9, whiteSpace: "nowrap", display: "inline-block" }}>
                    {uploading ? "Uploading…" : "Upload File"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleMainImageUpload} style={{ display: "none" }} disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Flags */}
            <div style={{ background: "var(--off-white)", border: "1.5px solid var(--border)", padding: 16, marginBottom: 20, display: "flex", gap: 32 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isNew} onChange={e => setForm(p => ({ ...p, isNew: e.target.checked }))} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Mark as New Arrival</div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>Shows a "New" badge and appears in New Arrivals filter</div>
                </div>
              </label>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isSale} onChange={e => setForm(p => ({ ...p, isSale: e.target.checked }))} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Mark as Special / On Sale</div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>Shows on the Specials page with a Sale badge</div>
                </div>
              </label>
            </div>

            {/* ── SIZES ── */}
            <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Sizes &amp; Prices</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {sizes.map(s => (
                  <div key={s.size} style={{ border: "1px solid var(--border)", padding: "6px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 8, background: "var(--off-white)" }}>
                    <strong>{s.size}</strong>
                    {s.price != null && <span style={{ color: "var(--emerald)", fontSize: 11 }}>${s.price.toLocaleString()}</span>}
                    <button onClick={() => setSizes(prev => prev.filter(x => x.size !== s.size))} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSize()} placeholder="Size (e.g. 6)" style={{ border: "1.5px solid var(--border)", padding: "8px 12px", fontSize: 12, outline: "none", width: 110 }} />
                <input value={sizePrice} onChange={e => setSizePrice(e.target.value)} placeholder="Price override (optional)" type="number" style={{ border: "1.5px solid var(--border)", padding: "8px 12px", fontSize: 12, outline: "none", width: 180 }} />
                <button onClick={addSize} className="btn-outline-e" style={{ padding: "8px 16px", fontSize: 9, whiteSpace: "nowrap" }}>Add Size</button>
              </div>
            </div>

            {/* ── COLOURS ── */}
            <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Colours &amp; Prices</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {colors.map(c => (
                  <div key={c.name} style={{ border: "1px solid var(--border)", padding: "6px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 8, background: "var(--off-white)" }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: c.hex, border: "1px solid var(--border)", flexShrink: 0 }} />
                    <strong>{c.name}</strong>
                    {c.price != null && <span style={{ color: "var(--emerald)", fontSize: 11 }}>${c.price.toLocaleString()}</span>}
                    <button onClick={() => setColors(prev => prev.filter(x => x.name !== c.name))} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={colorName} onChange={e => setColorName(e.target.value)} placeholder="Colour name" style={{ border: "1.5px solid var(--border)", padding: "8px 12px", fontSize: 12, outline: "none", flex: 1 }} />
                <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} style={{ width: 40, height: 36, border: "1.5px solid var(--border)", padding: 2, cursor: "pointer" }} />
                <input value={colorPrice} onChange={e => setColorPrice(e.target.value)} placeholder="Price override (optional)" type="number" style={{ border: "1.5px solid var(--border)", padding: "8px 12px", fontSize: 12, outline: "none", width: 180 }} />
                <button onClick={addColor} className="btn-outline-e" style={{ padding: "8px 16px", fontSize: 9, whiteSpace: "nowrap" }}>Add Colour</button>
              </div>
            </div>

            {/* ── GALLERY IMAGES ── */}
            <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 20, marginBottom: 32 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>Gallery Images</div>
              <div style={{ background: "var(--off-white)", border: "1px solid var(--border)", padding: "10px 14px", marginBottom: 14, fontSize: 11, lineHeight: 1.7, color: "var(--ink-muted)" }}>
                <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>📐 Gallery image specs</strong>
                <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Ratio: 1:1 (square)</span> — consistent thumbnails and full view<br />
                <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Min size: 800 × 800 px</span> · <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Max: 10 MB per image</span><br />
                <span style={{ color: "var(--ink-faint)", fontSize: 10 }}>Tip: photograph on a clean white or cream background · shoot front, back, side, detail close-up · 4–6 images is ideal</span>
              </div>

              {/* Existing gallery thumbnails */}
              {extraImages.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {extraImages.map((url, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={url} alt={`Gallery ${i + 1}`} style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid var(--border)", display: "block" }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.45)", fontSize: 8, color: "white", textAlign: "center", padding: "2px 0" }}>
                        Image {i + 1}
                      </div>
                      <button onClick={() => setExtraImages(prev => prev.filter((_, j) => j !== i))}
                        style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "var(--red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload multiple files at once */}
              <label style={{ display: "block", cursor: "pointer", marginBottom: 10 }}>
                <div style={{ border: "1.5px dashed var(--border)", padding: "20px", textAlign: "center", background: "var(--off-white)", transition: "all .2s" }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={async e => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                    if (!files.length) return;
                    setUploading(true);
                    const urls = await Promise.all(files.map(uploadFile));
                    setExtraImages(prev => [...prev, ...(urls.filter(Boolean) as string[])]);
                    setUploading(false);
                  }}>
                  {uploading ? (
                    <span style={{ fontSize: 12, color: "var(--emerald)" }}>Uploading…</span>
                  ) : (
                    <>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>📷</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 3 }}>
                        Click to upload or drag &amp; drop
                      </div>
                      <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>
                        Select multiple images at once — JPG, PNG, WebP · Max 10MB each
                      </div>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: "none" }} disabled={uploading} />
              </label>

              {/* Or paste URL */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={imgInput} onChange={e => setImgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addImage()}
                  placeholder="Or paste an image URL and press Enter…" style={{ border: "1.5px solid var(--border)", padding: "8px 12px", fontSize: 12, outline: "none", flex: 1 }} />
                <button onClick={addImage} className="btn-outline-e" style={{ padding: "8px 16px", fontSize: 9, whiteSpace: "nowrap" }}>Add URL</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)} className="btn-outline-dark" style={{ padding: "12px 28px" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-emerald" style={{ padding: "12px 36px" }}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
