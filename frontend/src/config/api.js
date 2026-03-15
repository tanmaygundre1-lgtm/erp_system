// Centralized API base URL - uses Vite proxy so /api calls go to http://127.0.0.1:5001
export const API_BASE_URL = '/api';

// Generic fetch helper
const apiFetch = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ── Admissions ──────────────────────────────────────────────
export const getAdmissionStats = () => apiFetch('/admissions/stats');
export const searchAdmissions = (query) =>
  apiFetch(`/admissions/search?query=${encodeURIComponent(query)}`);
export const getAllAdmissions = (limit = 10, offset = 0) =>
  apiFetch(`/admissions?limit=${limit}&offset=${offset}`);
export const getAdmissionById = (id) => apiFetch(`/admissions/${id}`);
export const createApplicationFromLead = (body) => 
  apiFetch('/admissions/create-from-lead', { method: 'POST', body: JSON.stringify(body) });
export const submitAdmission = (body) => 
  apiFetch('/admissions/submit', { method: 'POST', body: JSON.stringify(body) });

// ── Leads ────────────────────────────────────────────────────
export const getAllLeads = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/leads${qs ? `?${qs}` : ''}`);
};
export const getLeadById = (id) => apiFetch(`/leads/${id}`);
export const createLead = (body) =>
  apiFetch('/leads', { method: 'POST', body: JSON.stringify(body) });
export const updateLeadStatus = (id, body) =>
  apiFetch(`/leads/${id}/status`, { method: 'PUT', body: JSON.stringify(body) });
export const searchLeads = (query) => 
  apiFetch(`/leads/search?q=${encodeURIComponent(query)}`);

// ── Schools ──────────────────────────────────────────────────
export const getAllSchools = () => apiFetch('/schools');
export const getSchoolById = (id) => apiFetch(`/schools/${id}`);

// ── Students ─────────────────────────────────────────────────
export const getAllStudents = () => apiFetch('/students');
export const getStudentById = (id) => apiFetch(`/students/${id}`);
export const saveStudent = (body) => 
  apiFetch('/students/save', { method: 'POST', body: JSON.stringify(body) });

// ── Parents ──────────────────────────────────────────────────
export const getParentById = (id) => apiFetch(`/parents/${id}`);
export const saveParent = (body) =>
  apiFetch('/parents/save', { method: 'POST', body: JSON.stringify(body) });

// ── Documents ────────────────────────────────────────────────
export const uploadDocument = (body) =>
  apiFetch('/admissions/documents/upload', { method: 'POST', body: JSON.stringify(body) });

// ── Academic Details ──────────────────────────────────────────
export const saveAcademicDetails = (body) =>
  apiFetch('/admissions/save-academic', { method: 'POST', body: JSON.stringify(body) });

// ── Application Progress ─────────────────────────────────────
export const getApplicationProgress = (applicationId) =>
  apiFetch(`/admissions/${applicationId}/progress`);

export const updateApplicationProgress = (applicationId, body) =>
  apiFetch(`/admissions/${applicationId}/progress`, { method: 'PUT', body: JSON.stringify(body) });

// ── Health ───────────────────────────────────────────────────
export const getHealth = () => apiFetch('/health');
