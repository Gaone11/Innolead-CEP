"use client";

import { useEffect, useRef } from "react";
import { User, Settings, LogOut, Shield, ChevronRight, Building2, Bell } from "lucide-react";

interface UserMenuProps {
  onClose: () => void;
  onSettings: () => void;
  onSignOut: () => void;
  onNavigate: (v: string) => void;
  role: string;
  setRole: (r: string) => void;
}

const roles = [
  { id: "client",     label: "Client",       color: "var(--accent)" },
  { id: "consultant", label: "Consultant",    color: "#007B5F"       },
  { id: "admin",      label: "Administrator", color: "#FF9933"       },
];

export default function UserMenu({ onClose, onSettings, onSignOut, onNavigate, role, setRole }: UserMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const currentRole = roles.find(r => r.id === role) || roles[0];
  const isAccentRole = (color: string) => color === "var(--accent)";

  return (
    <div
      ref={ref}
      className="fade-in-up"
      style={{
        position: "absolute", top: 56, right: 0, width: 280, zIndex: 100,
        backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 14, boxShadow: "var(--card-shadow)",
        overflow: "hidden",
      }}
    >
      {/* Profile header */}
      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), #007B5F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: "#ffffff",
          }}>
            JD
          </div>
          <div>
            <div style={{ fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)" }}>James Doe</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>james.doe@acme.co.bw</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{
            padding: "3px 10px", borderRadius: 6, fontSize: 11,
            backgroundColor: isAccentRole(currentRole.color) ? "rgba(var(--accent-rgb),0.1)" : `${currentRole.color}18`,
            color: currentRole.color,
            fontFamily: "Montserrat, sans-serif", fontWeight: 700,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <Shield size={11} /> {currentRole.label}
          </div>
          <div style={{
            padding: "3px 10px", borderRadius: 6, fontSize: 11,
            backgroundColor: "rgba(0,123,95,0.1)", color: "#007B5F",
            fontFamily: "Montserrat, sans-serif", fontWeight: 600,
          }}>
            Acme Corp
          </div>
        </div>
      </div>

      {/* Switch role */}
      <div style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
        <div style={{ padding: "4px 18px 8px", fontSize: 10, color: "var(--text-muted)", fontFamily: "Montserrat, sans-serif", letterSpacing: 1 }}>
          SWITCH ROLE (DEMO)
        </div>
        {roles.map(r => (
          <button
            key={r.id}
            onClick={() => { setRole(r.id); onClose(); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 18px", background: "none", border: "none", cursor: "pointer",
              color: role === r.id ? r.color : "var(--text-secondary)",
              backgroundColor: role === r.id
                ? (isAccentRole(r.color) ? "rgba(var(--accent-rgb),0.06)" : `${r.color}08`)
                : "transparent",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 13 }}>{r.label}</span>
            {role === r.id && <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: r.color }} />}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
        {[
          { icon: User,       label: "My Profile",        action: () => {} },
          { icon: Building2,  label: "Organisation",      action: () => {} },
          { icon: Bell,       label: "Notification Prefs", action: () => {} },
          { icon: Settings,   label: "Platform Settings", action: () => { onSettings(); onClose(); } },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
                color: "var(--text-secondary)", transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={15} />
                <span style={{ fontSize: 13 }}>{item.label}</span>
              </div>
              <ChevronRight size={13} color="var(--text-faint)" />
            </button>
          );
        })}
      </div>

      {/* Sign out */}
      <div style={{ padding: "8px 0" }}>
        <button
          onClick={() => { onSignOut(); onClose(); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
            color: "#EF4444", transition: "all 0.15s",
          }}
        >
          <LogOut size={15} />
          <span style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
