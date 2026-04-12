"use client";

import { Brain, LayoutDashboard, BookOpen, ClipboardList, MessageSquare, Calendar, BarChart3, Users, Settings, LogOut, ChevronLeft, ChevronRight, Zap } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { id: "toolkits", label: "Toolkits", icon: BookOpen, group: "main" },
  { id: "diagnostic", label: "Diagnostic", icon: ClipboardList, group: "main" },
  { id: "agent", label: "AI Agent", icon: MessageSquare, group: "main" },
  { id: "booking", label: "Book Session", icon: Calendar, group: "main" },
  { id: "results", label: "My Results", icon: BarChart3, group: "main" },
  { id: "admin", label: "Admin / CRM", icon: Users, group: "admin" },
  { id: "consultant", label: "Consultant Portal", icon: Brain, group: "admin" },
];

interface SidebarProps {
  activeView: string;
  setActiveView: (v: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  role: string;
}

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed, role }: SidebarProps) {
  return (
    <div
      style={{
        width: collapsed ? 64 : 240,
        minHeight: "100vh",
        backgroundColor: "#1A1F2E",
        borderRight: "1px solid #374151",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #374151", display: "flex", alignItems: "center", gap: 12 }}>
        <div
          className="agent-pulse"
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #3BC2FB, #007B5F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={18} color="#0F1419" fill="#0F1419" />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>INNOLEAD</div>
            <div style={{ fontSize: 10, color: "#3BC2FB", letterSpacing: 2, fontFamily: "Montserrat, sans-serif" }}>CEP PLATFORM</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {!collapsed && <div style={{ fontSize: 10, color: "#6B7280", padding: "0 16px 8px", letterSpacing: 1.5, fontFamily: "Montserrat, sans-serif" }}>MAIN</div>}
        {navItems.filter(n => n.group === "main").map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={active ? "nav-active" : ""}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "12px 14px" : "11px 16px",
                background: active ? undefined : "transparent",
                border: "none",
                cursor: "pointer",
                color: active ? "#3BC2FB" : "#9CA3AF",
                textAlign: "left",
                transition: "all 0.15s ease",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span style={{ fontSize: 13, fontFamily: "Roboto, sans-serif", fontWeight: active ? 500 : 400 }}>{item.label}</span>}
            </button>
          );
        })}

        {!collapsed && <div style={{ fontSize: 10, color: "#6B7280", padding: "16px 16px 8px", letterSpacing: 1.5, fontFamily: "Montserrat, sans-serif" }}>ADMIN</div>}
        {collapsed && <div style={{ margin: "8px 0", borderTop: "1px solid #374151" }} />}
        {navItems.filter(n => n.group === "admin").map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={active ? "nav-active" : ""}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "12px 14px" : "11px 16px",
                background: active ? undefined : "transparent",
                border: "none",
                cursor: "pointer",
                color: active ? "#3BC2FB" : "#9CA3AF",
                textAlign: "left",
                transition: "all 0.15s ease",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span style={{ fontSize: 13, fontFamily: "Roboto, sans-serif", fontWeight: active ? 500 : 400 }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid #374151", padding: "12px 0" }}>
        <button
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px 14px" : "10px 16px",
            background: "transparent", border: "none", cursor: "pointer",
            color: "#9CA3AF", justifyContent: collapsed ? "center" : "flex-start",
          }}
          title="Settings"
        >
          <Settings size={17} />
          {!collapsed && <span style={{ fontSize: 13 }}>Settings</span>}
        </button>
        <button
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px 14px" : "10px 16px",
            background: "transparent", border: "none", cursor: "pointer",
            color: "#9CA3AF", justifyContent: collapsed ? "center" : "flex-start",
          }}
          title="Logout"
        >
          <LogOut size={17} />
          {!collapsed && <span style={{ fontSize: 13 }}>Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "10px", background: "transparent", border: "none", cursor: "pointer",
            color: "#6B7280",
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );
}
