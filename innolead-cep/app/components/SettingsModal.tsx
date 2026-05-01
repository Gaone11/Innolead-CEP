"use client";

import { useState } from "react";
import { X, Bell, Globe, Shield, Palette, Brain, Save, Check, Sun, Moon } from "lucide-react";

const tabs = [
  { id: "general",       label: "General",       icon: Globe   },
  { id: "notifications", label: "Notifications", icon: Bell    },
  { id: "ai",            label: "AI & Agents",   icon: Brain   },
  { id: "security",      label: "Security",      icon: Shield  },
  { id: "appearance",    label: "Appearance",    icon: Palette },
];

interface SettingsModalProps {
  onClose: () => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export default function SettingsModal({ onClose, theme, setTheme }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    language: "en",
    timezone: "Africa/Gaborone",
    currency: "BWP",
    emailNotifs: true,
    smsNotifs: false,
    agentAlerts: true,
    leadAlerts: true,
    weeklyDigest: true,
    aiConsent: true,
    agentMode: "auto",
    model: "baobab-3",
    twoFA: false,
    sessionTimeout: "30",
    dataRetention: "7years",
    accentColor: "#1B75BB",
    compactMode: false,
  });

  function toggle(key: keyof typeof settings) {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  }
  function set(key: keyof typeof settings, val: string) {
    setSettings(s => ({ ...s, [key]: val }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const Row = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid var(--bg-elevated)` }}>
      <div>
        <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        backgroundColor: on ? "var(--accent)" : "var(--border)",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%", backgroundColor: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </button>
  );

  const Select = ({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        backgroundColor: "var(--bg-elevated)", border: `1px solid var(--border)`, borderRadius: 8,
        padding: "7px 12px", color: "var(--text-primary)", fontSize: 13, cursor: "pointer", outline: "none",
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div
        className="fade-in-up"
        style={{
          width: 760, maxHeight: "85vh", backgroundColor: "var(--bg-card)",
          border: `1px solid var(--border)`, borderRadius: 18,
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid var(--border)`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "Montserrat, sans-serif", fontSize: 17 }}>Platform Settings</h2>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>Configure your CEP experience</p>
          </div>
          <button onClick={onClose} style={{ background: "var(--bg-elevated)", border: `1px solid var(--border)`, borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Tab sidebar */}
          <div style={{ width: 180, borderRight: `1px solid var(--border)`, padding: "12px 0", flexShrink: 0, backgroundColor: "var(--bg-card)" }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={active ? "nav-active" : ""}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
                    color: active ? "var(--accent)" : "var(--text-secondary)", fontSize: 13,
                    transition: "all 0.15s", textAlign: "left",
                  }}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", backgroundColor: "var(--bg-card)" }}>
            {activeTab === "general" && (
              <div>
                <h4 style={{ margin: "0 0 4px", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>GENERAL PREFERENCES</h4>
                <Row label="Language" sub="Platform display language">
                  <Select value={settings.language} options={[{ value: "en", label: "English" }, { value: "tn", label: "Setswana" }]} onChange={v => set("language", v)} />
                </Row>
                <Row label="Timezone" sub="Used for session scheduling">
                  <Select value={settings.timezone} options={[{ value: "Africa/Gaborone", label: "Africa/Gaborone (CAT)" }, { value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST)" }, { value: "UTC", label: "UTC" }]} onChange={v => set("timezone", v)} />
                </Row>
                <Row label="Currency" sub="Displayed on invoices and pricing">
                  <Select value={settings.currency} options={[{ value: "BWP", label: "BWP — Botswana Pula" }, { value: "USD", label: "USD — US Dollar" }, { value: "ZAR", label: "ZAR — South African Rand" }]} onChange={v => set("currency", v)} />
                </Row>
                <Row label="Session Timeout" sub="Auto logout after inactivity">
                  <Select value={settings.sessionTimeout} options={[{ value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }, { value: "60", label: "1 hour" }, { value: "120", label: "2 hours" }]} onChange={v => set("sessionTimeout", v)} />
                </Row>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h4 style={{ margin: "0 0 4px", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>NOTIFICATION PREFERENCES</h4>
                <Row label="Email Notifications" sub="Receive updates via email"><Toggle on={settings.emailNotifs as boolean} onToggle={() => toggle("emailNotifs")} /></Row>
                <Row label="SMS Alerts" sub="Text alerts for high-priority events"><Toggle on={settings.smsNotifs as boolean} onToggle={() => toggle("smsNotifs")} /></Row>
                <Row label="AI Agent Alerts" sub="Notified when agents surface new insights"><Toggle on={settings.agentAlerts as boolean} onToggle={() => toggle("agentAlerts")} /></Row>
                <Row label="Hot Lead Alerts" sub="CRM notifies when a lead scores HIGH"><Toggle on={settings.leadAlerts as boolean} onToggle={() => toggle("leadAlerts")} /></Row>
                <Row label="Weekly Digest" sub="Summary of platform activity every Monday"><Toggle on={settings.weeklyDigest as boolean} onToggle={() => toggle("weeklyDigest")} /></Row>
              </div>
            )}

            {activeTab === "ai" && (
              <div>
                <h4 style={{ margin: "0 0 4px", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>AI & AGENT SETTINGS</h4>
                <Row label="AI Consent" sub="Allow Uhuru AI to process your diagnostic data">
                  <Toggle on={settings.aiConsent as boolean} onToggle={() => toggle("aiConsent")} />
                </Row>
                <Row label="Agent Mode" sub="How proactive agents are">
                  <Select value={settings.agentMode} options={[{ value: "auto", label: "Automatic (Recommended)" }, { value: "manual", label: "Manual (On request)" }, { value: "off", label: "Disabled" }]} onChange={v => set("agentMode", v)} />
                </Row>
                <Row label="AI Model" sub="Intelligence model for diagnostics">
                  <Select value={settings.model} options={[{ value: "baobab-3", label: "Baobab 3.0 (Fast)" }, { value: "polymath-3", label: "Polymath 3.1 (Deep)" }]} onChange={v => set("model", v)} />
                </Row>
                <div style={{ marginTop: 20, padding: 16, backgroundColor: "var(--bg-elevated)", borderRadius: 10, border: `1px solid rgba(var(--accent-rgb),0.15)` }}>
                  <div style={{ fontSize: 12, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: 6 }}>ACTIVE AGENTS</div>
                  {["Client Guidance Agent", "Diagnostic & Scoring Agent", "Sales & CRM Agent", "Consultant Briefing Agent", "Content Evolution Agent"].map(agent => (
                    <div key={agent} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid var(--border)` }}>
                      <span style={{ fontSize: 12, color: "var(--text-primary)" }}>{agent}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22C55E" }} />
                        <span style={{ fontSize: 11, color: "#22C55E" }}>Running</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h4 style={{ margin: "0 0 4px", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>SECURITY SETTINGS</h4>
                <Row label="Two-Factor Authentication" sub="Require OTP on login"><Toggle on={settings.twoFA as boolean} onToggle={() => toggle("twoFA")} /></Row>
                <Row label="Data Retention" sub="How long your data is stored">
                  <Select value={settings.dataRetention} options={[{ value: "7years", label: "7 Years (Regulatory)" }, { value: "3years", label: "3 Years" }, { value: "1year", label: "1 Year" }]} onChange={v => set("dataRetention", v)} />
                </Row>
                <div style={{ marginTop: 20, padding: 16, backgroundColor: "rgba(0,123,95,0.06)", borderRadius: 10, border: "1px solid rgba(0,123,95,0.2)" }}>
                  <div style={{ fontSize: 12, color: "#007B5F", fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: 8 }}>SECURITY STATUS</div>
                  {[
                    { label: "OWASP Top-10 mitigation", ok: true },
                    { label: "AES-256 encryption at rest", ok: true },
                    { label: "TLS 1.3 in transit", ok: true },
                    { label: "Two-factor authentication", ok: settings.twoFA },
                    { label: "Annual penetration test", ok: true },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: item.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: item.ok ? "#22C55E" : "#EF4444" }} />
                      </div>
                      <span style={{ fontSize: 12, color: item.ok ? "var(--text-primary)" : "var(--text-secondary)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div>
                <h4 style={{ margin: "0 0 16px", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>APPEARANCE</h4>

                {/* Theme toggle — prominent */}
                <div style={{ marginBottom: 24, padding: 20, backgroundColor: "var(--bg-elevated)", borderRadius: 14, border: `1px solid var(--border)` }}>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 600, fontFamily: "Montserrat, sans-serif", marginBottom: 4 }}>Colour Theme</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>Switch between the light and dark platform experience</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {/* Light option */}
                    <button
                      onClick={() => setTheme("light")}
                      style={{
                        flex: 1, padding: "16px 12px", borderRadius: 12, cursor: "pointer",
                        border: theme === "light" ? `2px solid var(--accent)` : `1px solid var(--border)`,
                        background: theme === "light" ? `rgba(var(--accent-rgb),0.06)` : "var(--bg-card)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#F8FAFD", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                        <Sun size={22} color="#1B75BB" />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)", marginBottom: 2 }}>Light</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>White & blue (default)</div>
                      </div>
                      {theme === "light" && (
                        <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                    </button>

                    {/* Dark option */}
                    <button
                      onClick={() => setTheme("dark")}
                      style={{
                        flex: 1, padding: "16px 12px", borderRadius: 12, cursor: "pointer",
                        border: theme === "dark" ? `2px solid var(--accent)` : `1px solid var(--border)`,
                        background: theme === "dark" ? `rgba(var(--accent-rgb),0.06)` : "var(--bg-card)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#1A1F2E", border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Moon size={22} color="#3BC2FB" />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)", marginBottom: 2 }}>Dark</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Navy & cyan</div>
                      </div>
                      {theme === "dark" && (
                        <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <Row label="Compact Mode" sub="Reduce padding for more content density">
                  <Toggle on={settings.compactMode as boolean} onToggle={() => toggle("compactMode")} />
                </Row>
                <Row label="Accent Colour" sub="Brand highlight colour">
                  <div style={{ display: "flex", gap: 8 }}>
                    {["#1B75BB", "#22C55E", "#8B5CF6", "#FF9933", "#EF4444"].map(color => (
                      <button
                        key={color}
                        onClick={() => set("accentColor", color)}
                        style={{
                          width: 28, height: 28, borderRadius: "50%", backgroundColor: color, border: "none", cursor: "pointer",
                          outline: settings.accentColor === color ? `3px solid ${color}` : "3px solid transparent",
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </Row>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: `1px solid var(--border)`, display: "flex", justifyContent: "flex-end", gap: 12, backgroundColor: "var(--bg-card)" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 9, background: "var(--bg-elevated)", border: `1px solid var(--border)`, color: "var(--text-secondary)", cursor: "pointer", fontSize: 13 }}>
            Cancel
          </button>
          <button
            onClick={save}
            className="btn-primary"
            style={{ padding: "9px 24px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
          >
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
