"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  updateServerNameRequest, 
  deleteServerRequest, 
  updateChannelNameRequest, 
  deleteChannelRequest 
} from "@/requests/serverRequest";


export function useUpdateServer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, name }: { id: string | number, name: string }) => updateServerNameRequest(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allservers"] });
            toast.success("Serveur mis à jour");
        },
        onError: (error: any) => toast.error(error.message)
    });
}

export function useDeleteServer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => deleteServerRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allservers"] });
            toast.success("Serveur supprimé");
        },
        onError: (error: any) => toast.error(error.message)
    });
}


export function useUpdateChannel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, name }: { id: string | number, name: string }) => updateChannelNameRequest(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["server"] });
            toast.success("Salon mis à jour");
        },
        onError: (error: any) => toast.error(error.message)
    });
}


export function useDeleteChannel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => deleteChannelRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["server"] });
            toast.success("Salon supprimé");
        },
        onError: (error: any) => toast.error(error.message)
    });
}