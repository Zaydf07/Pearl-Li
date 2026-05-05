"use client";
import { useState } from "react";

interface CollectionMeta {
  id: string;
  name: string;
  eyebrow?: string | null;
  caption?: string | null;
  description?: string | null;
  image?: string | null;
}

const EMPTY = { name: "", eyebrow: "", caption: "", description: "", image: "" };

export default function AdminCollectionsClient({ collections: initialCollections, allCollections }: { collections: CollectionMeta[]; allCollections: string[] }) {
  const [collections, setCollections] = useState(initialCollections);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<CollectionMeta | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setModal(true);
  };

  const openEdit = (collection: CollectionMeta) => {
    setEditing(collection);
    setForm({
      name: collection.name,
      eyebrow: collection.eyebrow ?? "",
      caption: collection.caption ?? "",
      description: collection.description ?? "",
      image: collection.image ?? "",
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      eyebrow: form.eyebrow || null,
      caption: form.caption || null,
      description: form.description || null,
      image: form.image || null,
    };

    try {
      const res = editing
        ? await fetch(`/api/admin/collections/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();

      setCollections(prev => {
        if (editing) {
          return prev.map(item => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });
      setModal(false);
    } catch (error) {
      console.error(error);
      alert("Unable to save collection metadata.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection metadata? This will not remove the product collection itself.")) return;
    const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Unable to delete collection metadata.");
      return;
    }
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h2>Collections</h2>
          <p style={{ color: "var(--ink-faint)", marginTop: 8 }}>Manage collection image, caption, description, and eyebrow text for shop and navbar displays.</p>
        </div>
        <button className="btn-emerald" style={{ padding: "10px 20px" }} onClick={openAdd}>+ Add Collection Meta</button>
      </div>

      <div className="admin-content">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Eyebrow</th>
                <th>Caption</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(collection => (
                <tr key={collection.id}>
                  <td>{collection.name}</td>
                  <td>{collection.eyebrow || "—"}</td>
                  <td>{collection.caption || "—"}</td>
                  <td style={{ width: 160 }}>
                    {collection.image ? (
                      <img src={collection.image} alt={collection.name} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }} />
                    ) : (
                      <span style={{ color: "var(--ink-faint)", fontSize: 11 }}>No image</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => openEdit(collection)} style={{ background: "none", border: "none", color: "var(--emerald)", cursor: "pointer", marginRight: 10 }}>Edit</button>
                    <button onClick={() => handleDelete(collection.id)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 8 }}>Existing product collections</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {allCollections.map(name => (
              <span key={name} style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 3000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 20px" }} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{ background: "var(--white)", width: "100%", maxWidth: 680, padding: 40, borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400 }}>{editing ? "Edit Collection Meta" : "Add Collection Meta"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-faint)" }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 8 }}>Collection Name</label>
                <input list="collection-list" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} style={{ width: "100%", border: "1.5px solid var(--border)", padding: "12px 14px", fontSize: 13, outline: "none" }} />
                <datalist id="collection-list">
                  {allCollections.map(name => <option key={name} value={name} />)}
                </datalist>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 8 }}>Eyebrow</label>
                <input value={form.eyebrow} onChange={e => setForm(prev => ({ ...prev, eyebrow: e.target.value }))} style={{ width: "100%", border: "1.5px solid var(--border)", padding: "12px 14px", fontSize: 13, outline: "none" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 8 }}>Caption</label>
                <input value={form.caption} onChange={e => setForm(prev => ({ ...prev, caption: e.target.value }))} style={{ width: "100%", border: "1.5px solid var(--border)", padding: "12px 14px", fontSize: 13, outline: "none" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 8 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} style={{ width: "100%", border: "1.5px solid var(--border)", padding: "12px 14px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 8 }}>Image URL</label>
                <input value={form.image} onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="https://..." style={{ width: "100%", border: "1.5px solid var(--border)", padding: "12px 14px", fontSize: 13, outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 28 }}>
              <button onClick={() => setModal(false)} className="btn-outline-dark" style={{ padding: "12px 28px" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-emerald" style={{ padding: "12px 36px" }}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Meta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
