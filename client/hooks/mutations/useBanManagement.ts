"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { banUserRequest, unbanUserRequest } from "@/requests/banRequest";

export function useBanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            serverId,
            userId,
            reason,
        }: {
            serverId: string | number;
            userId: number;
            reason?: string;
        }) => banUserRequest(serverId, userId, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["server-bans", variables.serverId] });
            queryClient.invalidateQueries({ queryKey: ["allservers"] });
            toast.success("Utilisateur banni avec succès");
        },
        onError: (error: any) => toast.error(error.message || "Erreur lors du bannissement"),
    });
}

export function useUnbanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            serverId,
            userId,
        }: {
            serverId: string | number;
            userId: number;
        }) => unbanUserRequest(serverId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["server-bans", variables.serverId] });
            queryClient.invalidateQueries({ queryKey: ["allservers"] });
            toast.success("Utilisateur débanni avec succès");
        },
        onError: (error: any) => toast.error(error.message || "Erreur lors du débannissement"),
    });
}
