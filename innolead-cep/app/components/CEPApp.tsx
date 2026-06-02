"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardView from "./views/DashboardView";
import ToolkitsView from "./views/ToolkitsView";
import DiagnosticView from "./views/DiagnosticView";
import AgentView from "./views/AgentView";
import ResultsView from "./views/ResultsView";
import BookingView from "./views/BookingView";
import AdminView from "./views/AdminView";
import ConsultantView from "./views/ConsultantView";
import KnowledgeBaseView from "./views/KnowledgeBaseView";
import SearchOverlay from "./SearchOverlay";
import SettingsModal from "./SettingsModal";
import LandingScreen from "./LandingScreen";
import { Notification } from "./NotificationPanel";

const INITIAL_NOTIFICATIONS: Notification[] = [];

// localStorage helpers — keyed per user email
function loadUserData(email: string) {
  try {
    const raw = localStorage.getItem(`icep_user_${email.toLowerCase()}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveUserData(email: string, data: Record<string, unknown>) {
  try {
    const existing = loadUserData(email) || {};
    localStorage.setItem(`icep_user_${email.toLowerCase()}`, JSON.stringify({ ...existing, ...data }));
  } catch { /* ignore */ }
}

export default function CEPApp() {
  const [loggedIn, setLoggedIn]               = useState(() => {
    try { return !!localStorage.getItem("icep_session_email"); } catch { return false; }
  });
  const [userEmail, setUserEmail]             = useState(() => {
    try { return localStorage.getItem("icep_session_email") || ""; } catch { return ""; }
  });
  const [activeView, setActiveView]           = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [settingsOpen, setSettingsOpen]       = useState(false);
  const [notifications, setNotifications]     = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [role, setRole]                       = useState("client");
  const [signOutConfirm, setSignOutConfirm]   = useState(false);
  const [theme, setTheme]                     = useState<"light" | "dark">("light");
  const [diagnosticScores, setDiagnosticScores] = useState<{ label: string; score: number; color: string }[] | null>(null);

  const ADMIN_EMAILS = ["monti@uhuruai.co", "gaone@uhuruai.co"];
  const isAdmin = ADMIN_EMAILS.includes(userEmail.toLowerCase());

  // Restore persisted session on login
  useEffect(() => {
    if (!userEmail) return;
    const saved = loadUserData(userEmail);
    if (saved) {
      if (saved.diagnosticScores) setDiagnosticScores(saved.diagnosticScores);
      if (saved.theme) setTheme(saved.theme);
    }
  }, [userEmail]);

  // Persist diagnostic scores whenever they change
  useEffect(() => {
    if (!userEmail || !diagnosticScores) return;
    saveUserData(userEmail, { diagnosticScores });
  }, [diagnosticScores, userEmail]);

  // Persist theme preference
  useEffect(() => {
    if (!userEmail) return;
    saveUserData(userEmail, { theme });
  }, [theme, userEmail]);

  // Derive user profile from email
  const userProfiles: Record<string, { name: string; initials: string; org: string }> = {
    "gaone@uhuruai.co":  { name: "Gaone Molefi",   initials: "GM", org: "Uhuru AI" },
    "monti@uhuruai.co":  { name: "Monti",           initials: "MO", org: "Uhuru AI" },
  };
  const defaultProfile = { name: "James Doe", initials: "JD", org: "Acme Corp" };
  const userProfile = userProfiles[userEmail.toLowerCase()] || defaultProfile;

  // Apply theme to <html> element so CSS vars propagate everywhere
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSettingsOpen(false);
        setSignOutConfirm(false);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Notification handlers
  function markRead(id: number) {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  }
  function markAllRead() {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  }
  function clearNotification(id: number) {
    setNotifications(ns => ns.filter(n => n.id !== id));
  }
  function clearAllNotifications() {
    setNotifications([]);
  }

  function handleSignOut()  { setSignOutConfirm(true); }
  function confirmSignOut() {
    setSignOutConfirm(false);
    setLoggedIn(false);
    setUserEmail("");
    setActiveView("dashboard");
    setNotifications(INITIAL_NOTIFICATIONS);
    setDiagnosticScores(null);
    try { localStorage.removeItem("icep_session_email"); } catch { /* ignore */ }
  }

  function handleSidebarSignOut()  { setSignOutConfirm(true); }
  function handleSidebarSettings() { setSettingsOpen(true); }

  if (!loggedIn) {
    return <LandingScreen onLogin={(email: string) => {
      setUserEmail(email);
      setLoggedIn(true);
      try { localStorage.setItem("icep_session_email", email); } catch { /* ignore */ }
    }} />;
  }

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  const renderView = () => {
    switch (activeView) {
      case "dashboard":  return <DashboardView  setActiveView={setActiveView} />;
      case "toolkits":   return <ToolkitsView />;
      case "diagnostic": return <DiagnosticView setActiveView={setActiveView} onSubmitScores={setDiagnosticScores} />;
      case "agent":      return <AgentView      setActiveView={setActiveView} diagnosticScores={diagnosticScores} />;
      case "results":    return <ResultsView    setActiveView={setActiveView} scores={diagnosticScores} />;
      case "booking":    return <BookingView />;
      case "admin":      return <AdminView />;
      case "consultant": return <ConsultantView />;
      case "knowledge":  return <KnowledgeBaseView />;
      default:           return <DashboardView  setActiveView={setActiveView} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        role={role}
        isAdmin={isAdmin}
        onSignOut={handleSidebarSignOut}
        onSettings={handleSidebarSettings}
      />

      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: "margin-left 0.3s ease", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header
          activeView={activeView}
          sidebarCollapsed={sidebarCollapsed}
          notifications={notifications}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onClearNotification={clearNotification}
          onClearAllNotifications={clearAllNotifications}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onSignOut={handleSignOut}
          setActiveView={setActiveView}
          role={role}
          setRole={setRole}
          userEmail={userEmail}
          userName={userProfile.name}
          userInitials={userProfile.initials}
          userOrg={userProfile.org}
        />

        <main className="grid-bg" style={{ marginTop: 64, flex: 1, padding: 28, minHeight: "calc(100vh - 64px)" }}>
          {renderView()}
        </main>
      </div>

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          setActiveView={(v) => { setActiveView(v); setSearchOpen(false); }}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {signOutConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="fade-in-up" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 36, maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <span style={{ fontSize: 28 }}>👋</span>
            </div>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Montserrat, sans-serif", fontSize: 20 }}>Sign Out?</h2>
            <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Your session progress will be saved. You can sign back in at any time.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setSignOutConfirm(false)} style={{ padding: "11px 24px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                Stay
              </button>
              <button onClick={confirmSignOut} style={{ padding: "11px 24px", borderRadius: 10, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", cursor: "pointer", fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
