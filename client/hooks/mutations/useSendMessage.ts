"use client"
import { sendMessageRequest } from "@/requests/messageRequest";
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSendMessage(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: sendMessageRequest,
        onSuccess:(data)=> {
            queryClient.invalidateQueries({ queryKey: ["channel"] })
            return data;
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}