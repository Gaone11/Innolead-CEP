"use client";

import { useEffect, useRef } from "react";
import { X, Brain, Calendar, BarChart3, AlertCircle, CheckCircle, Download, Trash2 } from "lucide-react";

export interface Notification {
  id: number;
  type: "agent" | "booking" | "diagnostic" | "lead" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: string;
  view?: string;
}

const typeConfig = {
  agent:      { icon: Brain,       color: "var(--accent)",  bg: "rgba(var(--accent-rgb),0.1)" },
  booking:    { icon: Calendar,    color: "#007B5F",        bg: "rgba(0,123,95,0.1)"          },
  diagnostic: { icon: BarChart3,   color: "#FF9933",        bg: "rgba(255,153,51,0.1)"        },
  lead:       { icon: AlertCircle, color: "#EF4444",        bg: "rgba(239,68,68,0.1)"         },
  system:     { icon: CheckCircle, color: "#8B5CF6",        bg: "rgba(139,92,246,0.1)"        },
};

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onClear: (id: number) => void;
  onClearAll: () => void;
  onClose: () => void;
  setActiveView: (v: string) => void;
}

export default function NotificationPanel({
  notifications, onMarkRead, onMarkAllRead, onClear, onClearAll, onClose, setActiveView,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="fade-in-up"
      style={{
        position: "absolute", top: 56, right: 0, width: 380, zIndex: 100,
        backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "16px 18px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text-heading)" }}>
            Notifications
          </span>
          {unread > 0 && (
            <span style={{
              padding: "2px 8px", borderRadius: 20, fontSize: 11,
              background: "var(--accent)", color: "#ffffff",
              fontFamily: "Montserrat, sans-serif", fontWeight: 700,
            }}>
              {unread} new
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{
                fontSize: 11, color: "var(--accent)", background: "none", border: "none",
                cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600,
              }}
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              style={{
                fontSize: 11, color: "var(--text-muted)", background: "none", border: "none",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <Trash2 size={12} /> Clear all
            </button>
          )}
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 420, overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <CheckCircle size={32} color="var(--border)" style={{ margin: "0 auto 12px", display: "block" }} />
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>All caught up!</div>
          </div>
        ) : (
          notifications.map(notif => {
            const cfg = typeConfig[notif.type];
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkRead(notif.id);
                  if (notif.view) { setActiveView(notif.view); onClose(); }
                }}
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid var(--bg-elevated)",
                  cursor: "pointer",
                  backgroundColor: notif.read ? "transparent" : "rgba(var(--accent-rgb),0.04)",
                  display: "flex", gap: 12, alignItems: "flex-start",
                  transition: "background 0.15s",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  backgroundColor: cfg.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{
                      fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                      color: notif.read ? "var(--text-secondary)" : "var(--text-heading)",
                    }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0, marginTop: 4 }} />
                    )}
                  </div>
                  <p style={{ margin: "0 0 5px", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{notif.time}</span>
                    {notif.action && (
                      <span style={{ fontSize: 11, color: cfg.color, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                        {notif.action} →
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onClear(notif.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 4, flexShrink: 0 }}
                >
                  <X size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <button style={{
            fontSize: 12, color: "var(--accent)", background: "none", border: "none",
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600,
          }}>
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
