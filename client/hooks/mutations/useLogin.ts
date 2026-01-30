"use client"
import { loginRequest } from "@/requests/authRequest";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin(){
    return useMutation({
        mutationFn: loginRequest,
        onSuccess:(data)=> {
            return data;
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}