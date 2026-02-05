"use client";
import { transferOwnershipRequest } from "@/requests/transferOwnershipRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type TransferOwnershipParams = {
    serverId: string | number;
    newOwnerId: number;
};

export function useTransferOwnership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ serverId, newOwnerId }: TransferOwnershipParams) =>
            transferOwnershipRequest(serverId, newOwnerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allservers"] });
            queryClient.invalidateQueries({ queryKey: ["serverMembers"] });
            toast.success("Propriété transférée avec succès");
        },
        onError: (error) => {
            toast.error(
                error.message || "Erreur lors du transfert de propriété"
            );
        },
    });
}
