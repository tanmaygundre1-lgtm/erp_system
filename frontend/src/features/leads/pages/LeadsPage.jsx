import React, { useState, useEffect } from "react";
import { getAllLeads, updateLeadStatus } from "../../../config/api.js";
import "./LeadsPage.css";

const STATUS_OPTIONS = ["pending", "contacted", "converted", "lost"];

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const LIMIT = 10;

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: LIMIT };
      if (filterStatus) params.status = filterStatus;
      const result = await getAllLeads(params);
      setLeads(result.data || []);
      setPagination(result.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, filterStatus]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateLeadStatus(id, { follow_up_status: newStatus });
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, follow_up_status: newStatus } : l,
        ),
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "—");

  return (
    <div className="leads-page">
      {/* Filters */}
      <div className="leads-toolbar">
        <div className="leads-count">
          {pagination.total !== undefined && (
            <span>
              Total: <strong>{pagination.total}</strong> leads
            </span>
          )}
        </div>
        <select
          className="leads-filter"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && <div className="leads-error">⚠️ {error}</div>}

      {/* Table */}
      {loading ? (
        <div className="leads-loading">
          <div className="spinner" /> Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="leads-empty">
          <div className="empty-icon">👥</div>
          <h3>No leads found</h3>
          <p>Try changing the status filter or add new leads.</p>
        </div>
      ) : (
        <div className="leads-table-wrapper">
          <table className="leads-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Desired Class</th>
                <th>Source</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, idx) => (
                <tr key={lead.id}>
                  <td className="leads-idx">{(page - 1) * LIMIT + idx + 1}</td>
                  <td className="leads-name">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td>{lead.phone}</td>
                  <td>{lead.email || "—"}</td>
                  <td>{lead.desired_class || "—"}</td>
                  <td>{lead.source || "—"}</td>
                  <td>{formatDate(lead.created_at)}</td>
                  <td>
                    <select
                      className={`status-select status-${lead.follow_up_status}`}
                      value={lead.follow_up_status}
                      disabled={updatingId === lead.id}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="leads-pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {page} of {pagination.pages}
          </span>
          <button
            className="page-btn"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
