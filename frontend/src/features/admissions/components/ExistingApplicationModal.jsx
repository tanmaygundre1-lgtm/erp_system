import React from "react";
import "./ExistingApplicationModal.css";

const STEP_ITEMS = [
  "Student Info",
  "Parent Info",
  "Academic Details",
  "Photos & ID",
  "Documents",
  "Review & Submit",
];

const ExistingApplicationModal = ({
  applicationId,
  lastCompletedStep,
  progress,
  onProceed,
  onClose,
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex <= lastCompletedStep) {
      return "completed";
    }
    return "pending";
  };

  // Calculate the next incomplete step
  // lastCompletedStep is 0-indexed (e.g., 2 means steps 0,1,2 are done)
  // nextIncompleteStep is 0-indexed (e.g., 3 means step 3 should be shown)
  // For URL parameter, we need 1-indexed (e.g., step=4 to show the 4th step)
  const nextIncompleteStepIndex = lastCompletedStep + 1;
  const nextStepUrlParam = lastCompletedStep + 2; // Convert 0-indexed to 1-indexed for URL

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Application Already Exists</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="info-text">
            An application has already been created for this student.
          </p>

          <div className="progress-section">
            <h3>Application Progress</h3>

            <div className="steps-list">
              {STEP_ITEMS.map((step, index) => (
                <div
                  key={index}
                  className={`step-item step-${getStepStatus(index)}`}
                >
                  <div className="step-indicator">
                    {getStepStatus(index) === "completed" ? (
                      <span className="checkmark">✔</span>
                    ) : (
                      <span className="circle">○</span>
                    )}
                  </div>
                  <div className="step-label">{step}</div>
                  <div className="step-status">
                    {getStepStatus(index) === "completed"
                      ? "Completed"
                      : "Pending"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-section">
            <p>
              You can continue filling the application from{" "}
              <strong>
                {nextIncompleteStepIndex < STEP_ITEMS.length
                  ? STEP_ITEMS[nextIncompleteStepIndex]
                  : "Review & Submit"}
              </strong>{" "}
              step.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onProceed(nextStepUrlParam)}
          >
            Proceed to Complete Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExistingApplicationModal;
