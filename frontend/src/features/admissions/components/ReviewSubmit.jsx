import React from 'react';

const ReviewSubmit = ({ studentData, parentData, academicData, documents }) => {
  const renderField = (label, value) => (
    <div className="review-field">
      <span className="review-label">{label}</span>
      <span className="review-value">{value || '—'}</span>
    </div>
  );

  const admissionTypeLabels = {
    new: 'New Admission',
    transfer: 'Transfer',
    regular: 'Regular',
  };

  return (
    <div className="step-card">
      <div className="step-card-header">
        <h3>Review & Submit</h3>
        <p className="step-card-subtitle">Please review all information before submitting</p>
      </div>

      {/* Student Info Review */}
      <div className="review-section">
        <div className="review-section-title">
          <span className="review-section-icon">👤</span>
          Student Information
        </div>
        <div className="review-grid">
          {renderField('First Name', studentData.first_name)}
          {renderField('Last Name', studentData.last_name)}
          {renderField('Date of Birth', studentData.date_of_birth)}
          {renderField('Gender', studentData.gender)}
          {renderField('Blood Group', studentData.blood_group)}
          {renderField('Nationality', studentData.nationality)}
          {renderField('Religion', studentData.religion)}
          {renderField('Email', studentData.email)}
          {renderField('Phone', studentData.phone)}
        </div>
      </div>

      {/* Parent Info Review */}
      <div className="review-section">
        <div className="review-section-title">
          <span className="review-section-icon">👨‍👩‍👦</span>
          Parent Information
        </div>
        <div className="review-grid">
          {renderField('Relation', parentData.relation)}
          {renderField('First Name', parentData.first_name)}
          {renderField('Last Name', parentData.last_name)}
          {renderField('Phone', parentData.phone)}
          {renderField('Email', parentData.email)}
          {renderField('Occupation', parentData.occupation)}
        </div>
      </div>

      {/* Academic Detail Review */}
      <div className="review-section">
        <div className="review-section-title">
          <span className="review-section-icon">🎓</span>
          Academic Details
        </div>
        <div className="review-grid">
          {renderField('Academic Year', academicData.academic_year_id === 1 ? '2024-25' : '2025-26')}
          {renderField('Admission Type', admissionTypeLabels[academicData.admission_type] || academicData.admission_type)}
        </div>
      </div>

      {/* Documents Review */}
      <div className="review-section">
        <div className="review-section-title">
          <span className="review-section-icon">📄</span>
          Documents Uploaded
        </div>
        <div className="review-grid">
          {renderField('Student Photo', documents.student_photo?.name)}
          {renderField('Aadhar Card', documents.aadhar_card?.name)}
          {renderField('Birth Certificate', documents.birth_certificate?.name)}
          {renderField('Previous Marksheet', documents.previous_marksheet?.name)}
          {renderField('Transfer Certificate', documents.transfer_certificate?.name)}
        </div>
      </div>

      <div className="review-disclaimer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>By submitting, you confirm that all information provided is accurate and complete.</span>
      </div>
    </div>
  );
};

export default ReviewSubmit;
