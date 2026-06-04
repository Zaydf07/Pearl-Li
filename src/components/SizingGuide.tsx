"use client";

export default function SizingGuide({ type, productSize, imageOnly = false }: { type: "bracelet" | "ring"; productSize?: string; imageOnly?: boolean }) {
  if (type === "bracelet") {
    const braceletSizeMap: { [key: string]: string } = {
      "16cm": "18",
      "17cm": "19",
      "18cm": "20",
      "19cm": "21",
      "20cm": "22",
      "21cm": "23",
    };

    const currentSize = productSize ? braceletSizeMap[productSize] : null;

    if (imageOnly) {
      return (
        <div style={{ width: "100%", background: "white", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="/sizing-guides/bracelet_size_chart.png"
            alt="Bracelet Sizing Illustration"
            style={{ maxWidth: "100%", height: "auto", maxHeight: "300px" }}
          />
        </div>
      );
    }

    return (
      <div style={{ width: "100%", background: "white", padding: "30px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, maxWidth: "100%" }}>
          {/* Left: Table */}
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "10px 0 8px 0", textAlign: "left", fontWeight: 500, fontSize: 12, color: "var(--ink-muted)" }}>
                    Wrist<br />circumference (cm)
                  </th>
                  <th style={{ padding: "10px 0 8px 0", textAlign: "left", fontWeight: 500, fontSize: 12, color: "var(--ink-muted)" }}>
                    Suggested<br />size
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { wrist: "15 cm", size: "17" },
                  { wrist: "16 cm", size: "18" },
                  { wrist: "17 cm", size: "19" },
                  { wrist: "18 cm", size: "20" },
                  { wrist: "19 cm", size: "21" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px dotted var(--border)", backgroundColor: currentSize === row.size ? "rgba(168,216,192,0.08)" : "transparent" }}>
                    <td style={{ padding: "8px 0", fontSize: 14, fontWeight: currentSize === row.size ? 500 : 400, color: currentSize === row.size ? "var(--emerald)" : "inherit" }}>
                      {row.wrist}
                    </td>
                    <td style={{ padding: "8px 0", fontSize: 14, fontWeight: currentSize === row.size ? 500 : 400, color: currentSize === row.size ? "var(--emerald)" : "inherit" }}>
                      {row.size}
                      {currentSize === row.size && " ← This"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 12, marginBottom: 0, lineHeight: 1.5 }}>
              * Measure close to the wrist to get the right circumference
            </p>
          </div>

          {/* Right: Hand Illustration */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src="/sizing-guides/bracelet_size_chart.png"
              alt="Bracelet Sizing Illustration"
              style={{ maxWidth: "100%", height: "auto", maxHeight: "280px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "ring") {
    if (imageOnly) {
      return (
        <div style={{ width: "100%", background: "white", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="/sizing-guides/ring_size_chart_A.jpeg"
            alt="Ring Sizing Guide"
            style={{ maxWidth: "100%", height: "auto", maxHeight: "300px" }}
          />
        </div>
      );
    }

    return (
      <div style={{ width: "100%", background: "white", padding: "30px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, maxWidth: "100%", alignItems: "center" }}>
          <img
            src="/sizing-guides/ring_size_chart_A.jpeg"
            alt="Ring Sizing Guide"
            style={{ maxWidth: "100%", height: "auto", maxHeight: "400px" }}
          />
        </div>
        <div style={{ overflowX: "auto", marginTop: 30, display: "none" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ backgroundColor: "var(--off-white)", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, fontSize: 13 }}>Finger Size (MM)</th>
                <th style={{ padding: "12px 8px", textAlign: "center", fontWeight: 600, fontSize: 13 }}>Europe</th>
                <th style={{ padding: "12px 8px", textAlign: "center", fontWeight: 600, fontSize: 13 }}>USA</th>
                <th style={{ padding: "12px 8px", textAlign: "center", fontWeight: 600, fontSize: 13 }}>UK</th>
                <th style={{ padding: "12px 8px", textAlign: "center", fontWeight: 600, fontSize: 13 }}>Japan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { mm: "44", eu: "44", usa: "3", uk: "F 1/2", jp: "4" },
                { mm: "45", eu: "45", usa: "3 1/4", uk: "G", jp: "5" },
                { mm: "46", eu: "46", usa: "3 3/4", uk: "H", jp: "6" },
                { mm: "47", eu: "47", usa: "4", uk: "H 1/2", jp: "7" },
                { mm: "48", eu: "48", usa: "4 1/2", uk: "I 1/2", jp: "8" },
                { mm: "49", eu: "49", usa: "4 3/4", uk: "J 1/2", jp: "9" },
                { mm: "50", eu: "50", usa: "5 1/4", uk: "K", jp: "10" },
                { mm: "51", eu: "51", usa: "5 3/4", uk: "L", jp: "11" },
                { mm: "52", eu: "52", usa: "6", uk: "L 1/2", jp: "12" },
                { mm: "53", eu: "53", usa: "6 1/4", uk: "M 1/2", jp: "13" },
                { mm: "54", eu: "54", usa: "6 3/4", uk: "N 1/2", jp: "14" },
                { mm: "55", eu: "55", usa: "7 1/4", uk: "O", jp: "15" },
                { mm: "56", eu: "56", usa: "7 1/2", uk: "P", jp: "16" },
                { mm: "57", eu: "57", usa: "8", uk: "P 1/2", jp: "17" },
                { mm: "58", eu: "58", usa: "8 1/4", uk: "Q 1/2", jp: "18" },
                { mm: "59", eu: "59", usa: "8 3/4", uk: "R", jp: "19" },
                { mm: "60", eu: "60", usa: "9", uk: "S", jp: "20" },
                { mm: "61", eu: "61", usa: "9 1/2", uk: "S 1/2", jp: "21" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--off-white)" : "var(--white)" }}>
                  <td style={{ padding: "10px 8px", fontSize: 13, fontWeight: 600 }}>{row.mm}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13, textAlign: "center" }}>{row.eu}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13, textAlign: "center" }}>{row.usa}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13, textAlign: "center" }}>{row.uk}</td>
                  <td style={{ padding: "10px 8px", fontSize: 13, textAlign: "center" }}>{row.jp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 16 }}>
          * The above size chart is for recommendation only
        </p>
      </div>
    );
  }

  return null;
}
