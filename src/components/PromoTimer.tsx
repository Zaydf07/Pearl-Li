"use client";
import { Fragment, useEffect, useState } from "react";

export default function PromoTimer({ endDate }: { endDate?: string | null }) {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // If no endDate provided, count down 48h from page load as fallback
    const end = endDate ? new Date(endDate).getTime() : Date.now() + 48 * 3600000;

    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTime({ h: "00", m: "00", s: "00" });
        return;
      }
      setTime({
        h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (expired) return (
    <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", letterSpacing: ".1em" }}>This offer has ended.</p>
  );

  return (
    <div className="promo-timer">
      {([["Hours", time.h], ["Minutes", time.m], ["Seconds", time.s]] as const).map(([lbl, val], i) => (
        <Fragment key={lbl}>
          {i > 0 && <div className="promo-sep">:</div>}
          <div className="promo-unit">
            <span className="promo-num">{val}</span>
            <span className="promo-lbl">{lbl}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
