"use client";

import { useState } from "react";
import { Download, Star, Eye, Lock, Tag, TrendingUp, Shield, Users, Lightbulb, Target, ArrowRight, Search, Filter } from "lucide-react";

const toolkits = [
  {
    id: 1,
    title: "Strategy Execution Toolkit",
    category: "Strategy",
    icon: Target,
    color: "#3BC2FB",
    level: "Intermediate",
    downloads: 1240,
    rating: 4.8,
    pages: 48,
    description: "A comprehensive framework for translating strategic goals into operational outcomes. Includes planning templates, OKR frameworks, and execution dashboards.",
    tags: ["Strategy", "OKR", "Planning"],
    locked: false,
    downloaded: true,
    aiRec: true,
  },
  {
    id: 2,
    title: "Corporate Governance Framework",
    category: "Governance",
    icon: Shield,
    color: "#007B5F",
    level: "Advanced",
    downloads: 892,
    rating: 4.9,
    pages: 64,
    description: "Board governance policies, committee charters, and compliance checklists aligned to Botswana Companies Act and NBFIRA requirements.",
    tags: ["Governance", "Compliance", "Board"],
    locked: false,
    downloaded: true,
    aiRec: true,
  },
  {
    id: 3,
    title: "Change Management Playbook",
    category: "Change",
    icon: TrendingUp,
    color: "#FF9933",
    level: "Beginner",
    downloads: 2100,
    rating: 4.7,
    pages: 36,
    description: "A structured approach to leading organisational change. Includes stakeholder mapping, communication plans, and resistance management tools.",
    tags: ["Change", "Leadership", "People"],
    locked: false,
    downloaded: false,
    aiRec: false,
  },
  {
    id: 4,
    title: "HR & Talent Maturity Assessment",
    category: "HR",
    icon: Users,
    color: "#8B5CF6",
    level: "Intermediate",
    downloads: 680,
    rating: 4.6,
    pages: 42,
    description: "Evaluate your HR capabilities across talent acquisition, development, and retention. Produces a maturity score with improvement roadmap.",
    tags: ["HR", "Talent", "People"],
    locked: false,
    downloaded: false,
    aiRec: false,
  },
  {
    id: 5,
    title: "Innovation & Digital Readiness",
    category: "Innovation",
    icon: Lightbulb,
    color: "#F59E0B",
    level: "Advanced",
    downloads: 445,
    rating: 4.5,
    pages: 52,
    description: "Assess your organisation's digital maturity and build an innovation pipeline. Includes technology mapping and transformation prioritisation tools.",
    tags: ["Digital", "Innovation", "Technology"],
    locked: true,
    downloaded: false,
    aiRec: false,
  },
  {
    id: 6,
    title: "Financial Governance Toolkit",
    category: "Finance",
    icon: Shield,
    color: "#EF4444",
    level: "Advanced",
    downloads: 320,
    rating: 4.7,
    pages: 58,
    description: "Financial controls, audit frameworks, and budget governance templates for SMEs and corporates operating in Southern Africa.",
    tags: ["Finance", "Audit", "Controls"],
    locked: true,
    downloaded: false,
    aiRec: false,
  },
];

const categories = ["All", "Strategy", "Governance", "Change", "HR", "Innovation", "Finance"];

export default function ToolkitsView() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [downloadedIds, setDownloadedIds] = useState<number[]>([1, 2]);

  const filtered = toolkits.filter(t => {
    const matchCat = selectedCategory === "All" || t.category === selectedCategory;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="fade-in-up">
      {/* AI Recommendation Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(59,194,251,0.1), rgba(0,123,95,0.08))",
        border: "1px solid rgba(59,194,251,0.25)",
        borderRadius: 14,
        padding: "16px 22px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <div className="agent-pulse" style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3BC2FB", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12, color: "#3BC2FB", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>AI RECOMMENDATION — </span>
          <span style={{ fontSize: 13, color: "#E5E7EB" }}>
            Based on your diagnostic score, the <strong style={{ color: "#fff" }}>Strategy Execution Toolkit</strong> and <strong style={{ color: "#fff" }}>Corporate Governance Framework</strong> are your highest-priority downloads.
          </span>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(59,194,251,0.15)", border: "1px solid rgba(59,194,251,0.3)",
          borderRadius: 8, padding: "6px 14px", cursor: "pointer",
          color: "#3BC2FB", fontSize: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          View Insights <ArrowRight size={12} />
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 14, marginBottom: 22, alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          backgroundColor: "#1A1F2E", borderRadius: 10, padding: "8px 14px",
          border: "1px solid #374151", flex: 1, maxWidth: 340,
        }}>
          <Search size={14} color="#6B7280" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search toolkits..."
            style={{ background: "transparent", border: "none", outline: "none", color: "#E5E7EB", fontSize: 13, width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: selectedCategory === cat ? "1px solid #3BC2FB" : "1px solid #374151",
                background: selectedCategory === cat ? "rgba(59,194,251,0.12)" : "#1A1F2E",
                color: selectedCategory === cat ? "#3BC2FB" : "#9CA3AF",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {filtered.map(toolkit => {
          const Icon = toolkit.icon;
          const isDownloaded = downloadedIds.includes(toolkit.id);

          return (
            <div
              key={toolkit.id}
              className="card-hover"
              style={{
                backgroundColor: "#1A1F2E",
                border: `1px solid ${toolkit.aiRec ? "rgba(59,194,251,0.3)" : "#374151"}`,
                borderRadius: 14,
                padding: 22,
                position: "relative",
                opacity: toolkit.locked ? 0.75 : 1,
              }}
            >
              {/* AI Badge */}
              {toolkit.aiRec && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "linear-gradient(135deg, #3BC2FB, #007B5F)",
                  borderRadius: 6, padding: "3px 8px",
                  fontSize: 10, color: "#0F1419", fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                }}>
                  AI PICK
                </div>
              )}
              {toolkit.locked && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "#252B3A",
                  border: "1px solid #374151",
                  borderRadius: 6, padding: "3px 8px",
                  fontSize: 10, color: "#9CA3AF", fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Lock size={10} /> PRO
                </div>
              )}

              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: `${toolkit.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16, border: `1px solid ${toolkit.color}30`,
              }}>
                <Icon size={24} color={toolkit.color} />
              </div>

              {/* Title */}
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                {toolkit.title}
              </h3>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                {toolkit.description}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {toolkit.tags.map(tag => (
                  <span key={tag} style={{
                    padding: "3px 8px", borderRadius: 6,
                    backgroundColor: "#252B3A", border: "1px solid #374151",
                    fontSize: 11, color: "#6B7280",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9CA3AF" }}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" /> {toolkit.rating}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9CA3AF" }}>
                  <Download size={12} /> {toolkit.downloads.toLocaleString()}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9CA3AF" }}>
                  <Eye size={12} /> {toolkit.pages}p
                </div>
                <span style={{
                  marginLeft: "auto",
                  padding: "2px 8px", borderRadius: 5,
                  fontSize: 11, color: toolkit.level === "Advanced" ? "#EF4444" : toolkit.level === "Intermediate" ? "#F59E0B" : "#007B5F",
                  backgroundColor: toolkit.level === "Advanced" ? "#EF444418" : toolkit.level === "Intermediate" ? "#F59E0B18" : "#007B5F18",
                }}>
                  {toolkit.level}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                {toolkit.locked ? (
                  <button style={{
                    flex: 1, padding: "10px", borderRadius: 9,
                    background: "#252B3A", border: "1px solid #374151",
                    color: "#9CA3AF", cursor: "pointer", fontSize: 13,
                    fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <Lock size={14} /> Upgrade to Access
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setDownloadedIds(prev => [...new Set([...prev, toolkit.id])])}
                      className="btn-primary"
                      style={{
                        flex: 1, padding: "10px", borderRadius: 9, border: "none",
                        cursor: "pointer", fontSize: 13,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      <Download size={14} />
                      {isDownloaded ? "Downloaded" : "Download"}
                    </button>
                    <button style={{
                      padding: "10px 14px", borderRadius: 9,
                      background: "#252B3A", border: "1px solid #374151",
                      color: "#9CA3AF", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Eye size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
