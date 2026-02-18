"use client";

import { useEffect } from 'react';
import { socketManager } from '@/lib/socket';
import useAuthStore from '@/store/authStore';
import { refreshAccessToken } from '@/lib/tokenRefresh';
import { useSocketPresence } from '@/hooks/websocket/useSocketPresence';
import { useSocketConversations } from '@/hooks/websocket/useSocketConversations';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    useSocketPresence();
    useSocketConversations();

    useEffect(() => {
        if (!token) {
            socketManager.disconnect();
            return;
        }

        const socket = socketManager.connect();

        if (!socket) return;
        // Gérer les erreurs d'authentification avec refresh
        socket.on('error', async (error: any) => {
            if (error.message === 'Unauthorized') {
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    logout();
                }
            }
        });

        return () => {
            // Ne pas déconnecter immédiatement, garder la connexion active
        };
    }, [token, logout]);

    return <>{children}</>;
}