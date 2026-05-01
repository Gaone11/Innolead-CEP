"use client";

import { useState } from "react";
import { Bell, Search, ChevronDown, Cpu } from "lucide-react";
import NotificationPanel, { Notification } from "./NotificationPanel";
import UserMenu from "./UserMenu";

const viewTitles: Record<string, { title: string; sub: string }> = {
  dashboard:  { title: "Client Dashboard",      sub: "Your consulting journey at a glance"         },
  toolkits:   { title: "Toolkit Explorer",      sub: "Browse and download consulting toolkits"     },
  diagnostic: { title: "Diagnostic Assessment", sub: "Understand your organisation's maturity"    },
  agent:      { title: "AI Guidance Agent",     sub: "Your intelligent consulting assistant"       },
  booking:    { title: "Book a Session",        sub: "Schedule time with expert consultants"       },
  results:    { title: "My Results",            sub: "Scores, insights and recommendations"        },
  admin:      { title: "Admin & CRM",           sub: "Lead management and analytics"              },
  consultant: { title: "Consultant Portal",     sub: "Briefing notes and client context"          },
};

interface HeaderProps {
  activeView: string;
  sidebarCollapsed: boolean;
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onClearNotification: (id: number) => void;
  onClearAllNotifications: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  setActiveView: (v: string) => void;
  role: string;
  setRole: (r: string) => void;
}

export default function Header({
  activeView, sidebarCollapsed, notifications,
  onMarkRead, onMarkAllRead, onClearNotification, onClearAllNotifications,
  onOpenSearch, onOpenSettings, onSignOut, setActiveView, role, setRole,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen]   = useState(false);
  const info   = viewTitles[activeView] || { title: "Platform", sub: "" };
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{
      height: 64,
      backgroundColor: "var(--bg-card)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px",
      position: "fixed", top: 0,
      left: sidebarCollapsed ? 64 : 240, right: 0, zIndex: 30,
      transition: "left 0.3s ease",
      boxShadow: "var(--card-shadow)",
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 17, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)" }}>{info.title}</h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>{info.sub}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Search */}
        <button
          onClick={onOpenSearch}
          style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "var(--bg-elevated)", borderRadius: 8, padding: "7px 14px", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-muted)", minWidth: 180 }}
        >
          <Search size={14} />
          <span style={{ fontSize: 13, flex: 1, textAlign: "left" }}>Search...</span>
          <kbd style={{ fontSize: 10, padding: "2px 5px", borderRadius: 4, backgroundColor: "var(--border)", color: "var(--text-muted)" }}>⌘K</kbd>
        </button>

        {/* AI Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: `rgba(var(--accent-rgb),0.08)`, borderRadius: 8, padding: "6px 12px", border: `1px solid rgba(var(--accent-rgb),0.2)` }}>
          <div className="agent-pulse" style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
          <Cpu size={13} color="var(--accent)" />
          <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>AI Active</span>
        </div>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setUserOpen(false); }}
            style={{ position: "relative", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
          >
            <Bell size={17} />
            {unread > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--accent)", border: "2px solid var(--bg-card)" }} />
            )}
          </button>
          {notifOpen && (
            <NotificationPanel
              notifications={notifications}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onClear={onClearNotification}
              onClearAll={onClearAllNotifications}
              onClose={() => setNotifOpen(false)}
              setActiveView={(v) => { setActiveView(v); setNotifOpen(false); }}
            />
          )}
        </div>

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setUserOpen(o => !o); setNotifOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "none", border: "none", padding: "4px 6px", borderRadius: 8 }}
          >
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), #007B5F)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>
              JD
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-heading)" }}>James Doe</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>{role}</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>
          {userOpen && (
            <UserMenu
              onClose={() => setUserOpen(false)}
              onSettings={onOpenSettings}
              onSignOut={onSignOut}
              onNavigate={setActiveView}
              role={role}
              setRole={setRole}
            />
          )}
        </div>
      </div>
    </div>
  );
}
