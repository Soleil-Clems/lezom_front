import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiUrl } from "@/lib/apiurl";

type AuthState = {
    token: string | null;
    setToken: (token: string) => void;
    logout: () => void;
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,

            setToken: (token: string) => {
                set({ token });
                if (typeof window !== 'undefined') {
                    document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
                }
            },

            logout: () => {
                fetch(`${apiUrl}auth/logout`, {
                    method: "POST",
                    credentials: "include",
                }).catch(() => {});

                set({ token: null });

                if (typeof window !== 'undefined') {
                    document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
                }

                if (typeof window !== 'undefined') {
                    localStorage.removeItem("auth-token");
                }
                window.location.reload();
            },
        }),
        {
            name: "auth-token",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;