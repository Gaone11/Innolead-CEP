"use client";

import { useState } from "react";
import { BarChart3, Download, Check } from "lucide-react";

interface ResultsViewProps {
  setActiveView: (v: string) => void;
  scores?: { label: string; score: number; color: string }[] | null;
}

export default function ResultsView({ setActiveView, scores }: ResultsViewProps) {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported]   = useState(false);

  if (!scores || scores.length === 0) {
    return (
      <div className="fade-in-up">
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "var(--card-shadow)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `rgba(var(--accent-rgb),0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <BarChart3 size={30} color="var(--accent)" />
          </div>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", margin: "0 0 8px", fontSize: 20 }}>My Results</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Your diagnostic results will appear here once you complete the maturity assessment.
          </p>
          <button onClick={() => setActiveView("diagnostic")} className="btn-primary" style={{ padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
            Start Diagnostic
          </button>
        </div>
      </div>
    );
  }

  const overallScore  = Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length);
  const maturityLabel = overallScore >= 70 ? "High Maturity" : overallScore >= 45 ? "Medium Maturity" : "Low Maturity";
  const maturityColor = overallScore >= 70 ? "#22C55E" : overallScore >= 45 ? "#F59E0B" : "#EF4444";

  function handleExport() {
    setExporting(true);
    setTimeout(() => {
      setExporting(false); setExported(true);
      const data = `INNOLEAD CEP — DIAGNOSTIC REPORT\n\nDate: ${new Date().toLocaleDateString()}\n\nOVERALL SCORE: ${overallScore}% (${maturityLabel})\n\nDIMENSION SCORES:\n${scores!.map(s => `  ${s.label}: ${s.score}%`).join("\n")}`;
      const blob = new Blob([data], { type: "text/plain" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "Innolead_Diagnostic_Report.txt"; a.click();
      URL.revokeObjectURL(url);
      setTimeout(() => setExported(false), 3000);
    }, 2000);
  }

  return (
    <div className="fade-in-up">
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, marginBottom: 24 }}>
        {/* Score ring */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "var(--text-secondary)" }}>OVERALL MATURITY</h3>
          <div style={{ position: "relative", width: 170, height: 170, marginBottom: 20 }}>
            <svg viewBox="0 0 170 170" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle cx="85" cy="85" r="70" fill="none" stroke="var(--bg-elevated)" strokeWidth="14" />
              <circle cx="85" cy="85" r="70" fill="none" strokeWidth="14" strokeLinecap="round"
                style={{ stroke: "var(--accent)", strokeDasharray: `${2 * Math.PI * 70}`, strokeDashoffset: `${2 * Math.PI * 70 * (1 - overallScore / 100)}`, transition: "stroke-dashoffset 2s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 40, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "var(--text-heading)" }}>{overallScore}%</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Score</div>
            </div>
          </div>
          <div style={{ fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: maturityColor, marginBottom: 8 }}>{maturityLabel}</div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center", margin: "0 0 20px" }}>Assessed across {scores.length} organisational dimensions</p>

          <button onClick={handleExport} disabled={exporting} className={exporting || exported ? "" : "btn-primary"}
            style={{ width: "100%", padding: "10px", borderRadius: 9, border: "none", cursor: exporting ? "not-allowed" : "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: exported ? "rgba(34,197,94,0.12)" : exporting ? "var(--bg-elevated)" : undefined, color: exported ? "#22C55E" : exporting ? "var(--text-secondary)" : undefined, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            {exported ? <><Check size={13} /> Exported!</> : exporting ? <>Generating...</> : <><Download size={13} /> Export Report</>}
          </button>
        </div>

        {/* Dimension breakdown */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 22px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Dimension Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {scores.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)", fontFamily: "Montserrat, sans-serif" }}>{s.label}</span>
                  <div style={{ fontSize: 22, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: s.color }}>{s.score}%</div>
                </div>
                <div style={{ height: 8, backgroundColor: "var(--bg-elevated)", borderRadius: 4 }}>
                  <div style={{ height: "100%", backgroundColor: s.color, borderRadius: 4, width: `${s.score}%`, transition: "width 1.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => setActiveView("agent")} className="btn-primary" style={{ padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          Ask AI Agent for Recommendations
        </button>
        <button onClick={() => setActiveView("diagnostic")} style={{ padding: "12px 24px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
          Retake Assessment
        </button>
      </div>
    </div>
  );
}
