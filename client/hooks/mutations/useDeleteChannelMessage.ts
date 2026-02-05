"use client";

import { deleteChannelMessageRequest } from "@/requests/messageRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteChannelMessage(channelId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageId: number) => deleteChannelMessageRequest(messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages", channelId],
            });
            toast.success("Message supprimé");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression du message");
        },
    });
}
