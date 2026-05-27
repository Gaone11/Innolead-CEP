"use client";

import { BarChart3 } from "lucide-react";

interface ResultsViewProps { setActiveView: (v: string) => void; }

export default function ResultsView({ setActiveView }: ResultsViewProps) {
  return (
    <div className="fade-in-up">
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "var(--card-shadow)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `rgba(var(--accent-rgb),0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <BarChart3 size={30} color="var(--accent)" />
        </div>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", margin: "0 0 8px", fontSize: 20 }}>My Results</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.6 }}>
          Your diagnostic results and AI-generated recommendations will appear here once you complete the maturity assessment.
        </p>
        <button onClick={() => setActiveView("diagnostic")} className="btn-primary" style={{ padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          Start Diagnostic
        </button>
      </div>
    </div>
  );
}
