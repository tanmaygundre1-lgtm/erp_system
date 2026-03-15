import React from 'react';
import './ApplicationSteps.css';

const STEPS = [
  { number: 1, label: 'Student Info' },
  { number: 2, label: 'Parent Info' },
  { number: 3, label: 'Academic Details' },
  { number: 4, label: 'Photos & ID' },
  { number: 5, label: 'Documents' },
  { number: 6, label: 'Review & Submit' },
];

const ApplicationSteps = ({ currentStep, completedSteps = [], onStepClick }) => {
  return (
    <div className="stepper-container">
      <div className="stepper">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = index === currentStep;
          const isPending = !isCompleted && !isCurrent;
          const isClickable = isCompleted || index <= currentStep;

          // Determine connector state (the line AFTER this step)
          const connectorDone = index < currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step node */}
              <div
                className={`stepper-step ${isCurrent ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''} ${isPending ? 'is-pending' : ''}`}
                onClick={() => isClickable && onStepClick && onStepClick(index)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
              >
                <div className="stepper-circle">
                  {isCompleted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span className="stepper-label">{step.label}</span>
              </div>

              {/* Connector line between steps (not after the last step) */}
              {index < STEPS.length - 1 && (
                <div className={`stepper-connector ${connectorDone ? 'connector-done' : ''}`}>
                  <div className="connector-line" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationSteps;
