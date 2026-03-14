"use client";

import { acceptFriendRequestRequest } from "@/requests/friendRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAcceptFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: number) => acceptFriendRequestRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            queryClient.invalidateQueries({ queryKey: ["friends", "pending"] });
            toast.success("Demande acceptée");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'acceptation");
        },
    });
}
