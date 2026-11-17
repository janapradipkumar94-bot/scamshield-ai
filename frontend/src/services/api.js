/**
 * Centralized API client for ScamShield AI.
 * Handles token management, REST calls, and error parsing.
 */

let rawBase = (import.meta.env.VITE_API_URL || '').trim();
if (rawBase && !rawBase.startsWith('http://') && !rawBase.startsWith('https://') && !rawBase.startsWith('/')) {
  rawBase = `https://${rawBase}`;
}
const API_BASE = rawBase ? `${rawBase.replace(/\/$/, '')}/api` : '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('scamshield_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (response.status === 401) {
    // If token invalid, clear local credentials
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/register') {
      localStorage.removeItem('scamshield_token');
      localStorage.removeItem('scamshield_user');
    }
  }

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.detail || (typeof data === 'string' ? data : 'An error occurred with the request');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // --- Scanning Endpoints ---
  scanText: async (payload) => {
    const res = await fetch(`${API_BASE}/scan/text`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  scanURL: async (payload) => {
    const res = await fetch(`${API_BASE}/scan/url`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  scanEmail: async (payload) => {
    const res = await fetch(`${API_BASE}/scan/email`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // --- Auth Endpoints ---
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // --- User History Endpoints ---
  getHistory: async () => {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  deleteScan: async (scanId) => {
    const res = await fetch(`${API_BASE}/history/${scanId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  clearAllHistory: async () => {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // --- Reports & Feedback ---
  submitReport: async (reportData) => {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData),
    });
    return handleResponse(res);
  },

  submitFeedback: async (feedbackData) => {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(feedbackData),
    });
    return handleResponse(res);
  },

  // --- Admin Endpoints ---
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getAdminReports: async (statusFilter = '') => {
    const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    const res = await fetch(`${API_BASE}/admin/reports${query}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateReportStatus: async (reportId, updateData) => {
    const res = await fetch(`${API_BASE}/admin/reports/${reportId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateUserRole: async (userId, newRole) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role?new_role=${newRole}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getAdminFeedback: async () => {
    const res = await fetch(`${API_BASE}/admin/feedback`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // --- Health Endpoint ---
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
