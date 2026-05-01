"use client";

import { TrendingUp, BookOpen, ClipboardList, Calendar, ArrowRight, Brain, Target, AlertCircle, CheckCircle, Zap } from "lucide-react";

const stats = [
  { label: "Toolkits Accessed", value: "4",   sub: "+1 this week",     icon: BookOpen,    color: "var(--accent)" },
  { label: "Diagnostic Score",  value: "67%", sub: "Medium maturity",  icon: ClipboardList,color: "#007B5F"       },
  { label: "Sessions Booked",   value: "2",   sub: "1 upcoming",       icon: Calendar,    color: "#FF9933"       },
  { label: "Journey Progress",  value: "70%", sub: "3 steps remaining",icon: TrendingUp,  color: "var(--accent)" },
];

const journeySteps = [
  { id: 1, label: "Explore Toolkits",          status: "done",    desc: "Downloaded Strategy & Governance toolkits" },
  { id: 2, label: "Complete Diagnostic",        status: "done",    desc: "Scored 67% overall maturity"              },
  { id: 3, label: "Review AI Recommendations",  status: "active",  desc: "3 high-priority insights waiting"         },
  { id: 4, label: "Book Consultant Session",    status: "pending", desc: "Recommended: Strategy Execution Workshop"  },
  { id: 5, label: "Action Plan",               status: "pending", desc: "Build 90-day transformation roadmap"       },
];

const agentInsights = [
  { type: "recommendation", icon: Brain,       color: "var(--accent)", title: "Client Guidance Agent",     message: "Based on your diagnostic, most organisations like yours struggle with governance. Would you like a 60-minute strategy review?", cta: "Schedule Review", view: "booking" },
  { type: "alert",          icon: AlertCircle, color: "#FF9933",        title: "Diagnostic & Scoring Agent", message: "Your execution maturity score (52%) falls below the threshold. I recommend the Strategy Execution Workshop before proceeding.", cta: "See Details",     view: "results"  },
  { type: "success",        icon: Target,      color: "#007B5F",        title: "Next Best Action",           message: "You've completed 70% of the toolkit. Want help turning this assessment into a concrete action plan?",                          cta: "Create Action Plan", view: "booking" },
];

interface DashboardViewProps { setActiveView: (v: string) => void; }

export default function DashboardView({ setActiveView }: DashboardViewProps) {
  return (
    <div className="fade-in-up">
      {/* Welcome banner */}
      <div style={{ background: `linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 50%, rgba(var(--accent-rgb),0.06) 100%)`, border: "1px solid var(--border)", borderRadius: 16, padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, letterSpacing: 1 }}>GOOD MORNING</p>
              <h1 style={{ margin: "0 0 8px", fontSize: 28, fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}>Welcome back, James</h1>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, maxWidth: 520 }}>
                Your AI-guided consulting journey is in progress. You have <strong style={{ color: "var(--accent)" }}>3 new insights</strong> from the diagnostic agent and a session booked for Friday.
              </p>
            </div>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `rgba(var(--accent-rgb),0.1)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(var(--accent-rgb),0.25)`, flexShrink: 0 }}>
              <Zap size={36} color="var(--accent)" />
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Journey Progress</span>
              <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>70%</span>
            </div>
            <div style={{ height: 6, backgroundColor: "var(--bg-elevated)", borderRadius: 3 }}>
              <div className="progress-bar" style={{ width: "70%", height: "100%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card-hover" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", boxShadow: "var(--card-shadow)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${s.color === "var(--accent)" ? "rgba(var(--accent-rgb),0.1)" : s.color + "18"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "var(--text-heading)", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: s.color, marginTop: 4 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Journey Map */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontFamily: "Montserrat, sans-serif" }}>Your Consulting Journey</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {journeySteps.map((step, i) => (
              <div key={step.id} style={{ display: "flex", gap: 14, paddingBottom: i < journeySteps.length - 1 ? 20 : 0, position: "relative" }}>
                {i < journeySteps.length - 1 && (
                  <div style={{ position: "absolute", left: 14, top: 30, bottom: 0, width: 2, backgroundColor: step.status === "done" ? "var(--accent)" : "var(--border)" }} />
                )}
                <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, backgroundColor: step.status === "done" ? "var(--accent)" : step.status === "active" ? `rgba(var(--accent-rgb),0.15)` : "var(--bg-elevated)", border: step.status === "active" ? `2px solid var(--accent)` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  {step.status === "done" ? (
                    <CheckCircle size={16} color="#fff" fill="#fff" />
                  ) : step.status === "active" ? (
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
                  ) : (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--border)" }} />
                  )}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: step.status === "done" ? "var(--text-primary)" : step.status === "active" ? "var(--accent)" : "var(--text-muted)", fontFamily: "Montserrat, sans-serif", marginBottom: 3 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Insights */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div className="agent-pulse" style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 15, fontFamily: "Montserrat, sans-serif" }}>Live Agent Insights</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {agentInsights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <div key={i} style={{ backgroundColor: "var(--bg-elevated)", borderRadius: 12, padding: 16, border: `1px solid rgba(var(--accent-rgb),0.1)` }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${insight.color === "var(--accent)" ? "rgba(var(--accent-rgb),0.1)" : insight.color + "18"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={16} color={insight.color} />
                    </div>
                    <div style={{ fontSize: 11, color: insight.color, fontFamily: "Montserrat, sans-serif", fontWeight: 600, paddingTop: 8 }}>{insight.title}</div>
                  </div>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{insight.message}</p>
                  <button
                    onClick={() => setActiveView(insight.view)}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: insight.color, fontSize: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 600, padding: 0 }}
                  >
                    {insight.cta} <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
