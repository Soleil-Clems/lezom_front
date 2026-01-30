import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
            },

            logout: () => {
                set({ token: null });
            },
        }),
        {
            name: "auth-token",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;