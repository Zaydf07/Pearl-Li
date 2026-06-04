"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        marginTop: 24,
        padding: "12px 18px",
        fontSize: 9,
        letterSpacing: ".16em",
        textTransform: "uppercase",
        fontWeight: 600,
        color: "var(--ink-faint)",
        background: "none",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
        transition: "color .2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
      onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}
    >
      Sign Out
    </button>
  );
}
