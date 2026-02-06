import { apiUrl } from "@/lib/apiurl";
import useAuthStore from "@/store/authStore";
import { socketManager } from "@/lib/socket";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const res = await fetch(`${apiUrl}auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                return null;
            }

            const data = await res.json();
            const newToken = data.access_token;

            if (newToken) {
                useAuthStore.getState().setToken(newToken);

                socketManager.reconnectWithNewToken();

                return newToken;
            }

            return null;
        } catch {
            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}
