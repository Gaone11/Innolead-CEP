"use client";

import { Brain, LayoutDashboard, BookOpen, ClipboardList, MessageSquare, Calendar, BarChart3, Users, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { id: "dashboard",  label: "Dashboard",        icon: LayoutDashboard, group: "main"  },
  { id: "toolkits",   label: "Toolkits",         icon: BookOpen,        group: "main"  },
  { id: "diagnostic", label: "Diagnostic",       icon: ClipboardList,   group: "main"  },
  { id: "agent",      label: "AI Agent",         icon: MessageSquare,   group: "main"  },
  { id: "booking",    label: "Book Session",     icon: Calendar,        group: "main"  },
  { id: "results",    label: "My Results",       icon: BarChart3,       group: "main"  },
  { id: "admin",      label: "Admin / CRM",      icon: Users,           group: "admin" },
  { id: "consultant", label: "Consultant Portal",icon: Brain,           group: "admin" },
];

interface SidebarProps {
  activeView: string;
  setActiveView: (v: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  role: string;
  onSignOut: () => void;
  onSettings: () => void;
}

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed, role, onSignOut, onSettings }: SidebarProps) {
  return (
    <div
      style={{
        width: collapsed ? 64 : 240,
        minHeight: "100vh",
        backgroundColor: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 40,
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
        {/* Logo image in a white container so it looks good in both themes */}
        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#fff", border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <img
            src="/Innolead-CEP/innolead-logo.png"
            alt="Innolead"
            style={{ width: "90%", height: "90%", objectFit: "contain" }}
          />
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13, color: "var(--text-heading)", lineHeight: 1.2, whiteSpace: "nowrap" }}>INNOLEAD</div>
            <div style={{ fontSize: 9, color: "var(--accent)", letterSpacing: 2, fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap" }}>CEP PLATFORM</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {!collapsed && (
          <div style={{ fontSize: 10, color: "var(--text-muted)", padding: "0 16px 8px", letterSpacing: 1.5, fontFamily: "Montserrat, sans-serif" }}>MAIN</div>
        )}
        {navItems.filter(n => n.group === "main").map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={active ? "nav-active" : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "12px 14px" : "11px 16px",
                background: active ? undefined : "transparent",
                border: "none", cursor: "pointer",
                color: active ? "var(--accent)" : "var(--text-secondary)",
                textAlign: "left", transition: "all 0.15s ease",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && (
                <span style={{ fontSize: 13, fontFamily: "Roboto, sans-serif", fontWeight: active ? 500 : 400 }}>{item.label}</span>
              )}
            </button>
          );
        })}

        {!collapsed && (
          <div style={{ fontSize: 10, color: "var(--text-muted)", padding: "16px 16px 8px", letterSpacing: 1.5, fontFamily: "Montserrat, sans-serif" }}>ADMIN</div>
        )}
        {collapsed && <div style={{ margin: "8px 0", borderTop: "1px solid var(--border)" }} />}
        {navItems.filter(n => n.group === "admin").map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={active ? "nav-active" : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "12px 14px" : "11px 16px",
                background: active ? undefined : "transparent",
                border: "none", cursor: "pointer",
                color: active ? "var(--accent)" : "var(--text-secondary)",
                textAlign: "left", transition: "all 0.15s ease",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && (
                <span style={{ fontSize: 13, fontFamily: "Roboto, sans-serif", fontWeight: active ? 500 : 400 }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "12px 0" }}>
        <button
          onClick={onSettings}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px 14px" : "10px 16px",
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-secondary)", justifyContent: collapsed ? "center" : "flex-start",
            transition: "color 0.15s",
          }}
          title="Settings"
        >
          <Settings size={17} />
          {!collapsed && <span style={{ fontSize: 13 }}>Settings</span>}
        </button>
        <button
          onClick={onSignOut}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px 14px" : "10px 16px",
            background: "transparent", border: "none", cursor: "pointer",
            color: "#EF4444", justifyContent: collapsed ? "center" : "flex-start",
            transition: "color 0.15s",
          }}
          title="Sign Out"
        >
          <LogOut size={17} />
          {!collapsed && <span style={{ fontSize: 13 }}>Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "10px", background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-muted)",
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );
}
