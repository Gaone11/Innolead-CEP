"use client";

import { useState } from "react";
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

export default function CEPApp() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  const renderView = () => {
    switch (activeView) {
      case "dashboard": return <DashboardView setActiveView={setActiveView} />;
      case "toolkits": return <ToolkitsView />;
      case "diagnostic": return <DiagnosticView setActiveView={setActiveView} />;
      case "agent": return <AgentView setActiveView={setActiveView} />;
      case "results": return <ResultsView setActiveView={setActiveView} />;
      case "booking": return <BookingView />;
      case "admin": return <AdminView />;
      case "consultant": return <ConsultantView />;
      default: return <DashboardView setActiveView={setActiveView} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0F1419" }}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        role="client"
      />
      <div style={{
        marginLeft: sidebarWidth,
        flex: 1,
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        <Header activeView={activeView} sidebarCollapsed={sidebarCollapsed} />
        <main
          className="grid-bg"
          style={{
            marginTop: 64,
            flex: 1,
            padding: 28,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {renderView()}
        </main>
      </div>
    </div>
  );
}
