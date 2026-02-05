import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./useSocket";

export function useSocketPresence() {
    const { isConnected, on, off, emit } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isConnected) return;

        // Récupérer la liste initiale des users en ligne
        emit("getOnlineUsers", {}, (response: { onlineUserIds: number[] }) => {
            if (response?.onlineUserIds) {
                queryClient.setQueryData<number[]>(
                    ["onlineUserIds"],
                    response.onlineUserIds
                );
            }
        });

        const handleUserOnline = (data: { userId: number }) => {
            queryClient.setQueryData<number[]>(["onlineUserIds"], (old) => {
                if (!old) return [data.userId];
                if (old.includes(data.userId)) return old;
                return [...old, data.userId];
            });
        };

        const handleUserOffline = (data: { userId: number }) => {
            queryClient.setQueryData<number[]>(["onlineUserIds"], (old) => {
                if (!old) return [];
                return old.filter((id) => id !== data.userId);
            });
        };

        on("userOnline", handleUserOnline);
        on("userOffline", handleUserOffline);

        return () => {
            off("userOnline", handleUserOnline);
            off("userOffline", handleUserOffline);
        };
    }, [isConnected, on, off, emit, queryClient]);
}
