"use client"
import { serverRequest } from "@/requests/serverRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateServer(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: serverRequest,
        onSuccess:(data)=> {
            queryClient.invalidateQueries({ queryKey: ["allservers"] })
            return data;
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}