/**
 * API client to communicate with the Django REST Framework backend.
 */

// Helper to get authorization headers
export function getAuthHeaders() {
  if (typeof window === 'undefined') return {};
  
  // We can look for the token in localStorage or cookie.
  // Standard simpleJWT implementation stores it as 'access_token' or 'admin_session'.
  const token = localStorage.getItem('access_token') || getCookie('admin_session');
  
  if (token && !token.startsWith('mock-')) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
  return {};
}

// Read cookie by name helper
export function getCookie(name) {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Centralized request wrapper
async function request(url, options = {}) {
  const { _retried, ...restOptions } = options;
  const isFormDataBody = (typeof FormData !== 'undefined') && (options.body instanceof FormData);
  const headers = {
    ...(isFormDataBody ? {} : { 'Content-Type': 'application/json' }),
    ...getAuthHeaders(),
    ...options.headers,
  };

  const config = {
    ...restOptions,
    headers,
  };

  // Connect directly to the Django backend. Use localhost so cookies can be shared with Next dev server.
  const finalUrl = url.startsWith('/') ? `http://localhost:8000${url}` : url;

  const response = await fetch(finalUrl, config);

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: response.statusText };
    }

    // Auto-refresh JWT access token once when it expires.
    // SimpleJWT typically returns: { code: "token_not_valid", detail: "Given token not valid for any token type", ... }
    if (
      response.status === 401 &&
      !_retried &&
      typeof window !== 'undefined' &&
      (errorData?.code === 'token_not_valid' || String(errorData?.detail || '').toLowerCase().includes('token not valid'))
    ) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return request(url, { ...restOptions, _retried: true });
      }
    }
    const message =
      errorData?.detail ||
      errorData?.message ||
      response.statusText ||
      `API request failed (HTTP ${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    if (typeof window !== 'undefined') {
      // Helps debugging API failures in the browser console.
      console.error('API error', { url: finalUrl, status: response.status, data: errorData });
    }
    throw error;
  }

  // Handle 204 No Content (e.g. DELETE operations)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function refreshAccessToken() {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh || refresh.startsWith('mock-')) return null;

    const res = await fetch('http://localhost:8000/api/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.access) return null;

    localStorage.setItem('access_token', data.access);
    document.cookie = `admin_session=${data.access}; path=/; max-age=86400`;
    return data.access;
  } catch {
    return null;
  }
}

export const api = {
  // ─── Auth APIs ─────────────────────────────────────────────────────────────
  async login(username, password) {
    const res = await request('/api/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.access) {
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);
      
      // Also write cookie to maintain compatibility with next middleware and custom frontends
      document.cookie = `admin_session=${res.access}; path=/; max-age=86400`;
    }
    return res;
  },

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  async getMe() {
    return request('/api/auth/me/');
  },

  // ─── Public CMS APIs ──────────────────────────────────────────────────────
  async getBlogPosts(tag = '') {
    const url = tag ? `/api/public/blog/?tags__name=${encodeURIComponent(tag)}` : '/api/public/blog/';
    return request(url);
  },

  async getBlogPostDetail(slug) {
    return request(`/api/public/blog/${slug}/`);
  },

  async getPortfolioItems(tag = '') {
    const url = tag ? `/api/public/portfolio/?tags__name=${encodeURIComponent(tag)}` : '/api/public/portfolio/';
    return request(url);
  },

  async getPortfolioItemDetail(slug) {
    return request(`/api/public/portfolio/${slug}/`);
  },

  // ─── Public Lead Submission ────────────────────────────────────────────────
  async createLead(leadData) {
    return request('/api/public/leads/', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // ─── Client dashboard APIs ─────────────────────────────────────────────────
  async getClientProjects() {
    return request('/api/client/projects/');
  },

  async getClientProjectDetail(id) {
    return request(`/api/client/projects/${id}/`);
  },

  async getClientProjectProposals(projectId) {
    return request(`/api/client/projects/${projectId}/proposals/`);
  },

  async getClientProposalDetail(projectId, proposalId) {
    return request(`/api/client/projects/${projectId}/proposals/${proposalId}/`);
  },

  async getClientProjectInvoices(projectId) {
    return request(`/api/client/projects/${projectId}/invoices/`);
  },

  async getClientInvoiceDetail(projectId, invoiceId) {
    return request(`/api/client/projects/${projectId}/invoices/${invoiceId}/`);
  },

  // ─── Admin Dashboard APIs ──────────────────────────────────────────────────
  async getAdminStats() {
    return request('/api/admin/stats/');
  },

  async getAdminActivity() {
    return request('/api/admin/activity/');
  },

  async getAdminLeads() {
    return request('/api/admin/leads/');
  },

  async updateLeadStatus(id, status) {
    return request(`/api/admin/leads/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async convertLead(id, data = {}) {
    return request(`/api/admin/leads/${id}/convert/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAdminProjects(params = {}) {
    const qs = new URLSearchParams();
    if (params.stage) qs.set('stage', params.stage);
    if (params.priority) qs.set('priority', params.priority);
    if (params.search) qs.set('search', params.search);
    const url = qs.toString() ? `/api/admin/projects/?${qs.toString()}` : '/api/admin/projects/';
    return request(url);
  },

  async getAdminProjectDetail(id) {
    return request(`/api/admin/projects/${id}/`);
  },

  async updateAdminProject(id, data) {
    return request(`/api/admin/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async updateMilestone(projectId, milestoneId, data) {
    return request(`/api/admin/projects/${projectId}/milestones/${milestoneId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteMilestone(projectId, milestoneId) {
    return request(`/api/admin/projects/${projectId}/milestones/${milestoneId}/`, {
      method: 'DELETE',
    });
  },

  async createMilestone(projectId, label) {
    return request(`/api/admin/projects/${projectId}/milestones/`, {
      method: 'POST',
      body: JSON.stringify({ label, done: false, order_index: 0 }),
    });
  },

  async addProjectNote(projectId, text) {
    return request(`/api/admin/projects/${projectId}/notes/`, {
      method: 'POST',
      body: JSON.stringify({ action_text: text }),
    });
  },

  async deleteProjectNote(projectId, noteId) {
    return request(`/api/admin/projects/${projectId}/notes/${noteId}/`, {
      method: 'DELETE',
    });
  },

  async uploadAdminProjectFile(projectId, file, name = '') {
    const body = new FormData();
    body.append('file', file);
    body.append('name', name || file?.name || 'file');
    return request(`/api/admin/projects/${projectId}/files/`, {
      method: 'POST',
      body,
    });
  },

  async deleteAdminProjectFile(projectId, fileId) {
    return request(`/api/admin/projects/${projectId}/files/${fileId}/`, {
      method: 'DELETE',
    });
  },

  // ─── Billing (MVP, pre-Stripe) ─────────────────────────────────────────────
  async getAdminProjectProposals(projectId) {
    return request(`/api/admin/projects/${projectId}/proposals/`);
  },

  async createAdminProjectProposal(projectId, data) {
    return request(`/api/admin/projects/${projectId}/proposals/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdminProposal(id, data) {
    return request(`/api/admin/proposals/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAdminProposal(id) {
    return request(`/api/admin/proposals/${id}/`, {
      method: 'DELETE',
    });
  },

  async sendAdminProposal(id) {
    return request(`/api/admin/proposals/${id}/send/`, {
      method: 'POST',
    });
  },

  async getAdminProjectInvoices(projectId) {
    return request(`/api/admin/projects/${projectId}/invoices/`);
  },

  async createAdminProjectInvoice(projectId, data) {
    return request(`/api/admin/projects/${projectId}/invoices/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdminInvoice(projectId, invoiceId, data) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAdminInvoice(projectId, invoiceId) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/`, {
      method: 'DELETE',
    });
  },

  async markAdminInvoicePaid(projectId, invoiceId) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/mark-paid/`, {
      method: 'POST',
    });
  },

  async markAdminInvoiceUnpaid(projectId, invoiceId) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/mark-unpaid/`, {
      method: 'POST',
    });
  },

  async sendAdminInvoice(projectId, invoiceId) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/send/`, {
      method: 'POST',
    });
  },

  async getAdminInvoiceItems(projectId, invoiceId) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/items/`);
  },

  async createAdminInvoiceItem(projectId, invoiceId, data) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/items/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteAdminInvoiceItem(projectId, invoiceId, itemId) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/items/${itemId}/`, {
      method: 'DELETE',
    });
  },

  async getAdminClients() {
    return request('/api/admin/clients/');
  },

  // ─── Admin CMS APIs ────────────────────────────────────────────────────────
  async getAdminPortfolioItems() {
    return request('/api/admin/cms/portfolio/');
  },

  async createAdminPortfolioItem(data) {
    return request('/api/admin/cms/portfolio/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdminPortfolioItem(id, data) {
    return request(`/api/admin/cms/portfolio/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAdminPortfolioItem(id) {
    return request(`/api/admin/cms/portfolio/${id}/`, {
      method: 'DELETE',
    });
  },

  async getAdminBlogPosts() {
    return request('/api/admin/cms/blog/');
  },

  async createAdminBlogPost(data) {
    return request('/api/admin/cms/blog/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdminBlogPost(id, data) {
    return request(`/api/admin/cms/blog/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAdminBlogPost(id) {
    return request(`/api/admin/cms/blog/${id}/`, {
      method: 'DELETE',
    });
  },

  async getAdminTags() {
    return request('/api/admin/cms/tags/');
  },

  async createAdminTag(name) {
    return request('/api/admin/cms/tags/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
};
