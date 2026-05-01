"use client";

import { useState } from "react";
import { TrendingUp, Users, DollarSign, BarChart3, Eye, ArrowUpRight, AlertCircle, CheckCircle, Clock, Zap, X, Brain, BookOpen, Calendar, ArrowRight } from "lucide-react";

const stats = [
  { label: "Total Clients",   value: "142",       change: "+18%", icon: Users,      color: "var(--accent)" },
  { label: "Monthly Revenue", value: "BWP 68.4K", change: "+23%", icon: DollarSign, color: "#007B5F"       },
  { label: "Hot Leads",       value: "24",         change: "+7",  icon: TrendingUp, color: "#FF9933"       },
  { label: "Conversion Rate", value: "38%",        change: "+4%", icon: BarChart3,  color: "#8B5CF6"       },
];

const leads = [
  { name: "BotswanaPower Ltd",       industry: "Energy",        score: 87, diagnostic: 52, urgency: "HIGH",   recommended: "Strategy Execution Workshop", lastActive: "2h ago",  status: "hot",  contact: "Tebogo Kgalagadi",    email: "t.kgalagadi@bwpower.co.bw",    toolkits: ["Strategy Execution", "Governance"],  insights: "Client's execution score (52%) is the primary concern. They have downloaded 2 toolkits but not engaged with the diagnostic deeply. Recommend immediate outreach for workshop." },
  { name: "Capital Bank Botswana",   industry: "Banking",       score: 79, diagnostic: 61, urgency: "HIGH",   recommended: "Governance Diagnostic",       lastActive: "4h ago",  status: "hot",  contact: "Dr. Masego Sithembi", email: "m.sithembi@capitalbank.co.bw", toolkits: ["Governance Framework"],              insights: "Strong interest in governance. Board charter work is a priority. Client is ready for a paid diagnostic — high conversion probability." },
  { name: "African Growth Partners", industry: "Private Equity",score: 65, diagnostic: 74, urgency: "MEDIUM", recommended: "Leadership Development",       lastActive: "1d ago",  status: "warm", contact: "Keitseng Molefhe",   email: "k.molefhe@agpartners.co.bw",   toolkits: ["Strategy Execution", "HR & Talent"], insights: "High diagnostic score indicates strong fundamentals. Gap is in people development and succession planning. A leadership workshop would be well-received." },
  { name: "Gaborone Polytechnic",    industry: "Education",     score: 58, diagnostic: 48, urgency: "MEDIUM", recommended: "Change Readiness Workshop",    lastActive: "2d ago",  status: "warm", contact: "Prof. Onkabo Duma",   email: "o.duma@gaboronepoly.bw",       toolkits: ["Change Management"],                 insights: "Early-stage diagnostic engagement. Low score indicates foundational work is needed. Academy course recommended before consulting engagement." },
  { name: "Morupule Coal Mine",      industry: "Mining",        score: 42, diagnostic: 35, urgency: "LOW",    recommended: "Academy Course",              lastActive: "3d ago",  status: "cold", contact: "Lesedi Tsheko",       email: "l.tsheko@morupule.co.bw",      toolkits: ["Basic Toolkit"],                     insights: "Low maturity score — self-service path recommended first. Nurture with newsletter and academy content before moving to paid services." },
];

const activities = [
  { icon: CheckCircle, color: "#22C55E", text: "Capital Bank completed Governance diagnostic",              time: "2h ago" },
  { icon: AlertCircle, color: "#FF9933", text: "BotswanaPower scored HIGH urgency — follow up recommended", time: "3h ago" },
  { icon: Zap,         color: "var(--accent)", text: "AI agent generated 3 new lead summaries",             time: "5h ago" },
  { icon: Users,       color: "#8B5CF6", text: "African Growth Partners booked Strategy session",           time: "1d ago" },
  { icon: TrendingUp,  color: "#007B5F", text: "Monthly revenue target exceeded by 23%",                   time: "2d ago" },
];

const funnelStages = [
  { label: "Toolkit Downloads",    count: 312, color: "var(--accent)" },
  { label: "Diagnostic Started",   count: 198, color: "#007B5F"       },
  { label: "Diagnostic Completed", count: 142, color: "#FF9933"       },
  { label: "Consultant Booked",    count: 54,  color: "#8B5CF6"       },
  { label: "Paid Engagement",      count: 24,  color: "#22C55E"       },
];
const maxFunnel = Math.max(...funnelStages.map(f => f.count));

export default function AdminView() {
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);

  return (
    <div className="fade-in-up">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => {
          const Icon    = s.icon;
          const isAccent= s.color === "var(--accent)";
          return (
            <div key={i} className="card-hover" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", boxShadow: "var(--card-shadow)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: isAccent ? `rgba(var(--accent-rgb),0.1)` : `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color={s.color} />
                </div>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, backgroundColor: "rgba(34,197,94,0.12)", color: "#22C55E", fontFamily: "Montserrat, sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                  <ArrowUpRight size={10} /> {s.change}
                </span>
              </div>
              <div style={{ fontSize: 26, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "var(--text-heading)", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, marginBottom: 20 }}>
        {/* Lead table */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: "0 0 2px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Lead Pipeline</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>AI-scored and prioritised</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="agent-pulse" style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
              <span style={{ fontSize: 11, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Live scoring</span>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Organisation", "Lead Score", "Diagnostic", "Urgency", "Recommended Action", "Last Active", ""].map(h => (
                  <th key={h} style={{ padding: "0 12px 10px", textAlign: "left", fontSize: 11, color: "var(--text-muted)", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => {
                const urgencyColor = lead.urgency === "HIGH" ? "#EF4444" : lead.urgency === "MEDIUM" ? "#F59E0B" : "var(--text-muted)";
                const statusColor  = lead.status  === "hot"  ? "#EF4444" : lead.status  === "warm"  ? "#F59E0B" : "var(--text-muted)";
                return (
                  <tr key={i} style={{ borderBottom: "1px solid var(--bg-elevated)" }}>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{lead.industry}</div>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 48, height: 6, backgroundColor: "var(--bg-elevated)", borderRadius: 3 }}>
                          <div style={{ width: `${lead.score}%`, height: "100%", backgroundColor: statusColor, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: statusColor }}>{lead.score}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-primary)" }}>{lead.diagnostic}%</span>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 10, backgroundColor: `${urgencyColor}15`, color: urgencyColor, fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>{lead.urgency}</span>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{lead.recommended}</span>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                        <Clock size={11} /> {lead.lastActive}
                      </div>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <button onClick={() => setSelectedLead(lead)} style={{ padding: "5px 12px", borderRadius: 7, background: `rgba(var(--accent-rgb),0.08)`, border: `1px solid rgba(var(--accent-rgb),0.2)`, color: "var(--accent)", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                        <Eye size={11} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, boxShadow: "var(--card-shadow)" }}>
            <h4 style={{ margin: "0 0 18px", fontFamily: "Montserrat, sans-serif", fontSize: 13 }}>Conversion Funnel</h4>
            {funnelStages.map((stage, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{stage.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text-heading)", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>{stage.count}</span>
                </div>
                <div style={{ height: 6, backgroundColor: "var(--bg-elevated)", borderRadius: 3 }}>
                  <div style={{ width: `${(stage.count / maxFunnel) * 100}%`, height: "100%", backgroundColor: stage.color, borderRadius: 3, transition: "width 1.2s ease" }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, boxShadow: "var(--card-shadow)" }}>
            <h4 style={{ margin: "0 0 16px", fontFamily: "Montserrat, sans-serif", fontSize: 13 }}>Activity Feed</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activities.map((act, i) => {
                const Icon    = act.icon;
                const isAccent= act.color === "var(--accent)";
                return (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, backgroundColor: isAccent ? `rgba(var(--accent-rgb),0.1)` : `${act.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={13} color={act.color} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--text-primary)", lineHeight: 1.4 }}>{act.text}</p>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Client Detail Slide-out */}
      {selectedLead && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 150, backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedLead(null)} />
          <div className="slide-in-left" style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 460, zIndex: 160, backgroundColor: "var(--bg-card)", borderLeft: "1px solid var(--border)", boxShadow: "-20px 0 60px rgba(0,0,0,0.2)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "22px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontFamily: "Montserrat, sans-serif", fontSize: 17 }}>{selectedLead.name}</h2>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selectedLead.industry} · {selectedLead.contact}</div>
                <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 2 }}>{selectedLead.email}</div>
              </div>
              <button onClick={() => setSelectedLead(null)} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}><X size={16} /></button>
            </div>

            <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Lead Score",       value: selectedLead.score,      color: selectedLead.status === "hot" ? "#EF4444" : selectedLead.status === "warm" ? "#F59E0B" : "var(--text-muted)", suffix: "" },
                  { label: "Diagnostic Score", value: selectedLead.diagnostic, color: "var(--accent)",                                                                                                suffix: "%" },
                ].map(m => (
                  <div key={m.label} style={{ backgroundColor: "var(--bg-elevated)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{m.label}</div>
                    <div style={{ fontSize: 28, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: m.color }}>{m.value}{m.suffix}</div>
                    <div style={{ height: 4, backgroundColor: "var(--border)", borderRadius: 2, marginTop: 8 }}>
                      <div style={{ width: `${m.value}%`, height: "100%", backgroundColor: m.color, borderRadius: 2, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: `${selectedLead.urgency === "HIGH" ? "#EF4444" : selectedLead.urgency === "MEDIUM" ? "#F59E0B" : "var(--text-muted)"}10`, border: `1px solid ${selectedLead.urgency === "HIGH" ? "#EF4444" : selectedLead.urgency === "MEDIUM" ? "#F59E0B" : "var(--border)"}25`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: selectedLead.urgency === "HIGH" ? "#EF4444" : selectedLead.urgency === "MEDIUM" ? "#F59E0B" : "var(--text-muted)", fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: 6 }}>{selectedLead.urgency} URGENCY</div>
                <div style={{ fontSize: 13, color: "var(--text-heading)", fontWeight: 600 }}>Recommended: {selectedLead.recommended}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, marginBottom: 10 }}>TOOLKITS ACCESSED</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selectedLead.toolkits.map(tk => (
                    <div key={tk} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: "var(--bg-elevated)", borderRadius: 8 }}>
                      <BookOpen size={13} color="var(--accent)" />
                      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{tk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: `rgba(var(--accent-rgb),0.05)`, border: `1px solid rgba(var(--accent-rgb),0.15)`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Brain size={14} color="var(--accent)" />
                  <span style={{ fontSize: 11, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>SALES & CRM AGENT INSIGHT</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{selectedLead.insights}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="btn-primary" style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                  <Calendar size={15} /> Schedule Follow-Up
                </button>
                <button style={{ width: "100%", padding: "12px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  <ArrowRight size={15} /> Send Proposal
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
