"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createInvitationRequest,
    joinServerByCodeRequest
} from "@/requests/invitationRequest";

export function useCreateInvitation() {
    return useMutation({
        mutationFn: ({ serverId, params }: { serverId: string | number; params?: { maxUses?: number | null; expiresIn?: number | null } }) =>
            createInvitationRequest(serverId, params),
        onError: (error: any) => toast.error(error.message || "Erreur lors de la création de l'invitation")
    });
}

export function useJoinServer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (code: string) => joinServerByCodeRequest(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allservers"] });
            toast.success("Vous avez rejoint le serveur !");
        },
        onError: (error: any) => toast.error(error.message || "Erreur lors de la connexion au serveur")
    });
}
