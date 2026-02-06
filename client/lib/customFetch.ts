import { apiUrl } from "@/lib/apiurl";
import useAuthStore from "@/store/authStore";
import { refreshAccessToken } from "@/lib/tokenRefresh";

type RequestOptions = {
    headers?: Record<string, string>;
};

type BodyData = Record<string, unknown>;
class CustomFetch {
    baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request(endpoint: string, options: RequestOptions & RequestInit = {}, isRetry = false): Promise<any> {
        const { headers, body, ...rest } = options;
        const token = useAuthStore.getState().token;

        const isFormData = body instanceof FormData;

        const res = await fetch(`${this.baseURL}${endpoint}`, {
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`,
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...(headers || {}),
            },
                body: isFormData ? body : body ? JSON.stringify(body) : undefined,
            ...rest,
        });

        if (res.status === 401) {
            const skipRefreshEndpoints = ['auth/login', 'auth/register', 'auth/refresh', 'auth/logout'];
            const shouldSkipRefresh = skipRefreshEndpoints.some(e => endpoint.includes(e));

            if (isRetry || shouldSkipRefresh) {
                this.handleAuthFailure();
                throw new Error("Session expirée. Veuillez vous reconnecter.");
            }

            const newToken = await refreshAccessToken();

            if (newToken) {
                return this.request(endpoint, options, true);
            }

            this.handleAuthFailure();
            throw new Error("Session expirée. Veuillez vous reconnecter.");
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return res.json();
    }

    private handleAuthFailure() {
        useAuthStore.getState().logout();

        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    get(endpoint: string, options: RequestOptions = {}) {
        return this.request(endpoint, { method: "GET", ...options });
    }

    post(endpoint: string, body?: BodyData| FormData, options: RequestOptions = {}) {
        return this.request(endpoint, {
            method: "POST",
            body,
            ...options
        });
    }

    put(endpoint: string, body?: BodyData| FormData, options: RequestOptions = {}) {
        return this.request(endpoint, {
            method: "PUT",
            body,
            ...options
        });
    }

    patch(endpoint: string, body?: BodyData | FormData, options: RequestOptions = {}) {
        return this.request(endpoint, {
            method: "PATCH",
            body,
            ...options
        });
    }

    delete(endpoint: string, options: RequestOptions = {}) {
        return this.request(endpoint, { method: "DELETE", ...options });
    }
}

export const customfetch = new CustomFetch(apiUrl);
export default customfetch;