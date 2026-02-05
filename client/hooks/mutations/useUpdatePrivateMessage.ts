"use client";

import { updatePrivateMessageRequest } from "@/requests/conversationRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateMessageParams {
    messageId: number;
    content: string;
}

export function useUpdatePrivateMessage(conversationId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId, content }: UpdateMessageParams) =>
            updatePrivateMessageRequest(messageId, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["conversationMessages", conversationId],
            });
            toast.success("Message modifié");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la modification du message");
        },
    });
}
