"use client";

import { useEffect } from 'react';
import { socketManager } from '@/lib/socket';
import useAuthStore from '@/store/authStore';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        if (!token) {
            socketManager.disconnect();
            return;
        }

        const socket = socketManager.connect();

        if (!socket) return;
        // Gérer les erreurs d'authentification
        socket.on('error', (error: any) => {
            if (error.message === 'Unauthorized') {
                logout();
            }
        });

        return () => {
            // Ne pas déconnecter immédiatement, garder la connexion active
        };
    }, [token, logout]);

    return <>{children}</>;
}