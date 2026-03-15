import React, { useState, useEffect } from "react";
import {
  getAdmissionById,
  getApplicationProgress,
  saveStudent,
  saveParent,
  submitAdmission,
  updateApplicationProgress,
} from "../../../config/api.js";

import ApplicationSteps from "../components/ApplicationSteps.jsx";
import StudentInfo from "../components/StudentInfo.jsx";
import ParentInfo from "../components/ParentInfo.jsx";
import AcademicDetails from "../components/AcademicDetails.jsx";
import PhotosAndID from "../components/PhotosAndID.jsx";
import Documents from "../components/Documents.jsx";
import ReviewSubmit from "../components/ReviewSubmit.jsx";

import "./FullApplicationForm.css";

const STEP_NAMES = {
  0: "student_info_status",
  1: "parent_info_status",
  2: "academic_details_status",
  3: "photos_status",
  4: "documents_status",
  5: "review_status",
};

const FullApplicationForm = ({
  applicationId,
  initialStep = 0,
  onNavigate,
}) => {
  const getInitialStep = () => {
    if (initialStep !== undefined && initialStep !== null) {
      return initialStep;
    }
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    return stepParam ? parseInt(stepParam) - 1 : 0;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Progress tracking
  const [progress, setProgress] = useState({
    student_info_status: "pending",
    parent_info_status: "pending",
    academic_details_status: "pending",
    photos_status: "pending",
    documents_status: "pending",
    review_status: "pending",
  });

  // Form State
  const [studentData, setStudentData] = useState({
    id: null,
    school_id: 1,
    admission_id: applicationId,
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "Male",
    blood_group: "",
    email: "",
    phone: "",
    nationality: "",
    religion: "",
  });

  const [parentData, setParentData] = useState({
    relation: "Father",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    occupation: "",
  });

  const [academicData, setAcademicData] = useState({
    academic_year_id: 1,
    class_id: 1,
    section_id: 1,
    admission_type: "new",
  });

  const [documents, setDocuments] = useState({
    student_photo: null,
    aadhar_card: null,
    birth_certificate: null,
    previous_marksheet: null,
    transfer_certificate: null,
  });

  useEffect(() => {
    fetchAdmissionData();
  }, [applicationId]);

  // Derive completedSteps from progress
  useEffect(() => {
    const completed = [];
    Object.entries(STEP_NAMES).forEach(([idx, key]) => {
      if (progress[key] === "completed") {
        completed.push(parseInt(idx));
      }
    });
    setCompletedSteps(completed);
  }, [progress]);

  const fetchAdmissionData = async () => {
    try {
      setLoading(true);
      const [admissionRes, progressRes] = await Promise.all([
        getAdmissionById(applicationId),
        getApplicationProgress(applicationId),
      ]);

      if (admissionRes.success && admissionRes.data) {
        const data = admissionRes.data;
        setStudentData((prev) => ({
          ...prev,
          id: data.student_id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          date_of_birth: data.date_of_birth
            ? data.date_of_birth.substring(0, 10)
            : "",
          gender: data.gender || "Male",
          email: data.email || "",
          phone: data.phone || "",
        }));

        setAcademicData((prev) => ({
          ...prev,
          academic_year_id: data.academic_year_id || 1,
          class_id: data.class_id || 1,
          section_id: data.section_id || 1,
          admission_type: data.admission_type || "new",
        }));

        if (data.parent_first_name) {
          setParentData({
            relation: data.relation || "Father",
            first_name: data.parent_first_name || "",
            last_name: data.parent_last_name || "",
            phone: data.parent_phone || "",
            email: data.parent_email || "",
            occupation: data.occupation || "",
          });
        }
      }

      if (progressRes.success && progressRes.data) {
        setProgress({
          student_info_status:
            progressRes.data.student_info_status || "pending",
          parent_info_status: progressRes.data.parent_info_status || "pending",
          academic_details_status:
            progressRes.data.academic_details_status || "pending",
          photos_status: progressRes.data.photos_status || "pending",
          documents_status: progressRes.data.documents_status || "pending",
          review_status: progressRes.data.review_status || "pending",
        });
      }
    } catch (err) {
      console.error("Error fetching admission details:", err);
      setError("Failed to load application data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (currentStep === 0) {
        const res = await saveStudent(studentData);
        if (res.success) {
          setStudentData((prev) => ({ ...prev, id: res.data.id }));
          await updateApplicationProgress(applicationId, {
            step_name: STEP_NAMES[0],
          });
        }
      } else if (currentStep === 1) {
        await saveParent({
          ...parentData,
          student_id: studentData.id,
          school_id: studentData.school_id,
        });
        await updateApplicationProgress(applicationId, {
          step_name: STEP_NAMES[1],
        });
      } else if (currentStep === 2) {
        await updateApplicationProgress(applicationId, {
          step_name: STEP_NAMES[2],
        });
      } else if (currentStep === 3) {
        await updateApplicationProgress(applicationId, {
          step_name: STEP_NAMES[3],
        });
      } else if (currentStep === 4) {
        await updateApplicationProgress(applicationId, {
          step_name: STEP_NAMES[4],
        });
      }

      // Mark current step as completed
      setProgress((prev) => ({
        ...prev,
        [STEP_NAMES[currentStep]]: "completed",
      }));

      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } catch (err) {
      console.error("Step save error:", err);
      setError(err.message || "Error occurred while saving data.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = () => {
    // Save current state silently (no step advancement)
    console.log("Draft saved");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitAdmission({ admission_id: applicationId });
      if (res.success) {
        alert("Application submitted successfully!");
        onNavigate("applications");
      }
    } catch (err) {
      setError("Failed to submit application. " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocChange = (field, file) => {
    setDocuments((prev) => ({ ...prev, [field]: file }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StudentInfo data={studentData} onChange={setStudentData} />;
      case 1:
        return <ParentInfo data={parentData} onChange={setParentData} />;
      case 2:
        return <AcademicDetails data={academicData} onChange={setAcademicData} />;
      case 3:
        return <PhotosAndID documents={documents} onDocChange={handleDocChange} />;
      case 4:
        return <Documents documents={documents} onDocChange={handleDocChange} />;
      case 5:
        return (
          <ReviewSubmit
            studentData={studentData}
            parentData={parentData}
            academicData={academicData}
            documents={documents}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="af-loading">
        <div className="af-spinner" />
        <p>Loading application data...</p>
      </div>
    );
  }

  return (
    <div className="af-page">
      {/* ── Page Header ── */}
      <div className="af-page-header">
        <div className="af-header-left">
          <button
            className="af-back-btn"
            onClick={() => onNavigate("applications")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div>
            <h1 className="af-title">New Application</h1>
            <p className="af-subtitle">Complete all steps to submit</p>
          </div>
        </div>
        <div className="af-header-right">
          <button className="af-bulk-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Bulk Upload
          </button>
        </div>
      </div>

      {/* ── Step Progress Bar ── */}
      <ApplicationSteps
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={(idx) => !submitting && setCurrentStep(idx)}
      />

      {/* ── Error Alert ── */}
      {error && (
        <div className="af-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{error}</span>
          <button className="af-error-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className="af-form-card">
        <div className="af-step-content">{renderStep()}</div>
      </div>

      {/* ── Footer Navigation ── */}
      <div className="af-footer">
        <div className="af-footer-left">
          <button
            className="af-btn af-btn-prev"
            onClick={handleBack}
            disabled={currentStep === 0 || submitting}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Previous
          </button>
        </div>
        <div className="af-footer-right">
          <button
            className="af-btn af-btn-draft"
            onClick={handleSaveDraft}
            disabled={submitting}
          >
            Save Draft
          </button>
          {currentStep < 5 ? (
            <button
              className="af-btn af-btn-next"
              onClick={handleNext}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Next"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ) : (
            <button
              className="af-btn af-btn-submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullApplicationForm;
