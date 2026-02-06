"use client";

import { deletePrivateMessageRequest } from "@/requests/conversationRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeletePrivateMessage(conversationId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageId: number) => deletePrivateMessageRequest(messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["conversationMessages", conversationId],
            });
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression du message");
        },
    });
}
