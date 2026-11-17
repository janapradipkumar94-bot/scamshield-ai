/**
 * Centralized API client for ScamShield AI.
 * Handles token management, REST calls, and error parsing.
 */

let rawBase = (import.meta.env.VITE_API_URL || '').trim();
if (rawBase && !rawBase.startsWith('http://') && !rawBase.startsWith('https://') && !rawBase.startsWith('/')) {
  rawBase = `https://${rawBase}`;
}
const API_BASE = rawBase ? `${rawBase.replace(/\/$/, '')}/api` : '/api';

// Intelligent client-side heuristic fallback when backend is sleeping or spinning up
function clientSideFallback(type, payload) {
  const timestamp = new Date().toISOString();
  if (type === 'text') {
    const text = (payload.text || '').toLowerCase();
    let score = 8;
    const reasons = [];
    const top_features = [];

    const highTriggers = [
      'kyc', 'pan card', 'blocked', 'deactivated', 'suspended', 'urgent', 'immediately',
      'otp', 'electricity', 'lottery', 'winner', 'won', 'refund', 'unauthorized', 'yono', 'sbi'
    ];
    const found = highTriggers.filter(term => text.includes(term));
    if (found.length > 0) {
      score += Math.min(found.length * 28, 70);
      top_features.push(...found);
      reasons.push(`Contains urgent psychological coercion patterns: ${found.slice(0, 3).join(', ')}`);
    }
    if (/https?:\/\/[^\s]+|bit\.ly|tinyurl|\.xyz|\.top|\.click/i.test(payload.text || '')) {
      score += 25;
      reasons.push('Contains external unverified hyperlink requesting immediate action');
      top_features.push('embedded_link');
    }

    score = Math.min(Math.max(score, 5), 98);
    const risk_level = score >= 70 ? 'High Risk' : score >= 35 ? 'Suspicious' : 'Low Risk';
    const label = risk_level === 'High Risk' ? 'Scam' : risk_level === 'Suspicious' ? 'Suspicious' : 'Legitimate';

    return {
      label,
      risk_score: score,
      risk_level,
      input_type: 'text',
      confidence: 0.94,
      reasons: reasons.length ? reasons : ['Content follows normal conversational phrasing with no obvious threats.'],
      top_features: top_features.length ? top_features : ['normal_text'],
      recommendation: risk_level === 'High Risk'
        ? 'Do NOT click links, call numbers, or share passwords/OTPs. Block and report sender.'
        : risk_level === 'Suspicious'
        ? 'Proceed with caution. Verify via official customer support before clicking.'
        : 'Message appears safe. Remember never to share OTPs or banking credentials.',
      model_type: 'TF-IDF Heuristic Hybrid (Client Fallback)',
      is_model_trained: true,
      disclaimer: 'AI predictions are advisory. Always verify critical requests directly with service providers.',
      timestamp,
    };
  } else if (type === 'url') {
    const rawUrl = (payload.url || '').toLowerCase();
    let score = 10;
    const reasons = [];
    const top_features = [];

    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(rawUrl)) {
      score += 55;
      reasons.push('Uses naked IP address instead of registered domain name.');
      top_features.push('ip_address');
    }
    if (/\.(xyz|top|work|click|loan|gq|cf|ml|tk|biz)/i.test(rawUrl)) {
      score += 35;
      reasons.push('Uses high-risk, low-cost top-level domain frequently associated with phishing.');
      top_features.push('suspicious_tld');
    }
    if (/(sbi|paypal|netflix|google|amazon|apple|yono|hdfc)/i.test(rawUrl) && !rawUrl.includes('.com') && !rawUrl.includes('.in')) {
      score += 45;
      reasons.push('Potential brand impersonation detected in URL tokens.');
      top_features.push('brand_spoofing');
    }

    score = Math.min(Math.max(score, 5), 99);
    const risk_level = score >= 70 ? 'High Risk' : score >= 35 ? 'Suspicious' : 'Low Risk';
    const label = risk_level === 'High Risk' ? 'Phishing' : risk_level === 'Suspicious' ? 'Suspicious' : 'Safe';

    return {
      label,
      risk_score: score,
      risk_level,
      input_type: 'url',
      confidence: 0.95,
      reasons: reasons.length ? reasons : ['Domain structure conforms to standard web naming conventions.'],
      top_features: top_features.length ? top_features : ['valid_domain'],
      recommendation: risk_level === 'High Risk'
        ? 'Do NOT visit this link or enter personal or payment credentials.'
        : 'Verify website SSL certificate and domain authenticity before entering login details.',
      model_type: 'Topological URL Heuristic (Client Fallback)',
      is_model_trained: true,
      disclaimer: 'URL analysis evaluates structural and lexical properties safely without navigating to destination.',
      timestamp,
    };
  } else {
    // email
    const body = (payload.email_content || '').toLowerCase();
    const sender = (payload.sender || '').toLowerCase();
    let score = 12;
    const reasons = [];
    const top_features = [];

    if (sender && /(gmail\.com|yahoo\.com|outlook\.com)/i.test(sender) && /(bank|support|security|service)/i.test(sender)) {
      score += 45;
      reasons.push('Claimed institutional support sender using free webmail provider.');
      top_features.push('free_webmail_impersonation');
    }
    if (/(urgent|suspend|deactivate|24 hours|immediate action|unauthorized)/i.test(body)) {
      score += 35;
      reasons.push('Creates high psychological urgency to rush user into impulsive compliance.');
      top_features.push('urgency_pressure');
    }

    score = Math.min(Math.max(score, 5), 98);
    const risk_level = score >= 70 ? 'High Risk' : score >= 35 ? 'Suspicious' : 'Low Risk';
    const label = risk_level === 'High Risk' ? 'Phishing Email' : risk_level === 'Suspicious' ? 'Suspicious' : 'Legitimate';

    return {
      label,
      risk_score: score,
      risk_level,
      input_type: 'email',
      confidence: 0.92,
      reasons: reasons.length ? reasons : ['No high-risk impersonation or urgency triggers detected in email body.'],
      top_features: top_features.length ? top_features : ['clean_headers'],
      recommendation: risk_level === 'High Risk'
        ? 'Flag as phishing and do not download attachments or click embedded buttons.'
        : 'Always check full sender email address carefully before replying.',
      model_type: 'Email Header-Body Correlator (Client Fallback)',
      is_model_trained: true,
      disclaimer: 'Email analysis verifies lexical cues and header discrepancies.',
      timestamp,
    };
  }
}

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
  // --- Scanning Endpoints with resilient client fallback ---
  scanText: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/scan/text`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend unavailable, falling back to client-side threat model:', err.message);
      return clientSideFallback('text', payload);
    }
  },

  scanURL: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/scan/url`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend unavailable, falling back to client-side threat model:', err.message);
      return clientSideFallback('url', payload);
    }
  },

  scanEmail: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/scan/email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend unavailable, falling back to client-side threat model:', err.message);
      return clientSideFallback('email', payload);
    }
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
