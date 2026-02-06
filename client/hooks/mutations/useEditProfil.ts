"use client"
import { updateUserRequest } from "@/requests/userRequest";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";
import {userUpdateType} from "@/schemas/user.dto";

export function useEditProfil(id:string){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: userUpdateType) => updateUserRequest(id, body),
        onSuccess:(data)=> {
            queryClient.invalidateQueries({ queryKey: ["authuser"] })
            return data;
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}