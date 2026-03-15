import React, { useState } from "react";
import ApplicationsPage from "./features/admissions/pages/ApplicationsPage.jsx";
import CreateApplicationPage from "./features/admissions/pages/CreateApplicationPage.jsx";
import FullApplicationForm from "./features/admissions/pages/FullApplicationForm.jsx";
import LeadsPage from "./features/leads/pages/LeadsPage.jsx";
import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import "./App.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "applications", label: "Applications", icon: "📋" },
  { id: "leads", label: "Leads", icon: "👥" },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    if (activePage.startsWith("applications/") && activePage.includes("/edit")) {
      // Extract applicationId and step parameter from string like "applications/12/edit?step=4"
      const parts = activePage.split("/");
      const appId = parts[1];
      const queryString = activePage.includes("?") ? activePage.split("?")[1] : "";
      const stepParam = new URLSearchParams(queryString).get("step");
      
      return (
        <FullApplicationForm 
          applicationId={appId} 
          initialStep={stepParam ? parseInt(stepParam) - 1 : 0}
          onNavigate={setActivePage} 
        />
      );
    }

    switch (activePage) {
      case "dashboard":
        return <DashboardPage onNavigate={setActivePage} />;
      case "applications":
        return <ApplicationsPage onNavigate={setActivePage} />;
      case "applications/new":
        return <CreateApplicationPage onNavigate={setActivePage} />;
      case "leads":
        return <LeadsPage onNavigate={setActivePage} />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div
      className={`app-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">🎓</span>
          {sidebarOpen && <span className="sidebar-brand">School ERP</span>}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "nav-item-active" : ""}`}
              onClick={() => setActivePage(item.id)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </aside>

      {/* Main content */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <h2 className="topbar-title">
              {activePage.startsWith('application') ? '📋 Applications' : 
                (NAV_ITEMS.find((n) => n.id === activePage)?.icon + " " + NAV_ITEMS.find((n) => n.id === activePage)?.label)}
            </h2>
          </div>
          <div className="topbar-right">
            <span className="topbar-user">👤 Admin</span>
          </div>
        </header>
        <main className="page-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
