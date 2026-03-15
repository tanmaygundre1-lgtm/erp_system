import React, { useState, useEffect } from "react";
import { getAdmissionStats, getAllLeads, getHealth } from "../../config/api.js";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState({ total: 0, data: [] });
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [admStats, leadsData, healthData] = await Promise.allSettled([
          getAdmissionStats(),
          getAllLeads({ limit: 5, page: 1 }),
          getHealth(),
        ]);
        if (admStats.status === "fulfilled") setStats(admStats.value.data);
        if (leadsData.status === "fulfilled") setLeads(leadsData.value);
        if (healthData.status === "fulfilled") setHealth(healthData.value);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Completed",
      value: stats?.total ?? "—",
      icon: "📊",
      color: "blue",
    },
    {
      label: "Submitted",
      value: stats?.submitted ?? "—",
      icon: "📝",
      color: "indigo",
    },
    {
      label: "Under Review",
      value: stats?.under_review ?? "—",
      icon: "🔄",
      color: "amber",
    },
    {
      label: "Approved",
      value: stats?.approved ?? "—",
      icon: "✅",
      color: "green",
    },
    {
      label: "Waitlisted",
      value: stats?.waitlisted ?? "—",
      icon: "⏳",
      color: "slate",
    },
    {
      label: "Total Leads",
      value: leads?.pagination?.total ?? "—",
      icon: "👥",
      color: "purple",
    },
  ];

  return (
    <div className="dashboard">
      {/* Server status banner */}
      <div
        className={`server-banner ${health ? "banner-online" : "banner-offline"}`}
      >
        <span className="banner-dot" />
        Backend:{" "}
        {health
          ? `Online — ${health.environment?.toUpperCase()}`
          : "Unreachable"}
        {health && (
          <span className="banner-time">
            Last checked: {new Date(health.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Welcome */}
      <div className="dash-welcome">
        <h1>Welcome back, Admin 👋</h1>
        <p>Here's what's happening with your school today.</p>
      </div>

      {/* Stat cards */}
      <div className="dash-stats-grid">
        {statCards.map((c) => (
          <div key={c.label} className={`dash-stat-card color-${c.color}`}>
            <div className="dash-stat-icon">{c.icon}</div>
            <div className="dash-stat-info">
              <div className="dash-stat-value">{c.value}</div>
              <div className="dash-stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="dash-section">
        <h2>Recent Leads</h2>
        {leads?.data?.length > 0 ? (
          <div className="dash-table-wrapper">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.data.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td>{lead.phone}</td>
                    <td>{lead.desired_class || "—"}</td>
                    <td>{lead.source || "—"}</td>
                    <td>
                      <span
                        className={`dash-badge status-${lead.follow_up_status}`}
                      >
                        {lead.follow_up_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dash-empty">
            No leads found. Add your first lead from the Leads page.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
