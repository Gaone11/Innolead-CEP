"use client";

import { BookOpen, ClipboardList, Calendar, ArrowRight, Brain, Zap } from "lucide-react";

interface DashboardViewProps { setActiveView: (v: string) => void; }

export default function DashboardView({ setActiveView }: DashboardViewProps) {
  const quickActions = [
    { label: "Run Diagnostic",   desc: "Assess your organisation's maturity", icon: ClipboardList, color: "var(--accent)", view: "diagnostic" },
    { label: "Browse Toolkits",  desc: "Explore consulting frameworks",       icon: BookOpen,      color: "#007B5F",        view: "toolkits"   },
    { label: "Talk to AI Agent", desc: "Get guidance from your AI assistant", icon: Brain,         color: "#8B5CF6",        view: "agent"      },
    { label: "Book a Session",   desc: "Schedule time with a consultant",     icon: Calendar,      color: "#FF9933",        view: "booking"    },
  ];

  return (
    <div className="fade-in-up">
      {/* Welcome banner */}
      <div style={{ background: `linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 50%, rgba(var(--accent-rgb),0.06) 100%)`, border: "1px solid var(--border)", borderRadius: 16, padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, letterSpacing: 1 }}>WELCOME</p>
              <h1 style={{ margin: "0 0 8px", fontSize: 28, fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}>Client Enablement Platform</h1>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, maxWidth: 520 }}>
                Your AI-powered consulting journey starts here. Run a diagnostic, explore toolkits, or speak with the AI Guidance Agent to get started.
              </p>
            </div>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `rgba(var(--accent-rgb),0.1)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(var(--accent-rgb),0.25)`, flexShrink: 0 }}>
              <Zap size={36} color="var(--accent)" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isAccent = action.color === "var(--accent)";
          return (
            <button
              key={action.label}
              onClick={() => setActiveView(action.view)}
              className="card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 22px", boxShadow: "var(--card-shadow)", cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: isAccent ? `rgba(var(--accent-rgb),0.1)` : `${action.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={22} color={action.color} />
              </div>
              <div style={{ fontSize: 15, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>{action.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.5 }}>{action.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: action.color, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                Get Started <ArrowRight size={13} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
