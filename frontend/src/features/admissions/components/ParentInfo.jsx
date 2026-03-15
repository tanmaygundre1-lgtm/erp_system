import React from 'react';

const ParentInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="step-card">
      <div className="step-card-header">
        <h3>Parent Information</h3>
        <p className="step-card-subtitle">Enter the parent or guardian's details</p>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label className="field-label required">Relation</label>
          <select
            className="field-input"
            value={data.relation}
            onChange={(e) => handleChange('relation', e.target.value)}
          >
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label className="field-label required">First Name</label>
          <input
            type="text"
            className="field-input"
            placeholder="Enter first name"
            value={data.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Last Name</label>
          <input
            type="text"
            className="field-input"
            placeholder="Enter last name"
            value={data.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label required">Phone</label>
          <input
            type="tel"
            className="field-input"
            placeholder="Enter phone number"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Email</label>
          <input
            type="email"
            className="field-input"
            placeholder="Enter email address"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Occupation</label>
          <input
            type="text"
            className="field-input"
            placeholder="Enter occupation"
            value={data.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ParentInfo;
