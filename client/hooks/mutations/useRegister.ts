"use client"
import { registerRequest } from "@/requests/authRequest";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegister(){
    return useMutation({
        mutationFn: registerRequest,
        onSuccess:(data)=> {
            return data;
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}