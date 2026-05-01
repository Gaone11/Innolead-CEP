"use client";

import { useState, useEffect } from "react";
import { Download, Star, Eye, Lock, Search, X, CheckCircle, FileText, Target, Shield, TrendingUp, Users, Lightbulb, Tag, Clock } from "lucide-react";

const toolkits = [
  { id: 1, title: "Strategy Execution Toolkit",      category: "Strategy",   icon: Target,    color: "var(--accent)", level: "Intermediate", downloads: 1240, rating: 4.8, pages: 48, description: "A comprehensive framework for translating strategic goals into operational outcomes. Includes planning templates, OKR frameworks, and execution dashboards.", tags: ["Strategy", "OKR", "Planning"], locked: false, aiRec: true,  preview: { summary: "This toolkit provides a structured approach to strategy execution used by 1,200+ organisations across Southern Africa.", sections: ["1. Strategic Context Assessment", "2. OKR Framework Setup", "3. Execution Sprint Planning", "4. Performance Dashboard Templates", "5. Governance & Accountability Matrix", "6. 90-Day Roadmap Builder"], keyTools: ["OKR Canvas", "Strategy Map Template", "Execution Sprint Board", "KPI Dashboard (Excel)"], outcome: "Organisations using this toolkit report a 43% improvement in strategy execution rates within 90 days." } },
  { id: 2, title: "Corporate Governance Framework",  category: "Governance", icon: Shield,    color: "#007B5F",        level: "Advanced",     downloads: 892,  rating: 4.9, pages: 64, description: "Board governance policies, committee charters, and compliance checklists aligned to Botswana Companies Act and NBFIRA requirements.",                    tags: ["Governance", "Compliance", "Board"], locked: false, aiRec: true,  preview: { summary: "A complete governance toolkit built specifically for Botswana and Southern African regulatory environments.", sections: ["1. Board Charter Template", "2. Committee Mandates", "3. Risk Management Framework", "4. Compliance Checklist (BCA 2003)", "5. NBFIRA Alignment Guide", "6. Audit Committee Policies"], keyTools: ["Board Charter Template", "Risk Register", "Compliance Tracker", "Meeting Minutes Template"], outcome: "Used by 18 listed companies in Botswana to achieve governance compliance within 60 days." } },
  { id: 3, title: "Change Management Playbook",      category: "Change",     icon: TrendingUp,color: "#FF9933",        level: "Beginner",     downloads: 2100, rating: 4.7, pages: 36, description: "A structured approach to leading organisational change. Includes stakeholder mapping, communication plans, and resistance management tools.",              tags: ["Change", "Leadership", "People"], locked: false, aiRec: false, preview: { summary: "The most downloaded toolkit on the platform — used across 40+ change initiatives in the region.", sections: ["1. Change Readiness Assessment", "2. Stakeholder Map", "3. Communication Plan Template", "4. Resistance Management Guide", "5. Change Champion Network", "6. Post-Change Sustainability"], keyTools: ["Stakeholder Map", "Communication Calendar", "Resistance Register", "Change Dashboard"], outcome: "Leaders using this playbook report 60% higher change adoption rates vs. unstructured approaches." } },
  { id: 4, title: "HR & Talent Maturity Assessment", category: "HR",         icon: Users,     color: "#8B5CF6",        level: "Intermediate", downloads: 680,  rating: 4.6, pages: 42, description: "Evaluate your HR capabilities across talent acquisition, development, and retention. Produces a maturity score with improvement roadmap.",                tags: ["HR", "Talent", "People"], locked: false, aiRec: false, preview: { summary: "A diagnostic tool that benchmarks your HR function against regional best practices.", sections: ["1. Talent Acquisition Assessment", "2. Learning & Development Audit", "3. Retention & Engagement Scorecard", "4. Succession Planning Framework", "5. HR Technology Maturity", "6. Improvement Roadmap"], keyTools: ["HR Maturity Scorecard", "Succession Planning Template", "L&D Budget Planner", "Engagement Survey"], outcome: "HR teams using this assessment reduce voluntary turnover by an average of 18% within 12 months." } },
  { id: 5, title: "Innovation & Digital Readiness",  category: "Innovation", icon: Lightbulb, color: "#F59E0B",        level: "Advanced",     downloads: 445,  rating: 4.5, pages: 52, description: "Assess your organisation's digital maturity and build an innovation pipeline. Includes technology mapping and transformation prioritisation tools.",    tags: ["Digital", "Innovation", "Technology"], locked: true, aiRec: false, preview: { summary: "Premium toolkit for organisations embarking on digital transformation journeys.", sections: ["1. Digital Maturity Assessment", "2. Technology Landscape Map", "3. Innovation Pipeline Builder", "4. Digital Investment Prioritisation", "5. Change & Adoption Planning", "6. Digital ROI Calculator"], keyTools: ["Digital Maturity Scorecard", "Tech Roadmap Template", "Innovation Canvas", "ROI Calculator"], outcome: "Used by 12 organisations in their digital transformation programmes across SADC." } },
  { id: 6, title: "Financial Governance Toolkit",    category: "Finance",    icon: Shield,    color: "#EF4444",        level: "Advanced",     downloads: 320,  rating: 4.7, pages: 58, description: "Financial controls, audit frameworks, and budget governance templates for SMEs and corporates operating in Southern Africa.",                          tags: ["Finance", "Audit", "Controls"], locked: true, aiRec: false, preview: { summary: "Financial governance tools designed for the Southern African regulatory environment.", sections: ["1. Financial Controls Framework", "2. Internal Audit Checklist", "3. Budget Governance Policy", "4. Treasury Management", "5. BURS Compliance Guide", "6. Financial Risk Register"], keyTools: ["Internal Controls Checklist", "Budget Template", "Financial Risk Register", "Treasury Policy"], outcome: "Organisations using this toolkit reduce audit findings by 65% on average." } },
];

const categories = ["All", "Strategy", "Governance", "Change", "HR", "Innovation", "Finance"];

interface DownloadState { progress: number; done: boolean; }
interface PreviewModal  { toolkit: typeof toolkits[0] | null; }

export default function ToolkitsView() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch]                     = useState("");
  const [downloadStates, setDownloadStates]     = useState<Record<number, DownloadState>>({});
  const [preview, setPreview]                   = useState<PreviewModal>({ toolkit: null });

  const filtered = toolkits.filter(t => {
    const matchCat    = selectedCategory === "All" || t.category === selectedCategory;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  function startDownload(id: number) {
    if (downloadStates[id]?.done) return;
    setDownloadStates(prev => ({ ...prev, [id]: { progress: 0, done: false } }));
  }

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    Object.entries(downloadStates).forEach(([idStr, state]) => {
      const id = Number(idStr);
      if (!state.done && state.progress < 100) {
        const t = setTimeout(() => {
          setDownloadStates(prev => {
            const cur = prev[id];
            if (!cur || cur.done) return prev;
            const next = Math.min(cur.progress + Math.random() * 25 + 10, 100);
            return { ...prev, [id]: { progress: next, done: next >= 100 } };
          });
        }, 150);
        timers.push(t);
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [downloadStates]);

  const isDownloaded  = (id: number) => downloadStates[id]?.done === true;
  const isDownloading = (id: number) => downloadStates[id] && !downloadStates[id].done;

  return (
    <div className="fade-in-up">
      {/* AI Banner */}
      <div style={{ background: `rgba(var(--accent-rgb),0.06)`, border: `1px solid rgba(var(--accent-rgb),0.2)`, borderRadius: 14, padding: "14px 20px", marginBottom: 22, display: "flex", alignItems: "center", gap: 14 }}>
        <div className="agent-pulse" style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 13, color: "var(--text-primary)" }}>
          <span style={{ color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>AI RECOMMENDATION — </span>
          Based on your diagnostic score, the <strong style={{ color: "var(--text-heading)" }}>Strategy Execution Toolkit</strong> and <strong style={{ color: "var(--text-heading)" }}>Corporate Governance Framework</strong> are your highest-priority downloads.
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "var(--bg-card)", borderRadius: 10, padding: "8px 14px", border: "1px solid var(--border)", flex: "1 1 260px", maxWidth: 340, boxShadow: "var(--card-shadow)" }}>
          <Search size={14} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search toolkits..." style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, width: "100%" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><X size={13} /></button>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "7px 14px", borderRadius: 8, border: selectedCategory === cat ? `1px solid var(--accent)` : "1px solid var(--border)", background: selectedCategory === cat ? `rgba(var(--accent-rgb),0.08)` : "var(--bg-card)", color: selectedCategory === cat ? "var(--accent)" : "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {filtered.map(toolkit => {
          const Icon     = toolkit.icon;
          const dl       = downloadStates[toolkit.id];
          const done     = isDownloaded(toolkit.id);
          const loading  = isDownloading(toolkit.id);
          const isAccent = toolkit.color === "var(--accent)";

          return (
            <div key={toolkit.id} className="card-hover" style={{ backgroundColor: "var(--bg-card)", border: toolkit.aiRec ? `1px solid rgba(var(--accent-rgb),0.3)` : "1px solid var(--border)", borderRadius: 14, padding: 22, position: "relative", opacity: toolkit.locked ? 0.8 : 1, boxShadow: "var(--card-shadow)" }}>
              {toolkit.aiRec && (
                <div style={{ position: "absolute", top: 14, right: 14, background: "linear-gradient(135deg, var(--accent), #007B5F)", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>AI PICK</div>
              )}
              {toolkit.locked && (
                <div style={{ position: "absolute", top: 14, right: 14, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "var(--text-secondary)", fontFamily: "Montserrat, sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  <Lock size={10} /> PRO
                </div>
              )}

              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: isAccent ? `rgba(var(--accent-rgb),0.1)` : `${toolkit.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, border: isAccent ? `1px solid rgba(var(--accent-rgb),0.25)` : `1px solid ${toolkit.color}30` }}>
                <Icon size={24} color={toolkit.color} />
              </div>

              <h3 style={{ margin: "0 0 8px", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.3 }}>{toolkit.title}</h3>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{toolkit.description}</p>

              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {toolkit.tags.map(tag => (
                  <span key={tag} style={{ padding: "3px 8px", borderRadius: 6, backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)" }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}><Star size={12} color="#F59E0B" fill="#F59E0B" /> {toolkit.rating}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}><Download size={12} /> {done ? toolkit.downloads + 1 : toolkit.downloads}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}><FileText size={12} /> {toolkit.pages}p</div>
                <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: 5, fontSize: 11, color: toolkit.level === "Advanced" ? "#EF4444" : toolkit.level === "Intermediate" ? "#F59E0B" : "#007B5F", backgroundColor: toolkit.level === "Advanced" ? "#EF444418" : toolkit.level === "Intermediate" ? "#F59E0B18" : "#007B5F18" }}>{toolkit.level}</span>
              </div>

              {loading && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
                    <span>Downloading...</span><span>{Math.round(dl.progress)}%</span>
                  </div>
                  <div style={{ height: 4, backgroundColor: "var(--bg-elevated)", borderRadius: 2 }}>
                    <div className="progress-bar" style={{ width: `${dl.progress}%`, height: "100%" }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                {toolkit.locked ? (
                  <button style={{ flex: 1, padding: "10px", borderRadius: 9, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Lock size={14} /> Upgrade to Access
                  </button>
                ) : (
                  <>
                    <button onClick={() => !done && !loading && startDownload(toolkit.id)} className={done || loading ? "" : "btn-primary"}
                      style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: done ? "default" : loading ? "not-allowed" : "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: done ? "rgba(34,197,94,0.12)" : loading ? "var(--bg-elevated)" : undefined, color: done ? "#22C55E" : loading ? "var(--text-muted)" : undefined, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      {done ? <><CheckCircle size={14} /> Downloaded</> : loading ? <><Clock size={14} /> Downloading...</> : <><Download size={14} /> Download</>}
                    </button>
                    <button onClick={() => setPreview({ toolkit })} style={{ padding: "10px 14px", borderRadius: 9, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Preview">
                      <Eye size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {preview.toolkit && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setPreview({ toolkit: null })}>
          <div className="fade-in-up" style={{ width: 640, maxHeight: "85vh", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, boxShadow: "0 30px 80px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
            {(() => {
              const t       = preview.toolkit!;
              const Icon    = t.icon;
              const done    = isDownloaded(t.id);
              const isAcc   = t.color === "var(--accent)";
              return (
                <>
                  <div style={{ padding: "22px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: isAcc ? `rgba(var(--accent-rgb),0.1)` : `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center", border: isAcc ? `1px solid rgba(var(--accent-rgb),0.25)` : `1px solid ${t.color}30`, flexShrink: 0 }}>
                      <Icon size={26} color={t.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ margin: "0 0 4px", fontFamily: "Montserrat, sans-serif", fontSize: 17 }}>{t.title}</h2>
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={11} color="#F59E0B" fill="#F59E0B" /> {t.rating}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FileText size={11} /> {t.pages} pages</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Download size={11} /> {t.downloads} downloads</span>
                        <span style={{ color: t.level === "Advanced" ? "#EF4444" : t.level === "Intermediate" ? "#F59E0B" : "#007B5F" }}>{t.level}</span>
                      </div>
                    </div>
                    <button onClick={() => setPreview({ toolkit: null })} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}><X size={16} /></button>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
                    <div style={{ backgroundColor: "var(--bg-elevated)", borderRadius: 12, padding: 16, marginBottom: 20, border: isAcc ? `1px solid rgba(var(--accent-rgb),0.15)` : `1px solid ${t.color}20` }}>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>{t.preview.summary}</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                      <div>
                        <h4 style={{ margin: "0 0 12px", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>TABLE OF CONTENTS</h4>
                        {t.preview.sections.map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                            <span style={{ fontSize: 12, color: t.color, fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>{i + 1}</span>
                            <span style={{ fontSize: 12, color: "var(--text-primary)" }}>{s.replace(/^\d+\.\s/, "")}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 12px", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>INCLUDED TOOLS</h4>
                        {t.preview.keyTools.map((tool, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                            <Tag size={12} color={t.color} />
                            <span style={{ fontSize: 12, color: "var(--text-primary)" }}>{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ backgroundColor: isAcc ? `rgba(var(--accent-rgb),0.06)` : `${t.color}08`, border: isAcc ? `1px solid rgba(var(--accent-rgb),0.15)` : `1px solid ${t.color}20`, borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: t.color, fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: 6 }}>PROVEN OUTCOME</div>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>{t.preview.outcome}</p>
                    </div>
                  </div>

                  <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", gap: 12 }}>
                    <button onClick={() => setPreview({ toolkit: null })} style={{ padding: "10px 20px", borderRadius: 9, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13 }}>Close</button>
                    {!t.locked && (
                      <button onClick={() => { startDownload(t.id); setPreview({ toolkit: null }); }} className={done ? "" : "btn-primary"}
                        style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: done ? "default" : "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: done ? "rgba(34,197,94,0.12)" : undefined, color: done ? "#22C55E" : undefined, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        {done ? <><CheckCircle size={15} /> Downloaded</> : <><Download size={15} /> Download Toolkit</>}
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
