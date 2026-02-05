"use client"
import { channelRequest } from "@/requests/channelRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateChannel(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: channelRequest,
        onSuccess:(data)=> {
            queryClient.invalidateQueries({ queryKey: ["server"] })
            return data;
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}