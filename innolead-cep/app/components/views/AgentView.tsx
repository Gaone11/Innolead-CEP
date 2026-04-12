"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Brain, User, Zap, RefreshCw, Download, Calendar, BarChart3, BookOpen } from "lucide-react";

interface Message {
  id: number;
  role: "agent" | "user";
  content: string;
  timestamp: string;
  actions?: { label: string; view?: string; icon: string }[];
}

const agentResponses: Record<string, { content: string; actions?: { label: string; view?: string; icon: string }[] }> = {
  default: {
    content: "I've analysed your diagnostic results and toolkit usage. Based on your responses, your organisation shows **Medium Maturity** overall (67%). Your biggest opportunity areas are in **Governance** (58%) and **Execution** (52%). Would you like me to walk you through a personalised action plan?",
    actions: [
      { label: "View Full Results", view: "results", icon: "chart" },
      { label: "Book a Workshop", view: "booking", icon: "calendar" },
    ],
  },
  governance: {
    content: "Most organisations at your governance maturity level struggle with two things: (1) unclear board mandates and (2) inconsistent compliance tracking. I recommend starting with the **Corporate Governance Framework** toolkit — you've already downloaded it. The next step would be a 2-hour governance diagnostic session with one of our Senior Governance Advisors. Shall I check their availability?",
    actions: [{ label: "Schedule Governance Review", view: "booking", icon: "calendar" }],
  },
  execution: {
    content: "Your execution score (52%) is the most urgent priority. This typically means projects are running over budget or timeline. The **Strategy Execution Toolkit** you downloaded has a 90-day execution sprint template that's worked well for similar organisations. Would you like me to create a customised action plan based on your diagnostic data?",
    actions: [
      { label: "View Toolkits", view: "toolkits", icon: "book" },
      { label: "Download Action Plan Template", icon: "download" },
    ],
  },
  workshop: {
    content: "Based on your profile, I recommend the **Strategy Execution Workshop** (2 days). This is designed for organisations with medium maturity scores in execution. The workshop is facilitated by one of our Senior Associates and typically results in a 6-month execution roadmap. We have availability next Friday with Thabo Mokoena or the following Tuesday with Dr. Aisha Dlamini. Which do you prefer?",
    actions: [{ label: "See All Consultants", view: "booking", icon: "calendar" }],
  },
  help: {
    content: "I'm your **Client Guidance Agent** — an AI assistant built to help you navigate your consulting journey on the Innolead platform. I can:\n\n• Explain your diagnostic results in plain language\n• Recommend the right toolkits for your needs\n• Help you choose the right consultant or programme\n• Create action plans based on your assessment data\n• Track your progress and suggest next steps\n\nWhat would you like help with today?",
  },
};

const suggestedPrompts = [
  "What do my diagnostic results mean?",
  "What workshop do you recommend for me?",
  "Help me improve my governance score",
  "How do I improve execution capability?",
  "What's my next best action?",
];

function getAgentResponse(input: string) {
  const lower = input.toLowerCase();
  if (lower.includes("governance") || lower.includes("board") || lower.includes("compliance")) return agentResponses.governance;
  if (lower.includes("execut") || lower.includes("project") || lower.includes("delivery")) return agentResponses.execution;
  if (lower.includes("workshop") || lower.includes("session") || lower.includes("consultant") || lower.includes("book")) return agentResponses.workshop;
  if (lower.includes("help") || lower.includes("what can") || lower.includes("who are")) return agentResponses.help;
  return agentResponses.default;
}

function formatContent(text: string) {
  return text
    .split("\n")
    .map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#3BC2FB">$1</strong>');
      return `<span key="${i}">${formatted}<br/></span>`;
    })
    .join("");
}

const iconMap: Record<string, React.ReactNode> = {
  chart: <BarChart3 size={13} />,
  calendar: <Calendar size={13} />,
  book: <BookOpen size={13} />,
  download: <Download size={13} />,
};

interface AgentViewProps {
  setActiveView: (v: string) => void;
}

export default function AgentView({ setActiveView }: AgentViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "agent",
      content: "Hello! I'm your **Client Guidance Agent**. I've reviewed your diagnostic results and toolkit activity. Based on your assessment, your organisation scores **67% overall maturity** with key gaps in Governance and Execution. How can I help you today?",
      timestamp: "Now",
      actions: [
        { label: "View My Results", view: "results", icon: "chart" },
        { label: "Book a Consultant", view: "booking", icon: "calendar" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: "Now",
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAgentResponse(text);
      const agentMsg: Message = {
        id: Date.now() + 1,
        role: "agent",
        content: response.content,
        timestamp: "Just now",
        actions: response.actions,
      };
      setIsTyping(false);
      setMessages(prev => [...prev, agentMsg]);
    }, 1800);
  };

  return (
    <div className="fade-in-up" style={{ display: "flex", gap: 20, height: "calc(100vh - 180px)" }}>
      {/* Main chat */}
      <div style={{
        flex: 1, backgroundColor: "#1A1F2E", border: "1px solid #374151",
        borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Chat header */}
        <div style={{
          padding: "16px 22px", borderBottom: "1px solid #374151",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div className="agent-pulse" style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #3BC2FB, #007B5F)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Brain size={20} color="#0F1419" />
          </div>
          <div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>
              Client Guidance Agent
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9CA3AF" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22C55E" }} />
              Active · Uhuru AI powered
            </div>
          </div>
          <button
            onClick={() => setMessages(msgs => [msgs[0]])}
            style={{
              marginLeft: "auto", background: "#252B3A", border: "1px solid #374151",
              borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: "#9CA3AF",
              display: "flex", alignItems: "center",
            }}
            title="Reset conversation"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 12, alignItems: "flex-start",
            }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: msg.role === "agent"
                  ? "linear-gradient(135deg, #3BC2FB, #007B5F)"
                  : "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {msg.role === "agent" ? <Brain size={16} color="#0F1419" /> : <User size={16} color="#fff" />}
              </div>

              <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Bubble */}
                <div style={{
                  backgroundColor: msg.role === "agent" ? "#252B3A" : "rgba(59,194,251,0.12)",
                  border: `1px solid ${msg.role === "agent" ? "#374151" : "rgba(59,194,251,0.25)"}`,
                  borderRadius: msg.role === "agent" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                  padding: "14px 16px",
                  fontSize: 13,
                  color: "#E5E7EB",
                  lineHeight: 1.65,
                }}>
                  <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                </div>

                {/* Action buttons */}
                {msg.actions && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {msg.actions.map((action, ai) => (
                      <button
                        key={ai}
                        onClick={() => action.view && setActiveView(action.view)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "7px 14px", borderRadius: 8,
                          background: "rgba(59,194,251,0.1)", border: "1px solid rgba(59,194,251,0.25)",
                          color: "#3BC2FB", cursor: "pointer", fontSize: 12,
                          fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                        }}
                      >
                        {iconMap[action.icon]} {action.label}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 10, color: "#4B5563" }}>{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #3BC2FB, #007B5F)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Brain size={16} color="#0F1419" />
              </div>
              <div style={{
                backgroundColor: "#252B3A", border: "1px solid #374151",
                borderRadius: "4px 14px 14px 14px", padding: "14px 18px",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0,1,2].map(i => (
                  <div key={i} className="typing-dot" style={{
                    width: 8, height: 8, borderRadius: "50%", backgroundColor: "#3BC2FB",
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts */}
        <div style={{ padding: "10px 22px", borderTop: "1px solid #374151", display: "flex", gap: 8, overflowX: "auto" }}>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              style={{
                whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 8,
                background: "#252B3A", border: "1px solid #374151",
                color: "#9CA3AF", cursor: "pointer", fontSize: 12,
                transition: "all 0.2s",
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid #374151", display: "flex", gap: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask the agent anything about your journey..."
            style={{
              flex: 1, backgroundColor: "#252B3A", border: "1px solid #374151",
              borderRadius: 10, padding: "12px 16px",
              color: "#E5E7EB", fontSize: 13, outline: "none",
              fontFamily: "Roboto, sans-serif",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="btn-primary"
            style={{
              padding: "12px 18px", borderRadius: 10, border: "none",
              cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
              opacity: input.trim() && !isTyping ? 1 : 0.5,
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13,
            }}
          >
            <Send size={15} /> Send
          </button>
        </div>
      </div>

      {/* Agent info panel */}
      <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 18 }}>
          <h4 style={{ margin: "0 0 14px", fontSize: 13, fontFamily: "Montserrat, sans-serif" }}>Active Agents</h4>
          {[
            { name: "Client Guidance", status: "active", color: "#3BC2FB" },
            { name: "Diagnostic & Scoring", status: "active", color: "#007B5F" },
            { name: "Sales & CRM", status: "standby", color: "#FF9933" },
            { name: "Consultant Briefing", status: "standby", color: "#8B5CF6" },
            { name: "Content Evolution", status: "idle", color: "#6B7280" },
          ].map(agent => (
            <div key={agent.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 0", borderBottom: "1px solid #252B3A",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: agent.color }} />
                <span style={{ fontSize: 12, color: "#E5E7EB" }}>{agent.name}</span>
              </div>
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 5,
                backgroundColor: agent.status === "active" ? "rgba(59,194,251,0.1)" : "#252B3A",
                color: agent.status === "active" ? "#3BC2FB" : "#6B7280",
                fontFamily: "Montserrat, sans-serif", fontWeight: 600,
              }}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 18 }}>
          <h4 style={{ margin: "0 0 14px", fontSize: 13, fontFamily: "Montserrat, sans-serif" }}>Client Context</h4>
          {[
            { label: "Industry", value: "Financial Services" },
            { label: "Size", value: "51–200 employees" },
            { label: "Toolkits", value: "4 downloaded" },
            { label: "Diagnostic", value: "67% (Medium)" },
            { label: "Priority", value: "Governance + Execution" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#E5E7EB", fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(59,194,251,0.1), rgba(0,123,95,0.1))",
          border: "1px solid rgba(59,194,251,0.2)",
          borderRadius: 14, padding: 18,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Zap size={14} color="#3BC2FB" />
            <span style={{ fontSize: 12, color: "#3BC2FB", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>AI MODEL</span>
          </div>
          <div style={{ fontSize: 12, color: "#E5E7EB", marginBottom: 4 }}>Powered by</div>
          <div style={{ fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#fff" }}>Uhuru AI</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Baobab 3.0 · Fast mode</div>
        </div>
      </div>
    </div>
  );
}
