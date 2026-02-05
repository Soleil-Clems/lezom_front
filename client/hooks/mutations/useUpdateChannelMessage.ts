"use client";

import { updateChannelMessageRequest } from "@/requests/messageRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateMessageParams {
    messageId: number;
    content: string;
}

export function useUpdateChannelMessage(channelId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId, content }: UpdateMessageParams) =>
            updateChannelMessageRequest(messageId, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages", channelId],
            });
            toast.success("Message modifié");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la modification du message");
        },
    });
}
