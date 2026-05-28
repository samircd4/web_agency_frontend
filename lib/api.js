/**
 * API client to communicate with the Django REST Framework backend.
 */

// ─── Token helpers ─────────────────────────────────────────────────────────

export function getCookie(name) {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export function getAuthHeaders() {
  if (typeof window === "undefined") return {};

  const token =
    localStorage.getItem("access_token") || getCookie("admin_session");

  if (token && !token.startsWith("mock-")) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// Returns true only when a non-mock token exists in storage.
// Use this to guard protected pages/hooks before making API calls.
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  const token =
    localStorage.getItem("access_token") || getCookie("admin_session");
  return !!token && !token.startsWith("mock-");
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  document.cookie =
    "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// ─── Refresh lock ──────────────────────────────────────────────────────────
// Prevents concurrent 401s from each firing their own refresh call.
// All in-flight requests share one promise and wait for the same result.

let _refreshPromise = null;

async function refreshAccessToken() {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = _doRefresh().finally(() => {
    _refreshPromise = null;
  });

  return _refreshPromise;
}

async function _doRefresh() {
  try {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh || refresh.startsWith("mock-")) return null;

    const res = await fetch("http://localhost:8000/api/auth/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      // Refresh token is expired or revoked — clear everything and bounce to login
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      return null;
    }

    const data = await res.json();
    if (!data?.access) return null;

    localStorage.setItem("access_token", data.access);
    document.cookie = `admin_session=${data.access}; path=/; max-age=86400`;
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

// ─── Core request wrapper ──────────────────────────────────────────────────

async function request(url, options = {}) {
  const { _retried, ...restOptions } = options;

  const isFormDataBody =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(isFormDataBody ? {} : { "Content-Type": "application/json" }),
    ...getAuthHeaders(),
    ...options.headers,
  };

  const config = {
    ...restOptions,
    headers,
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  let finalUrl = url.startsWith("/") ? `${apiBaseUrl}${url}` : url;

  // Remove redundant /api if apiBaseUrl is not localhost and already contains /api
  if (apiBaseUrl !== "http://localhost:8000" && finalUrl.includes("/api")) {
    finalUrl = finalUrl.replace("/api", "");
  }

  let response;
  try {
    response = await fetch(finalUrl, config);
  } catch (networkError) {
    // Covers: backend not running, CORS preflight blocked, DNS failure, no internet
    const message =
      networkError instanceof TypeError
        ? `Cannot reach server — is the backend running? (${finalUrl})`
        : networkError.message || "Network error";

    if (typeof window !== "undefined") {
      console.error("Network error", {
        url: finalUrl,
        error: networkError.message,
      });
    }

    const error = new Error(message);
    error.status = 0; // 0 = no HTTP response received
    error.data = null;
    throw error;
  }

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }

    // ── 401 handling ────────────────────────────────────────────────────────
    if (response.status === 401 && typeof window !== "undefined") {
      const detail = String(errorData?.detail || "").toLowerCase();
      const code = errorData?.code || "";

      const isExpiredToken =
        code === "token_not_valid" || detail.includes("token not valid");

      const isNoCredentials =
        detail.includes("authentication credentials were not provided") ||
        detail.includes("not provided");

      if (isExpiredToken && !_retried) {
        // Access token expired — attempt a silent refresh then retry
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return request(url, { ...restOptions, _retried: true });
        }
      } else if (isNoCredentials) {
        // No token in storage at all — nothing to refresh, send to login
        clearTokens();
        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
        return; // prevent throwing below while redirect is in progress
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

    if (typeof window !== "undefined") {
      console.error("API error", {
        url: finalUrl,
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
    }

    throw error;
  }

  // Handle 204 No Content (e.g. DELETE operations)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ─── Public API surface ────────────────────────────────────────────────────

export const api = {
  // ─── Auth ────────────────────────────────────────────────────────────────

  async login(username, password) {
    const res = await request("/api/auth/token/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (res.access) {
      localStorage.setItem("access_token", res.access);
      localStorage.setItem("refresh_token", res.refresh);
      document.cookie = `admin_session=${res.access}; path=/; max-age=86400`;
    }
    return res;
  },

  async register(registrationData) {
    const res = await request("/api/auth/register/", {
      method: "POST",
      body: JSON.stringify(registrationData),
    });
    if (res.access) {
      localStorage.setItem("access_token", res.access);
      localStorage.setItem("refresh_token", res.refresh);
      document.cookie = `admin_session=${res.access}; path=/; max-age=86400`;
    }
    return res;
  },

  async logout() {
    clearTokens();
  },

  async getMe() {
    return request("/api/auth/me/");
  },

  // ─── Public CMS ──────────────────────────────────────────────────────────

  async getBlogPosts(tag = "") {
    const url = tag
      ? `/api/public/blog/?tags__name=${encodeURIComponent(tag)}`
      : "/api/public/blog/";
    return request(url);
  },

  async getBlogPostDetail(slug) {
    return request(`/api/public/blog/${slug}/`);
  },

  async getPortfolioItems(tag = "") {
    const url = tag
      ? `/api/public/portfolio/?tags__name=${encodeURIComponent(tag)}`
      : "/api/public/portfolio/";
    return request(url);
  },

  async getPortfolioItemDetail(slug) {
    return request(`/api/public/portfolio/${slug}/`);
  },

  // ─── Public Lead Submission ───────────────────────────────────────────────

  async createLead(leadData) {
    return request("/api/public/leads/", {
      method: "POST",
      body: JSON.stringify(leadData),
    });
  },

  // ─── Client Dashboard ─────────────────────────────────────────────────────

  async getClientProjects() {
    return request("/api/client/projects/");
  },

  async getClientProjectDetail(id) {
    return request(`/api/client/projects/${id}/`);
  },

  async getClientProjectProposals(projectId) {
    return request(`/api/client/projects/${projectId}/proposals/`);
  },

  async getClientProposalDetail(projectId, proposalId) {
    return request(
      `/api/client/projects/${projectId}/proposals/${proposalId}/`,
    );
  },

  async respondToProposal(projectId, proposalId, action) {
    return request(
      `/api/client/projects/${projectId}/proposals/${proposalId}/respond/`,
      {
        method: "POST",
        body: JSON.stringify({ action }),
      },
    );
  },

  async getClientProjectInvoices(projectId) {
    return request(`/api/client/projects/${projectId}/invoices/`);
  },

  async getClientInvoiceDetail(projectId, invoiceId) {
    return request(`/api/client/projects/${projectId}/invoices/${invoiceId}/`);
  },

  async createClientInvoiceCheckout(projectId, invoiceId) {
    return request(
      `/api/client/projects/${projectId}/invoices/${invoiceId}/checkout/`,
      { method: "POST" },
    );
  },

  async syncClientInvoiceStripe(projectId, invoiceId) {
    return request(
      `/api/client/projects/${projectId}/invoices/${invoiceId}/sync-stripe/`,
      { method: "POST" },
    );
  },

  // ─── Admin Dashboard ──────────────────────────────────────────────────────

  async getAdminStats() {
    return request("/api/admin/stats/");
  },

  async getAdminActivity() {
    return request("/api/admin/activity/");
  },

  async getAdminLeads() {
    return request("/api/admin/leads/");
  },

  async updateLeadStatus(id, status) {
    return request(`/api/admin/leads/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async convertLead(id, data = {}) {
    return request(`/api/admin/leads/${id}/convert/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getAdminProjects(params = {}) {
    const qs = new URLSearchParams();
    if (params.stage) qs.set("stage", params.stage);
    if (params.priority) qs.set("priority", params.priority);
    if (params.search) qs.set("search", params.search);
    const url = qs.toString()
      ? `/api/admin/projects/?${qs.toString()}`
      : "/api/admin/projects/";
    return request(url);
  },

  async getAdminProjectDetail(id) {
    return request(`/api/admin/projects/${id}/`);
  },

  async updateAdminProject(id, data) {
    return request(`/api/admin/projects/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async updateMilestone(projectId, milestoneId, data) {
    return request(
      `/api/admin/projects/${projectId}/milestones/${milestoneId}/`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  async deleteMilestone(projectId, milestoneId) {
    return request(
      `/api/admin/projects/${projectId}/milestones/${milestoneId}/`,
      { method: "DELETE" },
    );
  },

  async createMilestone(projectId, label) {
    return request(`/api/admin/projects/${projectId}/milestones/`, {
      method: "POST",
      body: JSON.stringify({ label, done: false, order_index: 0 }),
    });
  },

  async addProjectNote(projectId, text) {
    return request(`/api/admin/projects/${projectId}/notes/`, {
      method: "POST",
      body: JSON.stringify({ action_text: text }),
    });
  },

  async deleteProjectNote(projectId, noteId) {
    return request(`/api/admin/projects/${projectId}/notes/${noteId}/`, {
      method: "DELETE",
    });
  },

  async uploadAdminProjectFile(projectId, file, name = "") {
    const body = new FormData();
    body.append("file", file);
    body.append("name", name || file?.name || "file");
    return request(`/api/admin/projects/${projectId}/files/`, {
      method: "POST",
      body,
    });
  },

  async deleteAdminProjectFile(projectId, fileId) {
    return request(`/api/admin/projects/${projectId}/files/${fileId}/`, {
      method: "DELETE",
    });
  },

  // ─── Admin Billing (per-project) ──────────────────────────────────────────

  async getAdminProjectProposals(projectId) {
    return request(`/api/admin/projects/${projectId}/proposals/`);
  },

  async createAdminProjectProposal(projectId, data) {
    return request(`/api/admin/projects/${projectId}/proposals/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAdminProposal(id, data) {
    return request(`/api/admin/proposals/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAdminProposal(id) {
    return request(`/api/admin/proposals/${id}/`, { method: "DELETE" });
  },

  async sendAdminProposal(id) {
    return request(`/api/admin/proposals/${id}/send/`, { method: "POST" });
  },

  async getAdminProjectInvoices(projectId) {
    return request(`/api/admin/projects/${projectId}/invoices/`);
  },

  async createAdminProjectInvoice(projectId, data) {
    return request(`/api/admin/projects/${projectId}/invoices/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAdminInvoice(projectId, invoiceId, data) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAdminInvoice(projectId, invoiceId) {
    return request(`/api/admin/projects/${projectId}/invoices/${invoiceId}/`, {
      method: "DELETE",
    });
  },

  async markAdminInvoicePaid(projectId, invoiceId) {
    return request(
      `/api/admin/projects/${projectId}/invoices/${invoiceId}/mark-paid/`,
      { method: "POST" },
    );
  },

  async markAdminInvoiceUnpaid(projectId, invoiceId) {
    return request(
      `/api/admin/projects/${projectId}/invoices/${invoiceId}/mark-unpaid/`,
      { method: "POST" },
    );
  },

  async sendAdminInvoice(projectId, invoiceId) {
    return request(
      `/api/admin/projects/${projectId}/invoices/${invoiceId}/send/`,
      { method: "POST" },
    );
  },

  async getAdminInvoiceItems(projectId, invoiceId) {
    return request(
      `/api/admin/projects/${projectId}/invoices/${invoiceId}/items/`,
    );
  },

  async createAdminInvoiceItem(projectId, invoiceId, data) {
    return request(
      `/api/admin/projects/${projectId}/invoices/${invoiceId}/items/`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  async deleteAdminInvoiceItem(projectId, invoiceId, itemId) {
    return request(
      `/api/admin/projects/${projectId}/invoices/${invoiceId}/items/${itemId}/`,
      { method: "DELETE" },
    );
  },

  async getAdminClients() {
    return request("/api/admin/clients/");
  },

  // ─── Admin CMS ────────────────────────────────────────────────────────────

  async getAdminPortfolioItems() {
    return request("/api/admin/cms/portfolio/");
  },

  async createAdminPortfolioItem(data) {
    return request("/api/admin/cms/portfolio/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAdminPortfolioItem(id, data) {
    return request(`/api/admin/cms/portfolio/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAdminPortfolioItem(id) {
    return request(`/api/admin/cms/portfolio/${id}/`, { method: "DELETE" });
  },

  async getAdminBlogPosts() {
    return request("/api/admin/cms/blog/");
  },

  async createAdminBlogPost(data) {
    return request("/api/admin/cms/blog/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAdminBlogPost(id, data) {
    return request(`/api/admin/cms/blog/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAdminBlogPost(id) {
    return request(`/api/admin/cms/blog/${id}/`, { method: "DELETE" });
  },

  async getAdminTags() {
    return request("/api/admin/cms/tags/");
  },

  async createAdminTag(name) {
    return request("/api/admin/cms/tags/", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  // ─── Global Admin Billing ─────────────────────────────────────────────────

  async getAdminInvoicesGlobal() {
    return request("/api/admin/invoices/");
  },

  async createAdminInvoiceGlobal(data) {
    return request("/api/admin/invoices/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getAdminInvoiceDetailGlobal(id) {
    return request(`/api/admin/invoices/${id}/`);
  },

  async updateAdminInvoiceGlobal(id, data) {
    return request(`/api/admin/invoices/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAdminInvoiceGlobal(id) {
    return request(`/api/admin/invoices/${id}/`, { method: "DELETE" });
  },

  async markAdminInvoicePaidGlobal(id) {
    return request(`/api/admin/invoices/${id}/mark-paid/`, { method: "POST" });
  },

  async markAdminInvoiceUnpaidGlobal(id) {
    return request(`/api/admin/invoices/${id}/mark-unpaid/`, {
      method: "POST",
    });
  },

  async sendAdminInvoiceGlobal(id) {
    return request(`/api/admin/invoices/${id}/send/`, { method: "POST" });
  },

  async getAdminInvoiceItemsGlobal(invoiceId) {
    return request(`/api/admin/invoices/${invoiceId}/items/`);
  },

  async createAdminInvoiceItemGlobal(invoiceId, data) {
    return request(`/api/admin/invoices/${invoiceId}/items/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteAdminInvoiceItemGlobal(invoiceId, itemId) {
    return request(`/api/admin/invoices/${invoiceId}/items/${itemId}/`, {
      method: "DELETE",
    });
  },

  async getAdminProposalsGlobal() {
    return request("/api/admin/proposals/");
  },

  async getAdminPaymentsGlobal() {
    return request("/api/admin/payments/");
  },

  async getAdminBillingStatsGlobal() {
    return request("/api/admin/billing/stats/");
  },
};
