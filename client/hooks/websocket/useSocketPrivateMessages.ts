import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./useSocket";
import { privateMessageType } from "@/schemas/conversation.dto";

interface MessagesResponse {
    messages: privateMessageType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function useSocketPrivateMessages(conversationId?: string) {
    const { isConnected, on, off } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isConnected || !conversationId) return;

        const handleNewPrivateMessage = (message: any) => {
            // Vérifier que le message appartient à cette conversation
            const msgConversationId = message.conversation?.id || message.conversationId;
            if (msgConversationId && String(msgConversationId) !== conversationId) {
                return;
            }

            queryClient.setQueryData<MessagesResponse>(
                ["conversationMessages", conversationId],
                (old) => {
                    if (!old) return old;
                    // Éviter les doublons
                    if (old.messages.some((msg) => msg.id === message.id)) {
                        return old;
                    }
                    return {
                        ...old,
                        messages: [...old.messages, message],
                        total: old.total + 1,
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });
        };

        const handlePrivateMessageDeleted = (messageId: number) => {
            queryClient.setQueryData<MessagesResponse>(
                ["conversationMessages", conversationId],
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        messages: old.messages.filter((msg) => msg.id !== messageId),
                        total: old.total - 1,
                    };
                }
            );
        };

        on("newPrivateMessage", handleNewPrivateMessage);
        on("privateMessageDeleted", handlePrivateMessageDeleted);

        return () => {
            off("newPrivateMessage", handleNewPrivateMessage);
            off("privateMessageDeleted", handlePrivateMessageDeleted);
        };
    }, [isConnected, conversationId, on, off, queryClient]);
}
