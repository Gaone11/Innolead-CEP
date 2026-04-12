"use client";

import { ArrowRight, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Download, Share2 } from "lucide-react";

const scores = [
  { label: "Strategic Clarity", score: 78, prev: 65, color: "#3BC2FB", desc: "Strong vision alignment, gaps in KPI tracking" },
  { label: "Governance & Compliance", score: 58, prev: 52, color: "#007B5F", desc: "Board policies need formalisation; compliance inconsistent" },
  { label: "Execution Capability", score: 52, prev: 48, color: "#FF9933", desc: "Project delivery below benchmark; PMO recommended" },
  { label: "People & Culture", score: 72, prev: 70, color: "#8B5CF6", desc: "Strong culture, succession planning gaps" },
];

const overallScore = Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length);

const recommendations = [
  {
    priority: "HIGH",
    color: "#EF4444",
    title: "Formalise Governance Framework",
    desc: "Establish a board charter and committee mandates. Assign a governance officer and implement quarterly compliance reporting.",
    toolkit: "Corporate Governance Framework",
    service: "Governance Diagnostic (2hrs)",
    effort: "1–2 months",
  },
  {
    priority: "HIGH",
    color: "#EF4444",
    title: "Build Execution Discipline",
    desc: "Implement a Project Management Office (PMO) and standardise delivery processes. Focus on the top 3 strategic initiatives.",
    toolkit: "Strategy Execution Toolkit",
    service: "Strategy Execution Workshop (2 days)",
    effort: "2–3 months",
  },
  {
    priority: "MEDIUM",
    color: "#F59E0B",
    title: "Strengthen KPI Framework",
    desc: "Your strategy is clear but measurement is inconsistent. Build quarterly OKR review cycles tied to departmental plans.",
    toolkit: "Strategy Execution Toolkit",
    service: "OKR Implementation Advisory",
    effort: "1 month",
  },
  {
    priority: "LOW",
    color: "#22C55E",
    title: "Succession Planning Programme",
    desc: "You have a strong culture. Protect it by identifying and developing your next tier of leaders proactively.",
    toolkit: "HR & Talent Maturity Assessment",
    service: "Leadership Development Workshop",
    effort: "3–6 months",
  },
];

const maturityLabel = overallScore >= 70 ? "High Maturity" : overallScore >= 45 ? "Medium Maturity" : "Low Maturity";
const maturityColor = overallScore >= 70 ? "#22C55E" : overallScore >= 45 ? "#F59E0B" : "#EF4444";

interface ResultsViewProps {
  setActiveView: (v: string) => void;
}

export default function ResultsView({ setActiveView }: ResultsViewProps) {
  return (
    <div className="fade-in-up">
      {/* Score Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, marginBottom: 24 }}>
        {/* Overall Score */}
        <div style={{
          backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 16, padding: 28,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <h3 style={{ margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#9CA3AF" }}>
            OVERALL MATURITY
          </h3>

          <div style={{ position: "relative", width: 170, height: 170, marginBottom: 20 }}>
            <svg viewBox="0 0 170 170" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle cx="85" cy="85" r="70" fill="none" stroke="#252B3A" strokeWidth="14" />
              <circle
                cx="85" cy="85" r="70" fill="none"
                stroke="#3BC2FB" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallScore / 100)}`}
                style={{ transition: "stroke-dashoffset 2s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontSize: 40, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "#fff" }}>{overallScore}%</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>Score</div>
            </div>
          </div>

          <div style={{
            fontSize: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
            color: maturityColor, marginBottom: 8,
          }}>
            {maturityLabel}
          </div>
          <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", margin: "0 0 20px" }}>
            Assessed across 4 organisational dimensions
          </p>

          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <Download size={13} /> Export PDF
            </button>
            <button style={{
              padding: "10px 12px", borderRadius: 9,
              background: "#252B3A", border: "1px solid #374151",
              color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center",
            }}>
              <Share2 size={14} />
            </button>
          </div>
        </div>

        {/* Dimension Breakdown */}
        <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 16, padding: 28 }}>
          <h3 style={{ margin: "0 0 22px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Dimension Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {scores.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{s.label}</span>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>{s.desc}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontSize: 22, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: s.color }}>{s.score}%</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", fontSize: 11 }}>
                      {s.score > s.prev
                        ? <><TrendingUp size={11} color="#22C55E" /><span style={{ color: "#22C55E" }}>+{s.score - s.prev}%</span></>
                        : <><TrendingDown size={11} color="#EF4444" /><span style={{ color: "#EF4444" }}>{s.score - s.prev}%</span></>
                      }
                      <span style={{ color: "#4B5563" }}>vs last</span>
                    </div>
                  </div>
                </div>
                <div style={{ height: 8, backgroundColor: "#252B3A", borderRadius: 4 }}>
                  <div style={{
                    height: "100%", backgroundColor: s.color, borderRadius: 4,
                    width: `${s.score}%`, transition: "width 1.5s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 16, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>AI-Generated Recommendations</h3>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>Generated by Diagnostic & Scoring Agent · Uhuru AI</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                backgroundColor: "#252B3A", borderRadius: 12, padding: 20,
                border: `1px solid ${rec.color}22`,
                display: "grid", gridTemplateColumns: "1fr auto",
                gap: 20, alignItems: "start",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{
                    padding: "3px 9px", borderRadius: 6, fontSize: 10,
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                    backgroundColor: `${rec.color}18`, color: rec.color,
                  }}>
                    {rec.priority} PRIORITY
                  </span>
                  <h4 style={{ margin: 0, fontSize: 14, fontFamily: "Montserrat, sans-serif", color: "#fff" }}>{rec.title}</h4>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>{rec.desc}</p>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "#6B7280" }}>Toolkit: </span>
                    <span style={{ color: "#3BC2FB" }}>{rec.toolkit}</span>
                  </div>
                  <div>
                    <span style={{ color: "#6B7280" }}>Service: </span>
                    <span style={{ color: "#E5E7EB" }}>{rec.service}</span>
                  </div>
                  <div>
                    <span style={{ color: "#6B7280" }}>Timeline: </span>
                    <span style={{ color: "#E5E7EB" }}>{rec.effort}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveView("booking")}
                style={{
                  display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                  padding: "10px 16px", borderRadius: 9,
                  background: "rgba(59,194,251,0.1)", border: "1px solid rgba(59,194,251,0.25)",
                  color: "#3BC2FB", cursor: "pointer", fontSize: 12,
                  fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                }}
              >
                Act on this <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
