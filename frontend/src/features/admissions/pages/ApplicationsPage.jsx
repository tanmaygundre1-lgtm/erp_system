import React, { useState, useEffect } from "react";
import {
  getAdmissionStats,
  searchAdmissions,
  getApplicationProgress,
} from "../../../config/api.js";
import AdmissionForm from "./AdmissionForm.jsx";
import "./ApplicationsPage.css";

const ApplicationsPage = ({ onNavigate }) => {
  // State management
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    waitlisted: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Fetch admission statistics
  const fetchStatistics = async () => {
    try {
      const result = await getAdmissionStats();
      // Handle simplified response: { "total": number }
      if (result && typeof result.total === "number") {
        setStats((prev) => ({
          ...prev,
          total: result.total,
        }));
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await searchAdmissions(searchQuery);
      setApplications(result.data);
      if (result.data.length === 0) {
        setError("No applications found matching your search.");
      }
    } catch (err) {
      console.error("Error searching applications:", err);
      setError("Failed to search applications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Determine button text based on status
  const getActionButtonText = (status) => {
    return status === "APPROVED" ? "Display" : "Proceed";
  };

  // Handle action button click
  const handleActionClick = async (applicationId, status) => {
    const action = status === "APPROVED" ? "Display" : "Proceed";

    if (action === "Display") {
      console.log(`Display clicked for application: ${applicationId}`);
      // TODO: Implement display/view only mode
      onNavigate(`applications/${applicationId}`);
    } else {
      // Proceed: Check progress and redirect to next incomplete step
      try {
        const progressResponse = await getApplicationProgress(applicationId);
        if (progressResponse.success && progressResponse.data) {
          const progress = progressResponse.data;

          // Find the next incomplete step
          const STEP_STATUSES = [
            "student_info_status",
            "parent_info_status",
            "academic_details_status",
            "photos_status",
            "documents_status",
            "review_status",
          ];

          let nextStep = 0;
          for (let i = 0; i < STEP_STATUSES.length; i++) {
            if (progress[STEP_STATUSES[i]] !== "completed") {
              nextStep = i;
              break;
            }
          }

          // Redirect to application edit page with next step
          onNavigate(`applications/${applicationId}/edit?step=${nextStep + 1}`);
        }
      } catch (err) {
        console.error("Error checking progress:", err);
        // Fallback: just navigate to the application
        onNavigate(`applications/${applicationId}/edit`);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      COMPLETED: "badge-success",
      SUBMITTED: "badge-info",
      UNDER_REVIEW: "badge-warning",
      APPROVED: "badge-success",
      WAITLISTED: "badge-secondary",
    };

    return (
      <span
        className={`status-badge ${statusStyles[status] || "badge-secondary"}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  // Removed admission form local state to let App.jsx handle navigation

  return (
    <div className="applications-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p className="subtitle">Manage and track admission applications</p>
        </div>
        <button
          className="create-admission-btn"
          onClick={() => onNavigate("applications/new")}
        >
          + Create Application
        </button>
      </div>

      {/* SECTION 1: Statistics Cards */}
      <div className="statistics-section">
        <h2>Admission Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Completed</div>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.submitted}</div>
              <div className="stat-label">Submitted</div>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{stats.under_review}</div>
              <div className="stat-label">Under Review</div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>

          <div className="stat-card stat-card-secondary">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.waitlisted}</div>
              <div className="stat-label">Waitlisted</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Search / Filter */}
      <div className="search-section">
        <h2>Search Applications</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by student name or parent phone number..."
              value={searchQuery}
              onChange={handleInputChange}
              className="search-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="search-hint">
            Enter student's first name, last name, or parent's mobile number
          </p>
        </form>

        {/* Error message */}
        {error && <div className="alert alert-error">{error}</div>}
      </div>

      {/* SECTION 3: Results Table */}
      {hasSearched && (
        <div className="results-section">
          <h2>Search Results ({applications.length})</h2>

          {applications.length > 0 ? (
            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Student Name</th>
                    <th>Grade</th>
                    <th>Parent Contact</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.application_id} className="table-row">
                      <td className="col-app-id">
                        <span className="app-id-badge">
                          {app.application_id}
                        </span>
                      </td>
                      <td className="col-student-name">{app.student_name}</td>
                      <td className="col-grade">{app.grade}</td>
                      <td className="col-contact">{app.parent_contact}</td>
                      <td className="col-date">
                        {formatDate(app.submitted_date)}
                      </td>
                      <td className="col-status">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="col-action">
                        <button
                          onClick={() =>
                            handleActionClick(app.application_id, app.status)
                          }
                          className={`action-button action-button-${
                            app.status === "APPROVED" ? "primary" : "secondary"
                          }`}
                        >
                          {getActionButtonText(app.status)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-results">
              <p>
                No applications found. Try searching with different keywords.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty state when no search has been made */}
      {!hasSearched && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Search for Applications</h3>
          <p>
            Use the search bar above to find applications by student name or
            parent contact
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
