"use client";
import { useEffect, useState } from "react";

const SLIDES = [
  { type: "video" as const, src: "/coverr-diverse-collection-of-rings-on-display-1080p.mp4",       duration: 7000 },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80", duration: 5000 },
  { type: "video" as const, src: "/coverr-a-girl-wearing-many-pieces-of-jewelry-5100-1080p.mp4",   duration: 7000 },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1573408301185-9519f94f4d90?w=1600&q=80", duration: 5000 },
];

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIdx(prev => (prev + 1) % SLIDES.length), SLIDES[idx].duration);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          style={{
            position: "absolute", inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
            zIndex: i === idx ? 1 : 0,
          }}
        >
          {slide.type === "video" ? (
            <video
              src={slide.src}
              autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              src={slide.src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </div>
      ))}

      {/* Slide indicators */}
      <div style={{
        position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 10,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === idx ? 32 : 8, height: 3,
              borderRadius: 2, padding: 0, border: "none", cursor: "pointer",
              background: i === idx ? "var(--emerald-mid)" : "rgba(255,255,255,0.35)",
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
