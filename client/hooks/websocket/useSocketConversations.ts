import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./useSocket";

export function useSocketConversations() {
    const { isConnected, on, off } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isConnected) return;

        const handleNewPrivateMessage = () => {
            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });
        };

        on("newPrivateMessage", handleNewPrivateMessage);

        return () => {
            off("newPrivateMessage", handleNewPrivateMessage);
        };
    }, [isConnected, on, off, queryClient]);
}
