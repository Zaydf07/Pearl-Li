"use client";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentType: string;
  sortOrder: number;
}

const PARENT_TYPES = ["Jewellery", "Watches", "Accessories"];

const EMPTY = { name: "", parentType: "Jewellery", sortOrder: 0 };

export default function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState<Category | null>(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [error, setError]           = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null); setForm(EMPTY); setError(""); setModal(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, parentType: c.parentType, sortOrder: c.sortOrder });
    setError(""); setModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true); setError("");
    const res = editing
      ? await fetch(`/api/admin/categories/${editing.id}`, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      : await fetch("/api/admin/categories",               { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setModal(false); await load(); }
    else { const d = await res.json(); setError(d.error || "Failed to save"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products using it will still exist.")) return;
    setDeleting(id);
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  const grouped = PARENT_TYPES.map(type => ({
    type,
    items: categories.filter(c => c.parentType === type),
  }));

  return (
    <>
      <div className="admin-topbar"><h2>Categories</h2></div>
      <div className="admin-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "var(--ink-muted)", margin: 0 }}>
            Categories appear in the shop navigation automatically. Customers can browse products by category.
          </p>
          <button className="btn-emerald" style={{ padding: "10px 20px", whiteSpace: "nowrap" }} onClick={openAdd}>
            + Add Category
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--ink-faint)", fontSize: 12 }}>Loading…</p>
        ) : (
          grouped.map(({ type, items }) => (
            <div key={type} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 12 }}>{type}</div>
              {items.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No categories yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Name</th><th>Slug</th><th>Sort Order</th><th>Actions</th></tr></thead>
                    <tbody>
                      {items.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.name}</strong></td>
                          <td style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "monospace" }}>/shop?category={c.slug}</td>
                          <td style={{ fontSize: 12 }}>{c.sortOrder}</td>
                          <td>
                            <button onClick={() => openEdit(c)} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--emerald)", cursor: "pointer", marginRight: 8 }}>Edit</button>
                            <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--red)", cursor: "pointer" }}>
                              {deleting === c.id ? "…" : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{ background: "var(--white)", width: "100%", maxWidth: 480, padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 400 }}>{editing ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-faint)" }}>×</button>
            </div>

            {[
              { label: "Category Name", hint: "e.g. Anklets, Tiaras — will appear in the Shop navigation", node: (
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Anklets"
                  style={{ width: "100%", border: "1.5px solid var(--border)", padding: "10px 12px", fontSize: 13, outline: "none", background: "var(--white)", color: "var(--ink)" }} />
              )},
              { label: "Type", hint: "Which section of the Shop dropdown this appears under", node: (
                <select value={form.parentType} onChange={e => setForm(p => ({ ...p, parentType: e.target.value }))}
                  style={{ width: "100%", border: "1.5px solid var(--border)", padding: "10px 12px", fontSize: 13, outline: "none", background: "var(--white)", color: "var(--ink)" }}>
                  {PARENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              )},
              { label: "Sort Order", hint: "Lower number = appears first. Use 0, 1, 2… to control order", node: (
                <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                  style={{ width: "100%", border: "1.5px solid var(--border)", padding: "10px 12px", fontSize: 13, outline: "none", background: "var(--white)", color: "var(--ink)" }} />
              )},
            ].map(({ label, hint, node }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 5 }}>{label}</label>
                <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 6 }}>{hint}</div>
                {node}
              </div>
            ))}

            {error && <p style={{ color: "var(--red)", fontSize: 12, margin: "0 0 16px" }}>{error}</p>}

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setModal(false)} className="btn-outline-dark" style={{ padding: "12px 24px" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-emerald" style={{ padding: "12px 32px" }}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
