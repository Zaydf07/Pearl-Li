"use client";
import { useState } from "react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  country: string;
  type: string;
  message: string;
  status: string;
  label: string;
  date: string;
  reply: string | null;
  images: string | null;
}

const STATUS_BG:   Record<string, string> = { "is-new": "#e8f5ef", "is-pending": "#fef9e8", "is-responded": "#e8f5e8" };
const STATUS_TEXT: Record<string, string> = { "is-new": "var(--emerald-dark)", "is-pending": "#7a6010", "is-responded": "#2d7a2d" };

export default function AdminInquiriesClient({ inquiries: initial }: { inquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initial);
  const [replyTarget, setReplyTarget] = useState<Inquiry | null>(null);
  const [replyText, setReplyText]     = useState("");
  const [sending, setSending]         = useState(false);

  const openReply = (inq: Inquiry) => {
    setReplyTarget(inq);
    setReplyText(inq.reply ?? "");
  };

  const handleSendReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    setSending(true);
    const res = await fetch(`/api/inquiries/${replyTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText.trim(), status: "responded", repliedAt: new Date().toISOString() }),
    });
    if (res.ok) {
      setInquiries(prev => prev.map(i =>
        i.id === replyTarget.id
          ? { ...i, reply: replyText.trim(), status: "is-responded", label: "Responded" }
          : i
      ));
      setReplyTarget(null);
    }
    setSending(false);
  };

  const parseImages = (s: string | null): string[] => {
    try { return s ? JSON.parse(s) : []; } catch { return []; }
  };

  return (
    <>
      <div className="admin-topbar"><h2>Inquiries</h2></div>
      <div className="admin-content">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <input placeholder="Search inquiries…" style={{ flex: 1, border: "1.5px solid var(--border)", padding: "10px 14px", fontSize: 12, background: "var(--white)", outline: "none" }} />
          <select style={{ border: "1.5px solid var(--border)", padding: "10px 14px", fontSize: 12, background: "var(--white)", outline: "none" }}>
            <option>All Statuses</option><option>New</option><option>Pending</option><option>Responded</option>
          </select>
        </div>

        {inquiries.map((inq) => {
          const imgs = parseImages(inq.images);
          return (
            <div key={inq.id} style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: 24, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, marginBottom: 3 }}>{inq.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{inq.email} · {inq.country} · {inq.type} · {inq.date}</div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ padding: "3px 10px", fontSize: 8, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600, background: STATUS_BG[inq.status] || "var(--emerald-pale)", color: STATUS_TEXT[inq.status] || "var(--emerald-dark)" }}>
                    {inq.label}
                  </span>
                  <button className="btn-emerald" style={{ padding: "8px 16px", fontSize: 9 }} onClick={() => openReply(inq)}>
                    {inq.reply ? "Edit Reply" : "Reply"}
                  </button>
                </div>
              </div>

              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: inq.reply || imgs.length ? 14 : 0 }}>
                "{inq.message}"
              </div>

              {/* Show existing reply */}
              {inq.reply && (
                <div style={{ background: "var(--off-white)", border: "1.5px solid var(--border)", padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 6 }}>Your Reply (visible to customer)</div>
                  <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>{inq.reply}</div>
                </div>
              )}

              {/* Reference images */}
              {imgs.length > 0 && (
                <>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 8 }}>Reference images:</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {imgs.map((url, i) => (
                      <img key={i} src={url} alt={`Ref ${i + 1}`} style={{ width: 72, height: 72, objectFit: "cover", border: "1.5px solid var(--border)" }} />
                    ))}
                  </div>
                </>
              )}
              {imgs.length === 0 && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 72, height: 72, background: "var(--cream)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "var(--ink-faint)" }}>Ref 1</div>
                  <div style={{ width: 72, height: 72, background: "var(--cream)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "var(--ink-faint)" }}>Ref 2</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── REPLY MODAL ── */}
      {replyTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => e.target === e.currentTarget && setReplyTarget(null)}>
          <div style={{ background: "var(--white)", width: "100%", maxWidth: 560, padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 400 }}>Reply to {replyTarget.name}</h2>
              <button onClick={() => setReplyTarget(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-faint)" }}>×</button>
            </div>

            {/* Original message */}
            <div style={{ background: "var(--off-white)", border: "1.5px solid var(--border)", padding: "12px 16px", marginBottom: 20, fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.6 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Customer Message</div>
              {replyTarget.message}
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 7 }}>Your Reply</label>
              <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 8 }}>This reply will be saved and shown to the customer in their account under My Inquiries.</div>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={5}
                placeholder="Type your reply here…"
                style={{ width: "100%", border: "1.5px solid var(--border)", padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", color: "var(--ink)", background: "var(--white)" }}
              />
            </div>

            <div style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 20, padding: "10px 14px", background: "#fef9e8", border: "1px solid #f0e0a0" }}>
              Note: Email delivery is not yet configured. The reply will be visible to the customer when they log in and view their inquiry.
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setReplyTarget(null)} className="btn-outline-dark" style={{ padding: "12px 24px" }}>Cancel</button>
              <button onClick={handleSendReply} disabled={sending || !replyText.trim()} className="btn-emerald" style={{ padding: "12px 32px" }}>
                {sending ? "Saving…" : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
