"use client";

import { TrendingUp, Users, DollarSign, BarChart3, Eye, ArrowUpRight, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";

const stats = [
  { label: "Total Clients", value: "142", change: "+18%", icon: Users, color: "#3BC2FB" },
  { label: "Monthly Revenue", value: "BWP 68.4K", change: "+23%", icon: DollarSign, color: "#007B5F" },
  { label: "Hot Leads", value: "24", change: "+7", icon: TrendingUp, color: "#FF9933" },
  { label: "Conversion Rate", value: "38%", change: "+4%", icon: BarChart3, color: "#8B5CF6" },
];

const leads = [
  {
    name: "BotswanaPower Ltd",
    industry: "Energy",
    score: 87,
    toolkit: "Strategy Execution + Governance",
    diagnostic: 52,
    urgency: "HIGH",
    recommended: "Strategy Execution Workshop",
    lastActive: "2h ago",
    status: "hot",
  },
  {
    name: "Capital Bank Botswana",
    industry: "Banking",
    score: 79,
    toolkit: "Governance Framework",
    diagnostic: 61,
    urgency: "HIGH",
    recommended: "Governance Diagnostic",
    lastActive: "4h ago",
    status: "hot",
  },
  {
    name: "African Growth Partners",
    industry: "Private Equity",
    score: 65,
    toolkit: "Strategy + HR",
    diagnostic: 74,
    urgency: "MEDIUM",
    recommended: "Leadership Development",
    lastActive: "1d ago",
    status: "warm",
  },
  {
    name: "Gaborone Polytechnic",
    industry: "Education",
    score: 58,
    toolkit: "Change Management",
    diagnostic: 48,
    urgency: "MEDIUM",
    recommended: "Change Readiness Workshop",
    lastActive: "2d ago",
    status: "warm",
  },
  {
    name: "Morupule Coal Mine",
    industry: "Mining",
    score: 42,
    toolkit: "Basic Toolkit",
    diagnostic: 35,
    urgency: "LOW",
    recommended: "Academy Course",
    lastActive: "3d ago",
    status: "cold",
  },
];

const activities = [
  { icon: CheckCircle, color: "#22C55E", text: "Capital Bank completed Governance diagnostic", time: "2h ago" },
  { icon: AlertCircle, color: "#FF9933", text: "BotswanaPower scored HIGH urgency — follow up recommended", time: "3h ago" },
  { icon: Zap, color: "#3BC2FB", text: "AI agent generated 3 new lead summaries", time: "5h ago" },
  { icon: Users, color: "#8B5CF6", text: "African Growth Partners booked Strategy session", time: "1d ago" },
  { icon: TrendingUp, color: "#007B5F", text: "Monthly revenue target exceeded by 23%", time: "2d ago" },
];

const funnelStages = [
  { label: "Toolkit Downloads", count: 312, color: "#3BC2FB" },
  { label: "Diagnostic Started", count: 198, color: "#007B5F" },
  { label: "Diagnostic Completed", count: 142, color: "#FF9933" },
  { label: "Consultant Booked", count: 54, color: "#8B5CF6" },
  { label: "Paid Engagement", count: 24, color: "#22C55E" },
];
const maxFunnel = Math.max(...funnelStages.map(f => f.count));

export default function AdminView() {
  return (
    <div className="fade-in-up">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card-hover" style={{
              backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: "20px 22px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  backgroundColor: `${s.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color={s.color} />
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 8px", borderRadius: 6,
                  backgroundColor: "rgba(34,197,94,0.12)", color: "#22C55E",
                  fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                  <ArrowUpRight size={10} /> {s.change}
                </span>
              </div>
              <div style={{ fontSize: 26, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "#fff", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, marginBottom: 20 }}>
        {/* Leads Table */}
        <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 22, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: "0 0 2px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Lead Pipeline</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>AI-scored and prioritised</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="agent-pulse" style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#3BC2FB" }} />
              <span style={{ fontSize: 11, color: "#3BC2FB", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Live scoring</span>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #374151" }}>
                {["Organisation", "Lead Score", "Diagnostic", "Urgency", "Recommended Action", "Last Active", ""].map(h => (
                  <th key={h} style={{ padding: "0 12px 10px", textAlign: "left", fontSize: 11, color: "#6B7280", fontFamily: "Montserrat, sans-serif", fontWeight: 600, letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => {
                const urgencyColor = lead.urgency === "HIGH" ? "#EF4444" : lead.urgency === "MEDIUM" ? "#F59E0B" : "#6B7280";
                const statusColor = lead.status === "hot" ? "#EF4444" : lead.status === "warm" ? "#F59E0B" : "#6B7280";
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #252B3A", transition: "background 0.15s" }}>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.industry}</div>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 48, height: 6, backgroundColor: "#252B3A", borderRadius: 3 }}>
                          <div style={{ width: `${lead.score}%`, height: "100%", backgroundColor: statusColor, borderRadius: 3, transition: "width 1s ease" }} />
                        </div>
                        <span style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: statusColor }}>{lead.score}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#E5E7EB" }}>{lead.diagnostic}%</span>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{
                        padding: "3px 9px", borderRadius: 6, fontSize: 10,
                        backgroundColor: `${urgencyColor}15`, color: urgencyColor,
                        fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                      }}>
                        {lead.urgency}
                      </span>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>{lead.recommended}</span>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280" }}>
                        <Clock size={11} /> {lead.lastActive}
                      </div>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <button style={{
                        padding: "5px 12px", borderRadius: 7,
                        background: "rgba(59,194,251,0.1)", border: "1px solid rgba(59,194,251,0.2)",
                        color: "#3BC2FB", cursor: "pointer", fontSize: 11,
                        display: "flex", alignItems: "center", gap: 4,
                        fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                      }}>
                        <Eye size={11} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Conversion Funnel */}
          <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 20 }}>
            <h4 style={{ margin: "0 0 18px", fontFamily: "Montserrat, sans-serif", fontSize: 13 }}>Conversion Funnel</h4>
            {funnelStages.map((stage, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{stage.label}</span>
                  <span style={{ fontSize: 12, color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>{stage.count}</span>
                </div>
                <div style={{ height: 6, backgroundColor: "#252B3A", borderRadius: 3 }}>
                  <div style={{
                    width: `${(stage.count / maxFunnel) * 100}%`, height: "100%",
                    backgroundColor: stage.color, borderRadius: 3, transition: "width 1.2s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 20 }}>
            <h4 style={{ margin: "0 0 16px", fontFamily: "Montserrat, sans-serif", fontSize: 13 }}>Activity Feed</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activities.map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      backgroundColor: `${act.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={13} color={act.color} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: "#E5E7EB", lineHeight: 1.4 }}>{act.text}</p>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
