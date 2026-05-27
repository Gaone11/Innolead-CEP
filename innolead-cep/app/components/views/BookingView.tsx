"use client";

import { Calendar } from "lucide-react";

export default function BookingView() {
  return (
    <div className="fade-in-up">
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "var(--card-shadow)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `rgba(var(--accent-rgb),0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Calendar size={30} color="var(--accent)" />
        </div>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", margin: "0 0 8px", fontSize: 20 }}>Book a Session</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
          Session booking will be available here. Schedule time with expert consultants, choose services, and receive AI-generated pre-session briefings.
        </p>
      </div>
    </div>
  );
}
