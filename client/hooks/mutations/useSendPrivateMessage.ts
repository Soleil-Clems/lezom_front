"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { socketManager } from "@/lib/socket";

type MessageType = "text" | "img" | "file" | "pdf";

export function useSendPrivateMessage(conversationId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { content: string; type: MessageType }) => {
            return new Promise((resolve, reject) => {
                socketManager.emit(
                    "sendPrivateMessage",
                    {
                        ...data,
                        conversationId: Number(conversationId),
                    },
                    (response: any) => {
                        if (response?.error) {
                            reject(new Error(response.error));
                        } else {
                            resolve(response);
                        }
                    }
                );

                setTimeout(() => {
                    reject(new Error("Timeout"));
                }, 5000);
            });
        },
        onSuccess: () => {
            // Le WebSocket `newPrivateMessage` gère la mise à jour du cache
            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'envoi du message");
        },
    });
}
