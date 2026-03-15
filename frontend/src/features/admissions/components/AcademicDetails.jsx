import React from 'react';

const AcademicDetails = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="step-card">
      <div className="step-card-header">
        <h3>Academic Details</h3>
        <p className="step-card-subtitle">Set the academic year, class, and section</p>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label className="field-label required">Academic Year</label>
          <select
            className="field-input"
            value={data.academic_year_id}
            onChange={(e) => handleChange('academic_year_id', parseInt(e.target.value))}
          >
            <option value={1}>2024-25</option>
            <option value={2}>2025-26</option>
          </select>
        </div>

        <div className="form-field">
          <label className="field-label required">Class</label>
          <select
            className="field-input"
            value={data.class_id}
            onChange={(e) => handleChange('class_id', parseInt(e.target.value))}
          >
            <option value={1}>Class 1</option>
            <option value={2}>Class 2</option>
            <option value={3}>Class 10</option>
          </select>
        </div>

        <div className="form-field">
          <label className="field-label required">Section</label>
          <select
            className="field-input"
            value={data.section_id}
            onChange={(e) => handleChange('section_id', parseInt(e.target.value))}
          >
            <option value={1}>Section A</option>
            <option value={2}>Section B</option>
            <option value={3}>Section C</option>
          </select>
        </div>

        <div className="form-field">
          <label className="field-label required">Admission Type</label>
          <select
            className="field-input"
            value={data.admission_type}
            onChange={(e) => handleChange('admission_type', e.target.value)}
          >
            <option value="new">New Admission</option>
            <option value="transfer">Transfer</option>
            <option value="regular">Regular</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AcademicDetails;
