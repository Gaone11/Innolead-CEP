"use client";

import { useState } from "react";
import { BarChart3, Calendar, BookOpen, ArrowRight, Eye, EyeOff, Brain } from "lucide-react";

const features = [
  { icon: Brain,     color: "var(--accent)", title: "AI Guidance Agent",    desc: "Context-aware consulting intelligence"     },
  { icon: BarChart3, color: "#007B5F",        title: "Diagnostic & Scoring", desc: "Maturity assessment with AI routing"       },
  { icon: BookOpen,  color: "#FF9933",        title: "Toolkit Library",     desc: "48+ proprietary consulting frameworks"     },
  { icon: Calendar,  color: "#8B5CF6",        title: "Smart Booking Engine",desc: "AI-matched consultant scheduling"          },
];

interface LandingScreenProps { onLogin: () => void; }

export default function LandingScreen({ onLogin }: LandingScreenProps) {
  const [email, setEmail]       = useState("james.doe@acme.co.bw");
  const [password, setPassword] = useState("••••••••••");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1600);
  }

  return (
    <div className="grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-base)", padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 80, maxWidth: 1100, width: "100%", alignItems: "center" }}>

        {/* Left: branding */}
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: "#fff", border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", flexShrink: 0 }}>
              <img src="/innolead-logo.png" alt="Innolead" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text-heading)", lineHeight: 1.1 }}>INNOLEAD</div>
              <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 2.5, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>CEP PLATFORM</div>
            </div>
          </div>

          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 42, color: "var(--text-heading)", lineHeight: 1.15, margin: "0 0 20px" }}>
            Your Guided<br />
            <span style={{ color: "var(--accent)" }}>
              Consulting Journey
            </span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 440 }}>
            An AI-powered platform that guides you from diagnostic to delivered results — with intelligent agents working alongside your consultants at every step.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card-hover" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "var(--card-shadow)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: `${f.color === "var(--accent)" ? "rgba(var(--accent-rgb),0.1)" : f.color + "18"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={f.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)", marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: login form */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: 36, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
          {/* Form logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: "#fff", border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <img src="/innolead-logo.png" alt="Innolead" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
            </div>
          </div>

          <h2 style={{ margin: "0 0 4px", fontFamily: "Montserrat, sans-serif", fontSize: 22, textAlign: "center" }}>Sign In</h2>
          <p style={{ margin: "0 0 28px", fontSize: 13, color: "var(--text-secondary)", textAlign: "center" }}>Access your CEP workspace</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, marginBottom: 7 }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", color: "var(--text-primary)", fontSize: 14, outline: "none", fontFamily: "Roboto, sans-serif", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, marginBottom: 7 }}>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: "100%", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 42px 12px 14px", color: "var(--text-primary)", fontSize: 14, outline: "none", fontFamily: "Roboto, sans-serif", boxSizing: "border-box" }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, fontSize: 13, color: "#EF4444", marginBottom: 16 }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={loading ? "" : "btn-primary"}
              style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, background: loading ? "var(--bg-elevated)" : undefined, color: loading ? "var(--text-muted)" : undefined }}
            >
              {loading ? (
                <><div style={{ width: 16, height: 16, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 14, backgroundColor: "var(--bg-elevated)", borderRadius: 10, border: `1px solid rgba(var(--accent-rgb),0.15)` }}>
            <div style={{ fontSize: 11, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: 6 }}>DEMO CREDENTIALS</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Email: james.doe@acme.co.bw</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Password: any value</div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
            Powered by <span style={{ color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Uhuru AI</span> · Built by OrionX
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
