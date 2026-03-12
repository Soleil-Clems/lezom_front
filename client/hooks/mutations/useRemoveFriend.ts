"use client";

import { removeFriendRequest } from "@/requests/friendRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRemoveFriend() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => removeFriendRequest(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            toast.success("Ami supprimé");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression");
        },
    });
}
