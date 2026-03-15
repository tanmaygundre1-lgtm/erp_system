import React from 'react';

const Documents = ({ documents, onDocChange }) => {
  return (
    <div className="step-card">
      <div className="step-card-header">
        <h3>Documents</h3>
        <p className="step-card-subtitle">Upload additional documents required for admission</p>
      </div>

      <div className="upload-grid">
        <div className="upload-zone">
          <div className="upload-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <p className="upload-title">Previous Marksheet</p>
          <p className="upload-hint">PDF, JPG, PNG up to 5MB</p>
          <label className="upload-btn">
            Choose File
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onDocChange('previous_marksheet', e.target.files[0])}
              hidden
            />
          </label>
          {documents.previous_marksheet && (
            <p className="upload-filename">✓ {documents.previous_marksheet.name}</p>
          )}
        </div>

        <div className="upload-zone">
          <div className="upload-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p className="upload-title">Transfer Certificate</p>
          <p className="upload-hint">PDF, JPG, PNG up to 5MB</p>
          <label className="upload-btn">
            Choose File
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onDocChange('transfer_certificate', e.target.files[0])}
              hidden
            />
          </label>
          {documents.transfer_certificate && (
            <p className="upload-filename">✓ {documents.transfer_certificate.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
