"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, Circle, Brain, BarChart3 } from "lucide-react";

const sections = [
  { id: "strategy",   label: "Strategic Clarity",      color: "var(--accent)", questions: [
    { id: "s1", text: "Our organisation has a clearly documented and communicated 3–5 year strategy.",          options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
    { id: "s2", text: "Leadership reviews strategic progress against defined KPIs on a quarterly basis.",        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
    { id: "s3", text: "We have a formal process for translating strategy into departmental execution plans.",    options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  ]},
  { id: "governance", label: "Governance & Compliance", color: "#007B5F",        questions: [
    { id: "g1", text: "Our board has clearly defined roles, responsibilities, and governance policies.",         options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
    { id: "g2", text: "We conduct formal risk assessments at least once per year.",                              options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { id: "g3", text: "Our compliance obligations are tracked and reported to senior leadership.",               options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  ]},
  { id: "execution",  label: "Execution Capability",   color: "#FF9933",        questions: [
    { id: "e1", text: "Projects are delivered on time and within budget at least 70% of the time.",             options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
    { id: "e2", text: "We have standardised project management processes used across the organisation.",         options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { id: "e3", text: "Change initiatives are managed with dedicated change management support.",                options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  ]},
  { id: "people",     label: "People & Culture",       color: "#8B5CF6",        questions: [
    { id: "p1", text: "We have a formal talent development and succession planning programme.",                  options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
    { id: "p2", text: "Employee engagement is formally measured and acted upon.",                               options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { id: "p3", text: "Leadership models the values and behaviours we expect from all staff.",                  options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  ]},
];

interface DiagnosticViewProps { setActiveView: (v: string) => void; }

export default function DiagnosticView({ setActiveView }: DiagnosticViewProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers]               = useState<Record<string, number>>({});
  const [submitted, setSubmitted]           = useState(false);

  const section        = sections[currentSection];
  const totalQuestions = sections.reduce((a, s) => a + s.questions.length, 0);
  const answeredCount  = Object.keys(answers).length;
  const sectionAnswered= section.questions.every(q => answers[q.id] !== undefined);
  const allAnswered    = answeredCount === totalQuestions;

  const setAnswer = (qId: string, score: number) => setAnswers(prev => ({ ...prev, [qId]: score }));

  const getSectionScore = (secId: string) => {
    const sec = sections.find(s => s.id === secId);
    if (!sec) return 0;
    const scores   = sec.questions.map(q => answers[q.id] ?? 0);
    const answered = scores.filter(s => s > 0);
    if (answered.length === 0) return 0;
    return Math.round((answered.reduce((a, b) => a + b, 0) / (answered.length * 4)) * 100);
  };

  const overallScore = Math.round(sections.reduce((sum, s) => sum + getSectionScore(s.id), 0) / sections.length);

  if (submitted) {
    return (
      <div className="fade-in-up">
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, textAlign: "center", marginBottom: 24, boxShadow: "var(--card-shadow)" }}>
          <div className="glow-cyan" style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), #007B5F)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Brain size={36} color="#fff" />
          </div>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", marginBottom: 8 }}>Assessment Complete</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Your Diagnostic & Scoring Agent has processed your responses</p>

          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 28px" }}>
            <svg viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle cx="80" cy="80" r="65" fill="none" stroke="var(--bg-elevated)" strokeWidth="14" />
              <circle cx="80" cy="80" r="65" fill="none" strokeWidth="14" strokeLinecap="round"
                style={{ stroke: "var(--accent)", strokeDasharray: `${2 * Math.PI * 65}`, strokeDashoffset: `${2 * Math.PI * 65 * (1 - overallScore / 100)}`, transition: "stroke-dashoffset 1.5s ease-in-out" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 36, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "var(--text-heading)" }}>{overallScore}%</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Maturity</div>
            </div>
          </div>

          <div style={{ fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: overallScore >= 70 ? "#007B5F" : overallScore >= 45 ? "#FF9933" : "#EF4444", marginBottom: 8 }}>
            {overallScore >= 70 ? "High Maturity" : overallScore >= 45 ? "Medium Maturity" : "Low Maturity"}
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 480, margin: "0 auto 28px" }}>
            {overallScore >= 70
              ? "Your organisation demonstrates strong strategic and operational maturity. Recommended next step: Full engagement with a senior consultant."
              : overallScore >= 45
                ? "There are key improvement areas in execution and governance. Recommended: Paid diagnostic + targeted workshop."
                : "Your organisation would benefit most from foundational toolkit work and the Innolead Academy. Recommended: Basic toolkit + Academy course."}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, maxWidth: 520, margin: "0 auto 28px", textAlign: "left" }}>
            {sections.map(s => {
              const score = getSectionScore(s.id);
              return (
                <div key={s.id} style={{ backgroundColor: "var(--bg-elevated)", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ height: 4, backgroundColor: "var(--border)", borderRadius: 2, marginBottom: 6 }}>
                    <div style={{ width: `${score}%`, height: "100%", backgroundColor: s.color, borderRadius: 2, transition: "width 1.2s ease" }} />
                  </div>
                  <div style={{ fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: s.color }}>{score}%</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setActiveView("results")} className="btn-primary" style={{ padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={16} /> View Full Report
            </button>
            <button onClick={() => setActiveView("booking")} style={{ padding: "12px 28px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              Book a Consultant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Progress header */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 22px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Organisational Maturity Diagnostic</h3>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>{answeredCount} of {totalQuestions} questions answered</p>
          </div>
          <div style={{ fontSize: 13, color: "var(--accent)", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
            Section {currentSection + 1} / {sections.length}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {sections.map((s, i) => {
            const sectionDone = s.questions.every(q => answers[q.id] !== undefined);
            return (
              <button key={s.id} onClick={() => setCurrentSection(i)}
                style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", background: i === currentSection ? `${s.color}18` : "var(--bg-elevated)", cursor: "pointer", borderBottom: i === currentSection ? `2px solid ${s.color}` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: i === currentSection ? s.color : "var(--text-muted)", fontSize: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 600, transition: "all 0.2s" }}
              >
                {sectionDone ? <CheckCircle size={13} fill={s.color} color={s.color} /> : <Circle size={13} />}
                {s.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: section.color }} />
          <h3 style={{ margin: 0, fontFamily: "Montserrat, sans-serif", fontSize: 16, color: section.color }}>{section.label}</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {section.questions.map((q, qi) => (
            <div key={q.id} className="slide-in-left" style={{ animationDelay: `${qi * 0.1}s` }}>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6, fontWeight: 500 }}>
                <span style={{ color: section.color, fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginRight: 6 }}>Q{qi + 1}.</span>
                {q.text}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  return (
                    <button key={oi} onClick={() => setAnswer(q.id, oi)}
                      style={{ flex: 1, padding: "10px 6px", borderRadius: 9, border: selected ? `2px solid ${section.color}` : "1px solid var(--border)", background: selected ? `${section.color}18` : "var(--bg-elevated)", color: selected ? section.color : "var(--text-secondary)", cursor: "pointer", fontSize: 11, fontFamily: "Montserrat, sans-serif", fontWeight: selected ? 700 : 400, transition: "all 0.2s", textAlign: "center", lineHeight: 1.3 }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setCurrentSection(Math.max(0, currentSection - 1))} disabled={currentSection === 0}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", color: currentSection === 0 ? "var(--text-faint)" : "var(--text-primary)", cursor: currentSection === 0 ? "not-allowed" : "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 13 }}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{answeredCount}/{totalQuestions} answered</div>

        {currentSection < sections.length - 1 ? (
          <button onClick={() => sectionAnswered && setCurrentSection(currentSection + 1)} className={sectionAnswered ? "btn-primary" : ""}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, border: "none", background: sectionAnswered ? undefined : "var(--bg-elevated)", color: sectionAnswered ? undefined : "var(--text-faint)", cursor: sectionAnswered ? "pointer" : "not-allowed", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 13 }}
          >
            Next Section <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={() => allAnswered && setSubmitted(true)} className={allAnswered ? "btn-primary" : ""}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", background: allAnswered ? undefined : "var(--bg-elevated)", color: allAnswered ? undefined : "var(--text-faint)", cursor: allAnswered ? "pointer" : "not-allowed", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 13 }}
          >
            Submit Assessment <Brain size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
