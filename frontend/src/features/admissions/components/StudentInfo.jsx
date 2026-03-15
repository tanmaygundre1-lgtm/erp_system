import React from 'react';

const StudentInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="step-card">
      <div className="step-card-header">
        <h3>Student Information</h3>
        <p className="step-card-subtitle">Enter the student's personal details</p>
      </div>

      <div className="form-grid-2">
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
          <label className="field-label required">Last Name</label>
          <input
            type="text"
            className="field-input"
            placeholder="Enter last name"
            value={data.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label required">Date of Birth</label>
          <input
            type="date"
            className="field-input"
            value={data.date_of_birth}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label required">Gender</label>
          <select
            className="field-input"
            value={data.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label className="field-label">Blood Group</label>
          <select
            className="field-input"
            value={data.blood_group}
            onChange={(e) => handleChange('blood_group', e.target.value)}
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="form-field">
          <label className="field-label required">Nationality</label>
          <input
            type="text"
            className="field-input"
            placeholder="Enter nationality"
            value={data.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
          />
        </div>
      </div>

      {/* Religion spans full width */}
      <div className="form-grid-1">
        <div className="form-field">
          <label className="field-label">Religion</label>
          <input
            type="text"
            className="field-input"
            placeholder="Enter religion"
            value={data.religion}
            onChange={(e) => handleChange('religion', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
