import React, { useState } from "react";
import "./AdmissionForm.css";

const AdmissionForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    student: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "Male",
      email: "",
      phone: "",
    },
    parent: {
      relation: "Father",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      occupation: "",
    },
    admission: {
      academic_year_id: 1, // Defaulting for simple demo
      class_id: 1,
      section_id: 1,
      admission_date: new Date().toISOString().split("T")[0],
      school_id: 1,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:5000/api/admissions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create admission");
      }

      setSuccessMsg(`Admission created successfully! ID: ${result.admission_id}`);
      // Clear form conceptually or navigate back
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      console.error("Submission Error:", error);
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admission-form-container">
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>&larr; Back to Applications</button>
        <h2>Create Admission</h2>
        <p>Fill out the details below to create a new admission record.</p>
      </div>

      {successMsg && <div className="alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert-error">{errorMsg}</div>}

      <form className="admission-form" onSubmit={handleSubmit}>
        {/* STUDENT INFO */}
        <div className="form-section">
          <h3>1. Student Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" required value={formData.student.first_name} onChange={(e) => handleChange("student", "first_name", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" required value={formData.student.last_name} onChange={(e) => handleChange("student", "last_name", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={formData.student.date_of_birth} onChange={(e) => handleChange("student", "date_of_birth", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={formData.student.gender} onChange={(e) => handleChange("student", "gender", e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.student.email} onChange={(e) => handleChange("student", "email", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={formData.student.phone} onChange={(e) => handleChange("student", "phone", e.target.value)} />
            </div>
          </div>
        </div>

        {/* PARENT INFO */}
        <div className="form-section">
          <h3>2. Parent Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Relation</label>
              <select value={formData.parent.relation} onChange={(e) => handleChange("parent", "relation", e.target.value)}>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
            <div className="form-group">
              <label>Parent First Name *</label>
              <input type="text" required value={formData.parent.first_name} onChange={(e) => handleChange("parent", "first_name", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Parent Last Name</label>
              <input type="text" value={formData.parent.last_name} onChange={(e) => handleChange("parent", "last_name", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" required value={formData.parent.phone} onChange={(e) => handleChange("parent", "phone", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.parent.email} onChange={(e) => handleChange("parent", "email", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input type="text" value={formData.parent.occupation} onChange={(e) => handleChange("parent", "occupation", e.target.value)} />
            </div>
          </div>
        </div>

        {/* ADMISSION INFO */}
        <div className="form-section">
          <h3>3. Admission Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Admission Date *</label>
              <input type="date" required value={formData.admission.admission_date} onChange={(e) => handleChange("admission", "admission_date", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Academic Year ID</label>
              <input type="number" value={formData.admission.academic_year_id} onChange={(e) => handleChange("admission", "academic_year_id", parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Class ID</label>
              <input type="number" value={formData.admission.class_id} onChange={(e) => handleChange("admission", "class_id", parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Section ID</label>
              <input type="number" value={formData.admission.section_id} onChange={(e) => handleChange("admission", "section_id", parseInt(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Admission"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;
