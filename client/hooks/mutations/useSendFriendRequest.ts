"use client";

import { sendFriendRequestRequest } from "@/requests/friendRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSendFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => sendFriendRequestRequest(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            toast.success("Demande d'ami envoyée");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'envoi de la demande");
        },
    });
}
