"use client";

import { Bell, Search, ChevronDown, Cpu } from "lucide-react";

const viewTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: "Client Dashboard", sub: "Your consulting journey at a glance" },
  toolkits: { title: "Toolkit Explorer", sub: "Browse and download consulting toolkits" },
  diagnostic: { title: "Diagnostic Assessment", sub: "Understand your organisation's maturity" },
  agent: { title: "AI Guidance Agent", sub: "Your intelligent consulting assistant" },
  booking: { title: "Book a Session", sub: "Schedule time with expert consultants" },
  results: { title: "My Results", sub: "Scores, insights and recommendations" },
  admin: { title: "Admin & CRM", sub: "Lead management and analytics" },
  consultant: { title: "Consultant Portal", sub: "Briefing notes and client context" },
};

interface HeaderProps {
  activeView: string;
  sidebarCollapsed: boolean;
}

export default function Header({ activeView, sidebarCollapsed }: HeaderProps) {
  const info = viewTitles[activeView] || { title: "Platform", sub: "" };

  return (
    <div
      style={{
        height: 64,
        backgroundColor: "#1A1F2E",
        borderBottom: "1px solid #374151",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "fixed",
        top: 0,
        left: sidebarCollapsed ? 64 : 240,
        right: 0,
        zIndex: 30,
        transition: "left 0.3s ease",
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 17, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#fff" }}>
          {info.title}
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{info.sub}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          backgroundColor: "#252B3A", borderRadius: 8, padding: "7px 14px",
          border: "1px solid #374151",
        }}>
          <Search size={14} color="#6B7280" />
          <input
            placeholder="Search..."
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "#E5E7EB", fontSize: 13, width: 160,
            }}
          />
        </div>

        {/* AI Status */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          backgroundColor: "rgba(59,194,251,0.1)", borderRadius: 8,
          padding: "6px 12px", border: "1px solid rgba(59,194,251,0.2)",
        }}>
          <div className="agent-pulse" style={{
            width: 8, height: 8, borderRadius: "50%",
            backgroundColor: "#3BC2FB",
          }} />
          <Cpu size={13} color="#3BC2FB" />
          <span style={{ fontSize: 12, color: "#3BC2FB", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
            AI Active
          </span>
        </div>

        {/* Notifications */}
        <button style={{
          position: "relative", background: "#252B3A", border: "1px solid #374151",
          borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: "#9CA3AF",
          display: "flex", alignItems: "center",
        }}>
          <Bell size={17} />
          <span style={{
            position: "absolute", top: 4, right: 4, width: 8, height: 8,
            borderRadius: "50%", backgroundColor: "#3BC2FB",
          }} />
        </button>

        {/* User */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          cursor: "pointer",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #3BC2FB, #007B5F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: "#0F1419",
          }}>
            JD
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>James Doe</div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>Client</div>
          </div>
          <ChevronDown size={14} color="#6B7280" />
        </div>
      </div>
    </div>
  );
}
