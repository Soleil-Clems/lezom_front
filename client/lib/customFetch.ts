import { apiUrl } from "@/lib/apiurl";
import useAuthStore from "@/store/authStore";
import { refreshAccessToken } from "@/lib/tokenRefresh";

type RequestOptions = {
  headers?: Record<string, string>;
};

type BodyData = Record<string, unknown>;

type FetchOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: BodyData | FormData;
};

class CustomFetch {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(
    endpoint: string,
    options: FetchOptions & RequestOptions,
    isRetry = false,
  ): Promise<any> {
    const { headers, body, method } = options;
    const token = useAuthStore.getState().token;

    const isFormData = body instanceof FormData;

    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(headers || {}),
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      const skipRefreshEndpoints = [
        "auth/login",
        "auth/register",
        "auth/refresh",
        "auth/logout",
        "auth/verify-otp",
        "auth/resend-otp",
      ];
      const shouldSkipRefresh = skipRefreshEndpoints.some((e) =>
        endpoint.includes(e),
      );

      if (shouldSkipRefresh) {
        let message = "Identifiants incorrects";
        try {
          const errorData = await res.json();
          message = errorData.message ?? message;
        } catch { /* response body not JSON-parseable, use fallback message */ }
        throw new Error(message);
      }

      if (isRetry) {
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
      let message = `Erreur ${res.status}`;
      try {
        const errorData = await res.json();
        message = errorData.message ?? message;
      } catch {}
      throw new Error(message);
    }

    return res.json();
  }

  private handleAuthFailure() {
    useAuthStore.getState().logout();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  get(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { method: "GET", ...options });
  }

  post(
    endpoint: string,
    body?: BodyData | FormData,
    options: RequestOptions = {},
  ) {
    return this.request(endpoint, { method: "POST", body, ...options });
  }

  put(
    endpoint: string,
    body?: BodyData | FormData,
    options: RequestOptions = {},
  ) {
    return this.request(endpoint, { method: "PUT", body, ...options });
  }

  patch(
    endpoint: string,
    body?: BodyData | FormData,
    options: RequestOptions = {},
  ) {
    return this.request(endpoint, { method: "PATCH", body, ...options });
  }

  delete(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }
}

export const customfetch = new CustomFetch(apiUrl);
export default customfetch;
