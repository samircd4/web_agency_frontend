/**
 * API client to communicate with the Django REST Framework backend.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

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

        const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });

        if (!res.ok) {
            clearTokens();
            if (typeof window !== "undefined") window.location.href = "/login";
            return null;
        }

        const data = await res.json();
        if (!data?.access) return null;

        localStorage.setItem("access_token", data.access);
        document.cookie = `admin_session=${data.access}; path=/; max-age=86400; SameSite=Lax; Secure`;
        return data.access;
    } catch {
        clearTokens();
        return null;
    }
}

// ─── Core request wrapper ──────────────────────────────────────────────────

async function request(url, options = {}) {
    const { _retried, skipAuth, ...restOptions } = options;

    const isFormDataBody =
        typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers = {
        ...(isFormDataBody ? {} : { "Content-Type": "application/json" }),
        ...(skipAuth ? {} : getAuthHeaders()),
        ...options.headers,
    };

    const config = {
        ...restOptions,
        headers,
    };

    const finalUrl = url.startsWith("/") ? `${API_BASE_URL}${url}` : url;

    let response;
    try {
        response = await fetch(finalUrl, config);
    } catch (networkError) {
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
        error.status = 0;
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
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    return request(url, { ...restOptions, _retried: true });
                }
            } else if (isNoCredentials) {
                clearTokens();
                if (window.location.pathname !== "/admin/login") {
                    window.location.href = "/admin/login";
                }
                return;
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
            console.error("API error:", message, {
                url: finalUrl,
                status: response.status,
                data: errorData,
            });
        }

        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// ─── Helper Functions ─────────────────────────────────────────────────────

export function getFullAvatarUrl(avatarUrl) {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
        return avatarUrl;
    }
    return `${API_BASE_URL}${avatarUrl}`;
}

// ─── Public API surface ────────────────────────────────────────────────────

export const api = {
    // ─── Auth ────────────────────────────────────────────────────────────────

    async login(username, password, otp) {
        const body = { username, password };
        if (otp) body.otp = otp;

        const res = await request("/auth/token/", {
            method: "POST",
            body: JSON.stringify(body),
            skipAuth: true,
        });
        if (res.access) {
            localStorage.setItem("access_token", res.access);
            localStorage.setItem("refresh_token", res.refresh);
            document.cookie = `admin_session=${res.access}; path=/; max-age=86400; SameSite=Lax; Secure`;
        }
        return res;
    },

    async register(registrationData) {
        const res = await request("/auth/register/", {
            method: "POST",
            body: JSON.stringify(registrationData),
            skipAuth: true,
        });
        if (res.access) {
            localStorage.setItem("access_token", res.access);
            localStorage.setItem("refresh_token", res.refresh);
            document.cookie = `admin_session=${res.access}; path=/; max-age=86400; SameSite=Lax; Secure`;
        }
        return res;
    },

    async logout() {
        const refreshToken = localStorage.getItem('refresh_token');
        try {
            if (refreshToken && !refreshToken.startsWith("mock-")) {
                await request("/auth/logout/", {
                    method: "POST",
                    body: JSON.stringify({ refresh: refreshToken }),
                });
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            clearTokens();
        }
    },

    async getMe() {
        return request("/auth/me/");
    },

    async updateMe(data) {
        const formData = new FormData();
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        }
        return request("/auth/me/", { method: "PATCH", body: formData });
    },

    async checkUsername(username) {
        return request(`/auth/check-username/?username=${encodeURIComponent(username)}`, { skipAuth: true });
    },

    async changePassword(data) {
        return request("/auth/change-password/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async otpGenerate() {
        return request("/auth/otp/generate/", { method: "POST" });
    },

    async otpVerify(data) {
        return request("/auth/otp/verify/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async otpDisable(data) {
        return request("/auth/otp/disable/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async getActiveSessions() {
        const refreshToken = localStorage.getItem("refresh_token");
        return request("/auth/sessions/", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
    },

    async revokeSession(id) {
        const refreshToken = localStorage.getItem("refresh_token");
        return request(`/auth/sessions/${id}/revoke/`, {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
    },

    async revokeAllSessions() {
        const refreshToken = localStorage.getItem("refresh_token");
        return request("/auth/sessions/revoke-all/", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
    },

    // ─── Public CMS ──────────────────────────────────────────────────────────

    async getBlogPosts(tag = "") {
        const url = tag
            ? `/public/blog/?tags__name=${encodeURIComponent(tag)}`
            : "/public/blog/";
        return request(url, { skipAuth: true });
    },

    async getBlogPostDetail(slug) {
        return request(`/public/blog/${slug}/`, { skipAuth: true });
    },

    async getPortfolioItems(tag = "") {
        const url = tag
            ? `/public/portfolio/?tags__name=${encodeURIComponent(tag)}`
            : "/public/portfolio/";
        return request(url, { skipAuth: true });
    },

    async getPortfolioItemDetail(slug) {
        return request(`/public/portfolio/${slug}/`, { skipAuth: true });
    },

    // ─── Public Lead Submission ───────────────────────────────────────────────

    async createLead(leadData) {
        return request("/public/leads/", {
            method: "POST",
            body: JSON.stringify(leadData),
            skipAuth: true,
        });
    },

    // ─── Client Dashboard ─────────────────────────────────────────────────────

    async getClientProjects() {
        return request("/client/projects/");
    },

    async getClientProjectDetail(id) {
        return request(`/client/projects/${id}/`);
    },

    async getClientProjectProposals(projectId) {
        return request(`/client/projects/${projectId}/proposals/`);
    },

    async getClientProposalDetail(projectId, proposalId) {
        return request(`/client/projects/${projectId}/proposals/${proposalId}/`);
    },

    async respondToProposal(projectId, proposalId, action) {
        return request(`/client/projects/${projectId}/proposals/${proposalId}/respond/`, {
            method: "POST",
            body: JSON.stringify({ action }),
        });
    },

    async getClientProjectInvoices(projectId) {
        return request(`/client/projects/${projectId}/invoices/`);
    },

    async getClientInvoiceDetail(projectId, invoiceId) {
        return request(`/client/projects/${projectId}/invoices/${invoiceId}/`);
    },

    async createClientInvoiceCheckout(projectId, invoiceId) {
        return request(`/client/projects/${projectId}/invoices/${invoiceId}/checkout/`, {
            method: "POST"
        });
    },

    async syncClientInvoiceStripe(projectId, invoiceId) {
        return request(`/client/projects/${projectId}/invoices/${invoiceId}/sync-stripe/`, {
            method: "POST"
        });
    },

    async cancelClientProject(id) {
        return request(`/client/projects/${id}/`, {
            method: "PATCH",
            body: JSON.stringify({ status: "cancelled" }),
        });
    },

    // ─── Admin Dashboard ──────────────────────────────────────────────────────

    async getAdminStats() {
        return request("/admin/stats/");
    },

    async getAdminActivity() {
        return request("/admin/activity/");
    },

    async getAdminLeads() {
        return request("/admin/leads/");
    },

    async updateLeadStatus(id, status) {
        return request(`/admin/leads/${id}/`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
    },

    async convertLead(id, data = {}) {
        return request(`/admin/leads/${id}/convert/`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async getAdminProjects(params = {}) {
        const qs = new URLSearchParams();
        if (params.stage) qs.set("stage", params.stage);
        if (params.priority) qs.set("priority", params.priority);
        if (params.search) qs.set("search", params.search);
        const url = qs.toString() ? `/admin/projects/?${qs.toString()}` : "/admin/projects/";
        return request(url);
    },

    async getAdminProjectDetail(id) {
        return request(`/admin/projects/${id}/`);
    },

    async updateAdminProject(id, data) {
        return request(`/admin/projects/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async cancelAdminProject(id) {
        return request(`/admin/projects/${id}/`, {
            method: "PATCH",
            body: JSON.stringify({ status: "cancelled" }),
        });
    },

    async completeAdminProject(id) {
        return request(`/admin/projects/${id}/`, {
            method: "PATCH",
            body: JSON.stringify({ status: "completed" }),
        });
    },

    async updateMilestone(projectId, milestoneId, data) {
        return request(`/admin/projects/${projectId}/milestones/${milestoneId}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async deleteMilestone(projectId, milestoneId) {
        return request(`/admin/projects/${projectId}/milestones/${milestoneId}/`, {
            method: "DELETE"
        });
    },

    async createMilestone(projectId, label, order_index = 0) {
        return request(`/admin/projects/${projectId}/milestones/`, {
            method: "POST",
            body: JSON.stringify({ label, done: false, order_index }),
        });
    },

    async addProjectNote(projectId, text) {
        return request(`/admin/projects/${projectId}/notes/`, {
            method: "POST",
            body: JSON.stringify({ action_text: text }),
        });
    },

    async deleteProjectNote(projectId, noteId) {
        return request(`/admin/projects/${projectId}/notes/${noteId}/`, {
            method: "DELETE",
        });
    },

    async uploadAdminProjectFile(projectId, file, name = "") {
        const body = new FormData();
        body.append("file", file);
        body.append("name", name || file?.name || "file");
        return request(`/admin/projects/${projectId}/files/`, {
            method: "POST",
            body,
        });
    },

    async deleteAdminProjectFile(projectId, fileId) {
        return request(`/admin/projects/${projectId}/files/${fileId}/`, {
            method: "DELETE",
        });
    },

    // ─── Admin Billing (per-project) ──────────────────────────────────────────

    async getAdminProjectProposals(projectId) {
        return request(`/admin/projects/${projectId}/proposals/`);
    },

    async createAdminProjectProposal(projectId, data) {
        return request(`/admin/projects/${projectId}/proposals/`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async updateAdminProposal(id, data) {
        return request(`/admin/proposals/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async deleteAdminProposal(id) {
        return request(`/admin/proposals/${id}/`, { method: "DELETE" });
    },

    async sendAdminProposal(id) {
        return request(`/admin/proposals/${id}/send/`, { method: "POST" });
    },

    async getAdminProjectInvoices(projectId) {
        return request(`/admin/projects/${projectId}/invoices/`);
    },

    async createAdminProjectInvoice(projectId, data) {
        return request(`/admin/projects/${projectId}/invoices/`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async updateAdminInvoice(projectId, invoiceId, data) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async deleteAdminInvoice(projectId, invoiceId) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/`, {
            method: "DELETE",
        });
    },

    async markAdminInvoicePaid(projectId, invoiceId) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/mark-paid/`, {
            method: "POST"
        });
    },

    async markAdminInvoiceUnpaid(projectId, invoiceId) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/mark-unpaid/`, {
            method: "POST"
        });
    },

    async sendAdminInvoice(projectId, invoiceId) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/send/`, {
            method: "POST"
        });
    },

    async getAdminInvoiceItems(projectId, invoiceId) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/items/`);
    },

    async createAdminInvoiceItem(projectId, invoiceId, data) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/items/`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async deleteAdminInvoiceItem(projectId, invoiceId, itemId) {
        return request(`/admin/projects/${projectId}/invoices/${invoiceId}/items/${itemId}/`, {
            method: "DELETE"
        });
    },

    async getAdminClients() {
        return request("/admin/clients/");
    },

    // ─── Admin CMS ────────────────────────────────────────────────────────────

    async getAdminPortfolioItems() {
        return request("/admin/cms/portfolio/");
    },

    async createAdminPortfolioItem(data) {
        return request("/admin/cms/portfolio/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async updateAdminPortfolioItem(id, data) {
        return request(`/admin/cms/portfolio/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async deleteAdminPortfolioItem(id) {
        return request(`/admin/cms/portfolio/${id}/`, { method: "DELETE" });
    },

    async getAdminBlogPosts() {
        return request("/admin/cms/blog/");
    },

    async createAdminBlogPost(data) {
        return request("/admin/cms/blog/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async updateAdminBlogPost(id, data) {
        return request(`/admin/cms/blog/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async deleteAdminBlogPost(id) {
        return request(`/admin/cms/blog/${id}/`, { method: "DELETE" });
    },

    async getAdminTags() {
        return request("/admin/cms/tags/");
    },

    async createAdminTag(name) {
        return request("/admin/cms/tags/", {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    },

    // ─── Global Admin Billing ─────────────────────────────────────────────────

    async getAdminInvoicesGlobal() {
        return request("/admin/invoices/");
    },

    async createAdminInvoiceGlobal(data) {
        return request("/admin/invoices/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async getAdminInvoiceDetailGlobal(id) {
        return request(`/admin/invoices/${id}/`);
    },

    async updateAdminInvoiceGlobal(id, data) {
        return request(`/admin/invoices/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async deleteAdminInvoiceGlobal(id) {
        return request(`/admin/invoices/${id}/`, { method: "DELETE" });
    },

    async markAdminInvoicePaidGlobal(id) {
        return request(`/admin/invoices/${id}/mark-paid/`, { method: "POST" });
    },

    async markAdminInvoiceUnpaidGlobal(id) {
        return request(`/admin/invoices/${id}/mark-unpaid/`, { method: "POST" });
    },

    async sendAdminInvoiceGlobal(id) {
        return request(`/admin/invoices/${id}/send/`, { method: "POST" });
    },

    async getAdminInvoiceItemsGlobal(invoiceId) {
        return request(`/admin/invoices/${invoiceId}/items/`);
    },

    async createAdminInvoiceItemGlobal(invoiceId, data) {
        return request(`/admin/invoices/${invoiceId}/items/`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async deleteAdminInvoiceItemGlobal(invoiceId, itemId) {
        return request(`/admin/invoices/${invoiceId}/items/${itemId}/`, {
            method: "DELETE"
        });
    },

    async getAdminProposalsGlobal() {
        return request("/admin/proposals/");
    },

    async getAdminPaymentsGlobal() {
        return request("/admin/payments/");
    },

    async getAdminBillingStatsGlobal() {
        return request("/admin/billing/stats/");
    },
};