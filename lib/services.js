const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "drpythonsolutions.com" || host === "www.drpythonsolutions.com") {
            return "https://api.drpythonsolutions.com";
        }
    }
    return "http://localhost:8000";
};

const API_BASE_URL = getApiBaseUrl().replace(/\/$/, "");

const getCookie = (name) => {
    if (typeof window === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const getAuthHeaders = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("access_token") || getCookie("admin_session");
    return token && !token.startsWith("mock-") ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchPublicServices(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== 'All') {
        searchParams.append('category', params.category);
    }
    if (params.search) {
        searchParams.append('search', params.search);
    }
    if (params.featured) {
        searchParams.append('featured', 'true');
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/public/services/${queryString ? '?' + queryString : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
        throw new Error(`Failed to fetch services from backend: HTTP ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : data.results || [];
}

export async function fetchPublicServiceByIdentifier(identifier) {
    const url = `${API_BASE_URL}/public/services/${encodeURIComponent(identifier)}/`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Failed to fetch service detail from backend: HTTP ${res.status}`);
    }

    return await res.json();
}

export async function submitServiceOrder(identifier, orderPayload) {
    const url = `${API_BASE_URL}/public/services/${encodeURIComponent(identifier)}/order/`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Order submission error: HTTP ${res.status}`);
    }

    return await res.json();
}

// ─── Backend API & Local Sync for Saved / Favorited Services ────────────────────

const SAVED_SERVICES_KEY = "drpython_saved_services";

export function getSavedServices() {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(SAVED_SERVICES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Error reading saved services:", e);
        return [];
    }
}

export function isServiceSaved(serviceId) {
    if (!serviceId) return false;
    const saved = getSavedServices();
    return saved.includes(String(serviceId));
}

export function toggleSavedService(serviceId) {
    if (typeof window === "undefined" || !serviceId) return false;
    try {
        const idStr = String(serviceId);
        const saved = getSavedServices();
        let updated;
        let isNowSaved = false;

        if (saved.includes(idStr)) {
            updated = saved.filter(id => id !== idStr);
            isNowSaved = false;
        } else {
            updated = [...saved, idStr];
            isNowSaved = true;
        }

        localStorage.setItem(SAVED_SERVICES_KEY, JSON.stringify(updated));
        
        // Asynchronously sync with Backend API if user token is present
        const url = `${API_BASE_URL}/public/services/${encodeURIComponent(serviceId)}/favorite/`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        }).catch(err => console.warn("Backend favorite sync offline or skipped:", err.message));

        // Dispatch custom event so other components update UI immediately
        window.dispatchEvent(new CustomEvent('savedServicesChanged', { detail: updated }));
        
        return isNowSaved;
    } catch (e) {
        console.error("Error updating saved services:", e);
        return false;
    }
}

export async function fetchUserFavoriteServicesAPI() {
    try {
        const url = `${API_BASE_URL}/client/services/favorites/`;
        const res = await fetch(url, {
            headers: getAuthHeaders(),
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.favorites)) {
                localStorage.setItem(SAVED_SERVICES_KEY, JSON.stringify(data.favorites));
                window.dispatchEvent(new CustomEvent('savedServicesChanged', { detail: data.favorites }));
                return data.favorites;
            }
        }
    } catch (err) {
        console.warn("Could not fetch remote favorite services:", err.message);
    }
    return getSavedServices();
}
