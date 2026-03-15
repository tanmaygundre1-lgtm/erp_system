import React from 'react';

const PhotosAndID = ({ documents, onDocChange }) => {
  return (
    <div className="step-card">
      <div className="step-card-header">
        <h3>Photos & ID</h3>
        <p className="step-card-subtitle">Upload the student's photo and identity documents</p>
      </div>

      <div className="upload-grid">
        <div className="upload-zone">
          <div className="upload-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <p className="upload-title">Student Photo</p>
          <p className="upload-hint">JPG, PNG up to 5MB</p>
          <label className="upload-btn">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onDocChange('student_photo', e.target.files[0])}
              hidden
            />
          </label>
          {documents.student_photo && (
            <p className="upload-filename">✓ {documents.student_photo.name}</p>
          )}
        </div>

        <div className="upload-zone">
          <div className="upload-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <p className="upload-title">Aadhar Card</p>
          <p className="upload-hint">PDF, JPG, PNG up to 5MB</p>
          <label className="upload-btn">
            Choose File
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onDocChange('aadhar_card', e.target.files[0])}
              hidden
            />
          </label>
          {documents.aadhar_card && (
            <p className="upload-filename">✓ {documents.aadhar_card.name}</p>
          )}
        </div>

        <div className="upload-zone">
          <div className="upload-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <p className="upload-title">Birth Certificate</p>
          <p className="upload-hint">PDF, JPG, PNG up to 5MB</p>
          <label className="upload-btn">
            Choose File
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onDocChange('birth_certificate', e.target.files[0])}
              hidden
            />
          </label>
          {documents.birth_certificate && (
            <p className="upload-filename">✓ {documents.birth_certificate.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotosAndID;
