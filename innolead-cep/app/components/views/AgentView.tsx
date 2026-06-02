"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Brain, User, Zap, RefreshCw, Database, BarChart3 } from "lucide-react";
import { getAllDocuments, searchDocuments, searchByDimension, getDimensionInsights } from "../../lib/knowledgeBase";

interface Message {
  id: number;
  role: "agent" | "user";
  content: string;
  timestamp: string;
}

interface DiagnosticScore {
  label: string;
  score: number;
  color: string;
}

const DIMENSION_MAP: Record<string, string> = {
  "Strategic Clarity": "strategy",
  "Governance & Compliance": "governance",
  "Execution Capability": "execution",
  "People & Culture": "people",
};

async function getAgentResponse(input: string, scores: DiagnosticScore[] | null): Promise<string> {
  try {
    const docs = await getAllDocuments();
    const inputLower = input.toLowerCase();

    // Check if user is asking for recommendations based on diagnostic
    const isAskingRecommendations = /recommend|improve|weak|low|score|diagnostic|result|assessment|action|suggest|help me|what should/i.test(input);

    // If we have both scores and documents and user wants recommendations
    if (isAskingRecommendations && scores && scores.length > 0 && docs.length > 0) {
      const sorted = [...scores].sort((a, b) => a.score - b.score);
      const weakest = sorted.slice(0, 2);
      const strongest = sorted.slice(-1);

      let response = "**Based on your diagnostic results and the knowledge base, here are tailored recommendations:**\n\n";

      for (const dim of weakest) {
        const dimId = DIMENSION_MAP[dim.label] || "";
        const insights = getDimensionInsights(dimId, dim.score, docs);
        const level = dim.score >= 70 ? "strong" : dim.score >= 45 ? "developing" : "needs attention";

        response += `**${dim.label}** (${dim.score}% — ${level}):\n`;
        if (insights.length > 0) {
          for (const insight of insights) {
            response += `• ${insight}\n`;
          }
        } else {
          response += `• This area scored ${dim.score}%. Consider uploading relevant documents to the Knowledge Base for more specific guidance.\n`;
        }
        response += "\n";
      }

      if (strongest.length > 0) {
        const s = strongest[0];
        response += `**${s.label}** (${s.score}% — strength): This is your strongest dimension. `;
        const dimId = DIMENSION_MAP[s.label] || "";
        const insights = getDimensionInsights(dimId, s.score, docs);
        if (insights.length > 0) {
          response += insights[0];
        } else {
          response += "Continue building on this foundation.";
        }
        response += "\n\n";
      }

      response += "Would you like me to dive deeper into any specific dimension?";
      return response;
    }

    // If scores exist and user asks about a specific dimension
    if (scores && scores.length > 0) {
      for (const dim of scores) {
        const dimId = DIMENSION_MAP[dim.label] || "";
        if (inputLower.includes(dimId) || inputLower.includes(dim.label.toLowerCase())) {
          const insights = getDimensionInsights(dimId, dim.score, docs);
          let response = `**${dim.label} — ${dim.score}%**\n\n`;
          if (insights.length > 0) {
            response += "Here's what the knowledge base suggests for this dimension:\n\n";
            for (const insight of insights) {
              response += `• ${insight}\n`;
            }
          } else if (docs.length > 0) {
            response += "I couldn't find specific guidance for this dimension in the uploaded documents. Try uploading materials related to " + dim.label.toLowerCase() + ".";
          }
          response += "\n\nWould you like recommendations for another dimension?";
          return response;
        }
      }
    }

    // Standard KB search
    if (docs.length > 0) {
      const results = searchDocuments(input, docs);
      if (results.length > 0) {
        const top = results.slice(0, 3);
        const snippets = top.map((r, i) => `**${i + 1}. From "${r.doc.name}":**\n${r.snippet}`).join("\n\n");
        let response = `Based on the knowledge base, here's what I found:\n\n${snippets}`;
        if (top.length > 1) response += `\n\nI found relevant information across **${top.length} documents**.`;

        // If scores exist, add a nudge about recommendations
        if (scores && scores.length > 0) {
          response += "\n\nI also have your diagnostic results — ask me for **recommendations** to get personalised insights based on your scores.";
        }
        response += "\n\nWould you like me to go deeper into any of these topics?";
        return response;
      }
      return "I searched the knowledge base but couldn't find a direct match for your question. Could you try rephrasing, or ask about a topic covered in the uploaded documents?" +
        (scores && scores.length > 0 ? " You can also ask me for **recommendations** based on your diagnostic results." : "");
    }
  } catch {
    // IndexedDB unavailable
  }

  if (scores && scores.length > 0) {
    const sorted = [...scores].sort((a, b) => a.score - b.score);
    const overall = Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length);
    return `I don't have any knowledge base documents to reference yet, but I can see your diagnostic results (overall **${overall}%**).\n\nYour weakest area is **${sorted[0].label}** at **${sorted[0].score}%**. Once an admin uploads relevant documents, I'll be able to provide specific guidance from your organisation's materials.\n\nIn the meantime, ask me about any dimension and I'll share general best practices.`;
  }

  return "The knowledge base doesn't have any documents uploaded yet. Once an admin uploads reference material, I'll be able to answer questions based on that content. Complete the **diagnostic assessment** first, and I'll be able to give you tailored recommendations.";
}

function formatContent(text: string) {
  return text.split("\n").map((line) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent)">$1</strong>');
    return `<span>${formatted}<br/></span>`;
  }).join("");
}

interface AgentViewProps {
  setActiveView: (v: string) => void;
  diagnosticScores?: DiagnosticScore[] | null;
}

export default function AgentView({ setActiveView, diagnosticScores }: AgentViewProps) {
  const hasScores = diagnosticScores && diagnosticScores.length > 0;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: "agent", timestamp: "Now",
      content: hasScores
        ? `Hello! I'm your **Client Guidance Agent**, powered by Uhuru AI. I can see you've completed your diagnostic assessment. Ask me for **recommendations** and I'll cross-reference your scores with the knowledge base to give you tailored insights.`
        : "Hello! I'm your **Client Guidance Agent**, powered by Uhuru AI. Ask me anything about the content uploaded to the knowledge base and I'll help you find the information you need.",
    },
  ]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [kbCount, setKbCount]   = useState(0);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllDocuments().then(docs => setKbCount(docs.length)).catch(() => {});
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: text, timestamp: "Now" }]);
    setInput("");
    setIsTyping(true);
    setTimeout(async () => {
      const response = await getAgentResponse(text, diagnosticScores ?? null);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "agent", content: response, timestamp: "Just now" }]);
    }, 1800);
  };

  return (
    <div className="fade-in-up" style={{ display: "flex", gap: 20, height: "calc(100vh - 180px)" }}>
      {/* Main chat */}
      <div style={{ flex: 1, backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
        {/* Chat header */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14 }}>
          <div className="agent-pulse" style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, var(--accent), #007B5F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text-heading)" }}>Client Guidance Agent</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22C55E" }} />
              Active · Uhuru AI powered
            </div>
          </div>
          <button
            onClick={() => setMessages(msgs => [msgs[0]])}
            style={{ marginLeft: "auto", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
            title="Reset conversation"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: msg.role === "agent" ? "linear-gradient(135deg, var(--accent), #007B5F)" : "linear-gradient(135deg, #8B5CF6, #6D28D9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {msg.role === "agent" ? <Brain size={16} color="#fff" /> : <User size={16} color="#fff" />}
              </div>
              <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ backgroundColor: msg.role === "agent" ? "var(--bg-elevated)" : `rgba(var(--accent-rgb),0.08)`, border: `1px solid ${msg.role === "agent" ? "var(--border)" : `rgba(var(--accent-rgb),0.2)`}`, borderRadius: msg.role === "agent" ? "4px 14px 14px 14px" : "14px 4px 14px 14px", padding: "14px 16px", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.65 }}>
                  <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                </div>
                <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, var(--accent), #007B5F)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Brain size={16} color="#fff" />
              </div>
              <div style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "4px 14px 14px 14px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
                {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--accent)" }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", display: "flex", gap: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask the agent anything..."
            style={{ flex: 1, backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "Roboto, sans-serif" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="btn-primary"
            style={{ padding: "12px 18px", borderRadius: 10, border: "none", cursor: input.trim() && !isTyping ? "pointer" : "not-allowed", opacity: input.trim() && !isTyping ? 1 : 0.5, display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}
          >
            <Send size={15} /> Send
          </button>
        </div>
      </div>

      {/* Info panel */}
      <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 14 }}>
        {hasScores && (
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, boxShadow: "var(--card-shadow)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <BarChart3 size={14} color="var(--accent)" />
              <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>YOUR SCORES</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {diagnosticScores!.map(s => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color, fontFamily: "Montserrat, sans-serif" }}>{s.score}%</span>
                  </div>
                  <div style={{ height: 4, backgroundColor: "var(--bg-elevated)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${s.score}%`, backgroundColor: s.color, borderRadius: 2, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {kbCount > 0 && (
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, boxShadow: "var(--card-shadow)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Database size={14} color="var(--accent)" />
              <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>KNOWLEDGE BASE</span>
            </div>
            <div style={{ fontSize: 22, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "var(--text-heading)", marginBottom: 4 }}>{kbCount}</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>document{kbCount !== 1 ? "s" : ""} loaded</div>
          </div>
        )}

        <div style={{ background: `linear-gradient(135deg, rgba(var(--accent-rgb),0.08), rgba(0,123,95,0.06))`, border: `1px solid rgba(var(--accent-rgb),0.18)`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Zap size={14} color="var(--accent)" />
            <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>AI MODEL</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Powered by</div>
          <div style={{ fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-heading)" }}>Uhuru AI</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Baobab 3.0 · Fast mode</div>
        </div>
      </div>
    </div>
  );
}
