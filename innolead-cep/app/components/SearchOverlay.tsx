"use client";

import { useEffect, useRef, useState } from "react";
import { Search, BookOpen, ClipboardList, Calendar, BarChart3, Users, Brain, X, ArrowRight } from "lucide-react";

const searchIndex = [
  { id: "t1", type: "toolkit", title: "Strategy Execution Toolkit", desc: "OKR frameworks, execution dashboards, planning templates", view: "toolkits", tags: ["strategy", "okr", "planning"] },
  { id: "t2", type: "toolkit", title: "Corporate Governance Framework", desc: "Board governance policies and compliance checklists", view: "toolkits", tags: ["governance", "board", "compliance"] },
  { id: "t3", type: "toolkit", title: "Change Management Playbook", desc: "Stakeholder mapping, communication plans, resistance tools", view: "toolkits", tags: ["change", "leadership"] },
  { id: "t4", type: "toolkit", title: "HR & Talent Maturity Assessment", desc: "Evaluate talent acquisition, development and retention", view: "toolkits", tags: ["hr", "talent", "people"] },
  { id: "d1", type: "view", title: "Diagnostic Assessment", desc: "Take your 4-section organisational maturity diagnostic", view: "diagnostic", tags: ["diagnostic", "assessment", "maturity"] },
  { id: "d2", type: "view", title: "My Results", desc: "View your scores, insights and AI recommendations", view: "results", tags: ["results", "score", "recommendations"] },
  { id: "b1", type: "view", title: "Book a Session", desc: "Schedule time with a consultant", view: "booking", tags: ["booking", "consultant", "session", "workshop"] },
  { id: "a1", type: "view", title: "AI Guidance Agent", desc: "Chat with your AI consulting assistant", view: "agent", tags: ["ai", "agent", "chat", "guidance"] },
  { id: "ad1", type: "view", title: "Admin / CRM Dashboard", desc: "Lead pipeline, scoring and conversion analytics", view: "admin", tags: ["admin", "crm", "leads", "analytics"] },
  { id: "c1", type: "view", title: "Consultant Portal", desc: "AI briefing notes and upcoming sessions", view: "consultant", tags: ["consultant", "briefing", "sessions"] },
  { id: "r1", type: "action", title: "Run Governance Diagnostic", desc: "Start a targeted governance assessment", view: "diagnostic", tags: ["governance", "diagnostic"] },
  { id: "r2", type: "action", title: "Book Strategy Workshop", desc: "Schedule a 2-day strategy execution workshop", view: "booking", tags: ["strategy", "workshop", "booking"] },
  { id: "r3", type: "action", title: "View Execution Score", desc: "See your execution capability results", view: "results", tags: ["execution", "score", "results"] },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string; isAccent?: boolean }> = {
  toolkit: { icon: BookOpen,   color: "var(--accent)", label: "Toolkit", isAccent: true },
  view:    { icon: BarChart3,  color: "#007B5F",       label: "View"                    },
  action:  { icon: ArrowRight, color: "#FF9933",       label: "Action"                  },
};

interface SearchOverlayProps {
  onClose: () => void;
  setActiveView: (v: string) => void;
}

export default function SearchOverlay({ onClose, setActiveView }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelected(s => Math.min(s + 1, results.length - 1));
      if (e.key === "ArrowUp") setSelected(s => Math.max(s - 1, 0));
      if (e.key === "Enter" && results[selected]) {
        setActiveView(results[selected].view);
        onClose();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const results = query.trim().length < 1 ? searchIndex.slice(0, 6) : searchIndex.filter(item => {
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.tags.some(t => t.includes(q));
  });

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: 120,
      }}
      onClick={onClose}
    >
      <div
        className="fade-in-up"
        style={{
          width: 600, backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 16,
          boxShadow: "0 30px 80px rgba(0,0,0,0.2)", overflow: "hidden",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px", borderBottom: "1px solid var(--border)",
        }}>
          <Search size={18} color="var(--accent)" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search toolkits, views, actions..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 16, color: "var(--text-heading)", fontFamily: "Roboto, sans-serif",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={16} />
            </button>
          )}
          <kbd style={{
            padding: "3px 8px", borderRadius: 6, fontSize: 11,
            backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)",
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {query.length === 0 && (
            <div style={{ padding: "10px 20px 6px", fontSize: 11, color: "var(--text-muted)", fontFamily: "Montserrat, sans-serif", letterSpacing: 1 }}>
              QUICK NAVIGATE
            </div>
          )}
          {results.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No results for "{query}"
            </div>
          ) : (
            results.map((item, i) => {
              const cfg = typeConfig[item.type];
              const Icon = cfg.icon;
              const isSelected = i === selected;
              const iconBg = cfg.isAccent ? "rgba(var(--accent-rgb),0.1)" : `${cfg.color}18`;
              const badgeBg = cfg.isAccent ? "rgba(var(--accent-rgb),0.1)" : `${cfg.color}18`;
              return (
                <div
                  key={item.id}
                  onClick={() => { setActiveView(item.view); onClose(); }}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    padding: "12px 20px", cursor: "pointer",
                    backgroundColor: isSelected ? "rgba(var(--accent-rgb),0.06)" : "transparent",
                    borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "all 0.1s",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    backgroundColor: iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} color={cfg.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: "var(--text-heading)", fontWeight: 500, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 5, flexShrink: 0,
                    backgroundColor: badgeBg, color: cfg.color,
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                  }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 16, fontSize: 11, color: "var(--text-faint)" }}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>ESC close</span>
        </div>
      </div>
    </div>
  );
}
