import React, { useState } from "react";
import { searchLeads, createApplicationFromLead } from "../../../config/api.js";
import ExistingApplicationModal from "../components/ExistingApplicationModal.jsx";
import "./CreateApplicationPage.css";

const CreateApplicationPage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [admissionType, setAdmissionType] = useState("new");
  const [academicYearId, setAcademicYearId] = useState(1);
  const [previousSchoolName, setPreviousSchoolName] = useState("");
  const [reasonForChange, setReasonForChange] = useState("");

  // State for existing application modal
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [existingAppData, setExistingAppData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await searchLeads(searchQuery);
      setLeads(response.data || []);
      setSelectedLead(null);
    } catch (err) {
      console.error("Error searching leads:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      const payload = {
        lead_id: selectedLead.id,
        academic_year_id: academicYearId,
        admission_type: admissionType,
        previous_school_name: previousSchoolName,
        reason_for_change: reasonForChange,
      };

      const response = await createApplicationFromLead(payload);
      if (response.success) {
        if (response.existing_application) {
          setExistingAppData({
            application_id: response.application_id,
            last_completed_step: response.last_completed_step,
            progress: response.progress,
          });
          setShowExistingModal(true);
        } else if (response.application_id) {
          onNavigate(`applications/${response.application_id}/edit`);
        }
      }
    } catch (err) {
      console.error("Error creating application:", err);
      alert("Failed to create application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedExistingApp = (stepUrlParam) => {
    setShowExistingModal(false);
    onNavigate(
      `applications/${existingAppData.application_id}/edit?step=${stepUrlParam}`,
    );
  };

  return (
    <div className="cap-page">
      {/* ── Page Header ── */}
      <div className="cap-header">
        <div className="cap-header-left">
          <button onClick={() => onNavigate("applications")} className="cap-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div>
            <h1 className="cap-title">Create New Application</h1>
            <p className="cap-subtitle">Search and select a student lead to begin</p>
          </div>
        </div>
      </div>

      {/* ── Mini Progress Indicator ── */}
      <div className="cap-progress">
        <div className={`cap-progress-step ${selectedLead ? 'done' : 'active'}`}>
          <div className="cap-pstep-circle">
            {selectedLead ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : '1'}
          </div>
          <span>Search Student</span>
        </div>
        <div className="cap-progress-line" />
        <div className={`cap-progress-step ${selectedLead ? 'active' : 'pending'}`}>
          <div className="cap-pstep-circle">2</div>
          <span>Select & Configure</span>
        </div>
        <div className="cap-progress-line" />
        <div className="cap-progress-step pending">
          <div className="cap-pstep-circle">3</div>
          <span>Continue</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          STEP 1: Lead Search
         ══════════════════════════════════════════════════════ */}
      <div className="cap-card">
        <div className="cap-card-header">
          <div className="cap-card-icon cap-icon-search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div>
            <h2 className="cap-card-title">Search for Student</h2>
            <p className="cap-card-desc">Find a lead by student name, email, or phone number</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="cap-search-form">
          <div className="cap-search-input-wrap">
            <svg className="cap-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Type student name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cap-search-input"
            />
          </div>
          <button type="submit" disabled={isSearching} className="cap-search-btn">
            {isSearching ? (
              <><span className="cap-spinner" /> Searching...</>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {leads.length > 0 && !selectedLead && (
          <div className="cap-table-wrap">
            <table className="cap-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Grade</th>
                  <th>Parent Contact</th>
                  <th>Email</th>
                  <th>Lead Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="cap-student-cell">
                        <div className="cap-avatar">
                          {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                        </div>
                        <span>{lead.first_name} {lead.last_name}</span>
                      </div>
                    </td>
                    <td><span className="cap-grade-badge">{lead.desired_class}</span></td>
                    <td>{lead.phone}</td>
                    <td>{lead.email}</td>
                    <td>
                      <span className="cap-score-badge">
                        {lead.lead_score || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={`cap-status-pill cap-status-${lead.follow_up_status}`}>
                        {lead.follow_up_status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="cap-select-btn"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead && (
        <>
          {/* ══════════════════════════════════════════════════════
              STEP 2: Selected Student Card
             ══════════════════════════════════════════════════════ */}
          <div className="cap-card cap-selected-card">
            <div className="cap-card-header">
              <div className="cap-card-icon cap-icon-student">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="cap-card-header-text">
                <h2 className="cap-card-title">Selected Student</h2>
                <p className="cap-card-desc">Review the selected lead details below</p>
              </div>
              <button className="cap-change-btn" onClick={() => setSelectedLead(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Change Student
              </button>
            </div>

            <div className="cap-student-profile">
              <div className="cap-profile-avatar">
                {selectedLead.first_name?.charAt(0)}{selectedLead.last_name?.charAt(0)}
              </div>
              <div className="cap-profile-info">
                <h3 className="cap-profile-name">
                  {selectedLead.first_name} {selectedLead.last_name}
                </h3>
                <span className="cap-profile-id">Lead #{selectedLead.id}</span>
              </div>
            </div>

            <div className="cap-detail-grid">
              <div className="cap-detail-item">
                <div className="cap-detail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/>
                  </svg>
                </div>
                <div>
                  <span className="cap-detail-label">Grade Applied</span>
                  <span className="cap-detail-value">{selectedLead.desired_class}</span>
                </div>
              </div>
              <div className="cap-detail-item">
                <div className="cap-detail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <span className="cap-detail-label">Parent Contact</span>
                  <span className="cap-detail-value">{selectedLead.phone}</span>
                </div>
              </div>
              <div className="cap-detail-item">
                <div className="cap-detail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <span className="cap-detail-label">Email Address</span>
                  <span className="cap-detail-value">{selectedLead.email}</span>
                </div>
              </div>
              <div className="cap-detail-item">
                <div className="cap-detail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <span className="cap-detail-label">Lead Status</span>
                  <span className={`cap-status-pill cap-status-${selectedLead.follow_up_status}`}>
                    {selectedLead.follow_up_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              STEP 3: Application Information
             ══════════════════════════════════════════════════════ */}
          <div className="cap-card">
            <div className="cap-card-header">
              <div className="cap-card-icon cap-icon-config">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div>
                <h2 className="cap-card-title">Application Information</h2>
                <p className="cap-card-desc">Configure the academic year and admission type</p>
              </div>
            </div>

            <div className="cap-form-grid">
              <div className="cap-form-field">
                <label className="cap-field-label cap-required">Academic Year</label>
                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(parseInt(e.target.value))}
                  className="cap-field-input"
                >
                  <option value={1}>2024-25</option>
                  <option value={2}>2025-26</option>
                </select>
              </div>

              <div className="cap-form-field">
                <label className="cap-field-label cap-required">Admission Type</label>
                <select
                  value={admissionType}
                  onChange={(e) => setAdmissionType(e.target.value)}
                  className="cap-field-input"
                >
                  <option value="new">New Admission</option>
                  <option value="transfer">Transfer</option>
                  <option value="regular">Sibling</option>
                  <option value="re-admission">Re-admission</option>
                </select>
              </div>
            </div>

            {admissionType === "transfer" && (
              <div className="cap-form-grid cap-transfer-fields">
                <div className="cap-form-field">
                  <label className="cap-field-label cap-required">Previous School Name</label>
                  <input
                    type="text"
                    value={previousSchoolName}
                    onChange={(e) => setPreviousSchoolName(e.target.value)}
                    className="cap-field-input"
                    placeholder="Enter previous school name"
                    required
                  />
                </div>
                <div className="cap-form-field">
                  <label className="cap-field-label">Reason for Change</label>
                  <input
                    type="text"
                    value={reasonForChange}
                    onChange={(e) => setReasonForChange(e.target.value)}
                    className="cap-field-input"
                    placeholder="Enter reason for change (optional)"
                  />
                </div>
              </div>
            )}

            <div className="cap-continue-section">
              <div className="cap-continue-info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>You'll complete the full application form in the next step</span>
              </div>
              <button
                className="cap-continue-btn"
                onClick={handleContinue}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><span className="cap-spinner" /> Processing...</>
                ) : (
                  <>
                    Continue to Full Application
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Existing Application Modal */}
      {showExistingModal && existingAppData && (
        <ExistingApplicationModal
          applicationId={existingAppData.application_id}
          lastCompletedStep={existingAppData.last_completed_step}
          progress={existingAppData.progress}
          onProceed={handleProceedExistingApp}
          onClose={() => setShowExistingModal(false)}
        />
      )}
    </div>
  );
};

export default CreateApplicationPage;
