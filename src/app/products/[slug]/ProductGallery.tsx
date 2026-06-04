"use client";
import { useState } from "react";
import SizingGuide from "@/components/SizingGuide";

interface Props {
  mainImage: string | null;
  extraImages: string[];
  name: string;
  sizingGuideType?: "bracelet" | "ring";
  productSize?: string;
}

export default function ProductGallery({ mainImage, extraImages, name, sizingGuideType, productSize }: Props) {
  const all = Array.from(new Set([mainImage, ...extraImages].filter(Boolean))) as string[];
  const [idx, setIdx] = useState(0);
  const showSizingGuide = sizingGuideType && idx === all.length;

  return (
    <div>
      {/* Main image */}
      <div style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--cream)", position: "relative" }}>
        {showSizingGuide ? (
          <SizingGuide type={sizingGuideType} productSize={productSize} imageOnly={true} />
        ) : all[idx] ? (
          <img key={idx} src={all[idx]} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity .3s" }} />
        ) : (
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--ink-faint)" }}>No image</span>
        )}
      </div>

      {/* Thumbnails */}
      {all.length > 0 && (
        <div style={{ display: "flex", gap: 8, padding: "14px 20px", overflowX: "auto" }}>
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: 68, height: 68, padding: 0, flexShrink: 0,
                border: `1.5px solid ${i === idx ? "var(--black)" : "var(--border)"}`,
                cursor: "pointer", overflow: "hidden", background: "none",
              }}
            >
              <img src={img} alt={`${name} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
          {/* Sizing Guide Thumbnail */}
          {sizingGuideType && (
            <button
              onClick={() => setIdx(all.length)}
              style={{
                width: 68, height: 68, padding: 0, flexShrink: 0,
                border: `1.5px solid ${idx === all.length ? "var(--black)" : "var(--border)"}`,
                cursor: "pointer", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 600, color: "var(--ink-faint)", textAlign: "center",
              }}
            >
              Size Guide
            </button>
          )}
        </div>
      )}
    </div>
  );
}
