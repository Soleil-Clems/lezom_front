"use client"
import { loginRequest } from "@/requests/authRequest";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess:(data)=> {
            queryClient.invalidateQueries({ queryKey: ["authuser"] })
            return data;
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}