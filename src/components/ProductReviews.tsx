"use client";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  user?: { name: string | null } | null;
  createdAt: string;
}

export default function ProductReviews({ productSlug, avgRating, reviewCount }: { productSlug: string; avgRating: number; reviewCount: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${productSlug}/reviews`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch reviews");
        return r.json();
      })
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in title and review");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setForm({ rating: 5, title: "", content: "" });
        setShowForm(false);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 40, marginTop: 40 }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 400, marginBottom: 20 }}>
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 600, color: "var(--emerald)" }}>{avgRating.toFixed(1)}</div>
          <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4 }}>{stars(Math.round(avgRating))}</div>
          <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 6 }}>Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}</div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-outline-e"
          style={{ padding: "10px 20px", alignSelf: "center", justifySelf: "start" }}>
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 40, padding: 20, background: "var(--off-white)", borderRadius: 8 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>
              Rating
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, rating: i }))}
                  style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", opacity: form.rating >= i ? 1 : 0.3, transition: "opacity .2s" }}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g., Beautiful and elegant"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>
              Your Review
            </label>
            <textarea
              value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="Share your experience with this product..."
              rows={4}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", fontSize: 13, outline: "none", fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-emerald" style={{ padding: "10px 20px" }}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div>
        {loading ? (
          <p style={{ color: "var(--ink-faint)" }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: "var(--ink-faint)" }}>No reviews yet. Be the first to review!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {reviews.map(review => (
              <div key={review.id} style={{ paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{review.title}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{stars(review.rating)}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6, margin: 0 }}>{review.content}</p>
                <div style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 8 }}>
                  by {review.user?.name || "Anonymous"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
