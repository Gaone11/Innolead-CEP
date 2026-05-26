"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Database, AlertCircle, CheckCircle2, FileUp, Search, X, Brain } from "lucide-react";
import { KBDocument, getAllDocuments, saveDocument, deleteDocument, clearAllDocuments, extractText, extractKeywords } from "../../lib/knowledgeBase";

type UploadStatus = "idle" | "extracting" | "saving" | "done" | "error";

export default function KnowledgeBaseView() {
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await getAllDocuments();
      setDocuments(docs.sort((a, b) => b.uploadedAt - a.uploadedAt));
    } catch {
      console.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const allowed = ["pdf", "docx", "txt", "csv", "md", "xlsx", "xls", "pptx"];

      if (!allowed.includes(ext)) {
        setUploadStatus("error");
        setUploadMessage(`Unsupported file type: .${ext}. Allowed: ${allowed.join(", ")}`);
        continue;
      }

      try {
        setUploadStatus("extracting");
        setUploadMessage(`Extracting text from ${file.name}...`);

        const text = await extractText(file);
        if (!text.trim()) {
          setUploadStatus("error");
          setUploadMessage(`No text could be extracted from ${file.name}.`);
          continue;
        }

        const keywords = extractKeywords(text);

        setUploadStatus("saving");
        setUploadMessage(`Saving ${file.name} to knowledge base...`);

        const doc: KBDocument = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: ext,
          size: file.size,
          uploadedAt: Date.now(),
          text,
          keywords,
        };

        await saveDocument(doc);
        setUploadStatus("done");
        setUploadMessage(`${file.name} added to knowledge base (${keywords.length} keywords extracted).`);
      } catch (err) {
        setUploadStatus("error");
        setUploadMessage(`Failed to process ${file.name}: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    await loadDocuments();
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => { setUploadStatus("idle"); setUploadMessage(""); }, 4000);
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Remove "${name}" from the knowledge base?`)) return;
    await deleteDocument(id);
    await loadDocuments();
  }

  async function handleClearAll() {
    await clearAllDocuments();
    setConfirmClear(false);
    await loadDocuments();
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const filtered = searchQuery
    ? documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.keywords.some(k => k.includes(searchQuery.toLowerCase())))
    : documents;

  const totalWords = documents.reduce((sum, d) => sum + d.text.split(/\s+/).length, 0);
  const totalKeywords = new Set(documents.flatMap(d => d.keywords)).size;

  return (
    <div className="fade-in-up" style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg, var(--accent), #007B5F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-heading)" }}>Knowledge Base</h2>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>Upload documents to train the AI Agent on your content</p>
          </div>
        </div>
        {documents.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", cursor: "pointer", fontSize: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Documents", value: documents.length, color: "var(--accent)" },
          { label: "Total Words", value: totalWords.toLocaleString(), color: "#007B5F" },
          { label: "Unique Keywords", value: totalKeywords, color: "#8B5CF6" },
          { label: "Storage", value: formatSize(documents.reduce((s, d) => s + d.size, 0)), color: "#FF9933" },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 22, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          backgroundColor: "var(--bg-card)", border: "2px dashed var(--border)", borderRadius: 16, padding: "40px 24px",
          textAlign: "center", cursor: "pointer", marginBottom: 24, transition: "border-color 0.2s, background-color 0.2s",
          boxShadow: "var(--card-shadow)",
        }}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.backgroundColor = "rgba(var(--accent-rgb),0.03)"; }}
        onDragLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.backgroundColor = "var(--bg-card)"; }}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.backgroundColor = "var(--bg-card)";
          if (fileRef.current && e.dataTransfer.files.length > 0) {
            const dt = new DataTransfer();
            for (let i = 0; i < e.dataTransfer.files.length; i++) dt.items.add(e.dataTransfer.files[i]);
            fileRef.current.files = dt.files;
            fileRef.current.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }}
      >
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.csv,.md,.xlsx,.xls,.pptx" multiple onChange={handleFileUpload} style={{ display: "none" }} />
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `rgba(var(--accent-rgb),0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <FileUp size={26} color="var(--accent)" />
        </div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-heading)", marginBottom: 6 }}>
          Drop files here or click to upload
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Supports PDF, DOCX, Excel, PowerPoint, TXT, CSV, MD
        </div>
      </div>

      {/* Upload status */}
      {uploadStatus !== "idle" && (
        <div style={{
          padding: "12px 18px", borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13,
          backgroundColor: uploadStatus === "error" ? "rgba(239,68,68,0.08)" : uploadStatus === "done" ? "rgba(34,197,94,0.08)" : `rgba(var(--accent-rgb),0.08)`,
          border: `1px solid ${uploadStatus === "error" ? "rgba(239,68,68,0.2)" : uploadStatus === "done" ? "rgba(34,197,94,0.2)" : `rgba(var(--accent-rgb),0.2)`}`,
          color: uploadStatus === "error" ? "#EF4444" : uploadStatus === "done" ? "#22C55E" : "var(--accent)",
        }}>
          {uploadStatus === "error" ? <AlertCircle size={16} /> : uploadStatus === "done" ? <CheckCircle2 size={16} /> : (
            <div style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          )}
          {uploadMessage}
        </div>
      )}

      {/* Search and document list */}
      {documents.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                style={{ width: "100%", padding: "10px 14px 10px 36px", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text-primary)", outline: "none", fontFamily: "Roboto, sans-serif", boxSizing: "border-box" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{filtered.length} document{filtered.length !== 1 ? "s" : ""}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(doc => (
              <div key={doc.id} className="card-hover" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "var(--card-shadow)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: `rgba(var(--accent-rgb),0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={20} color="var(--accent)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text-heading)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.name}
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-muted)" }}>
                    <span>{doc.type.toUpperCase()}</span>
                    <span>{formatSize(doc.size)}</span>
                    <span>{doc.text.split(/\s+/).length.toLocaleString()} words</span>
                    <span>{doc.keywords.length} keywords</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", marginRight: 12 }}>
                  {formatDate(doc.uploadedAt)}
                </div>
                <button
                  onClick={() => handleDelete(doc.id, doc.name)}
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "7px 8px", cursor: "pointer", color: "#EF4444", display: "flex", alignItems: "center", flexShrink: 0 }}
                  title="Remove document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && documents.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `rgba(var(--accent-rgb),0.08)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Brain size={30} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-heading)", marginBottom: 8 }}>
            No documents yet
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
            Upload PDF, DOCX, Excel, PowerPoint, TXT, or CSV files to train the AI Agent. The agent will use your uploaded content to provide contextual, document-informed responses.
          </div>
        </div>
      )}

      {/* How it works */}
      <div style={{ marginTop: 32, backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--card-shadow)" }}>
        <h3 style={{ margin: "0 0 16px", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-heading)" }}>How It Works</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { step: "1", title: "Upload Documents", desc: "Add your organisation's policies, frameworks, and reference material in PDF, DOCX, Excel, PowerPoint, TXT, or CSV format." },
            { step: "2", title: "Text & Keywords Extracted", desc: "The platform extracts full text and identifies key topics from each document automatically." },
            { step: "3", title: "AI Agent Uses Content", desc: "When users ask the AI Agent questions, it searches your knowledge base to provide informed, contextual answers." },
          ].map(item => (
            <div key={item.step} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `rgba(var(--accent-rgb),0.1)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, color: "var(--accent)", flexShrink: 0 }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text-heading)", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clear all confirmation */}
      {confirmClear && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="fade-in-up" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 36, maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Trash2 size={26} color="#EF4444" />
            </div>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Montserrat, sans-serif", fontSize: 20 }}>Clear Knowledge Base?</h2>
            <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              This will remove all {documents.length} document{documents.length !== 1 ? "s" : ""} from the knowledge base. The AI Agent will revert to default responses.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmClear(false)} style={{ padding: "11px 24px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleClearAll} style={{ padding: "11px 24px", borderRadius: 10, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", cursor: "pointer", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
