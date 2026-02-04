"use client";

import { createConversationRequest } from "@/requests/conversationRequest";
import { createConversationType } from "@/schemas/conversation.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateConversation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: createConversationType) => createConversationRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la création de la conversation");
        },
    });
}
