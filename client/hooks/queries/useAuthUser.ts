"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthUserRequest } from "@/requests/userRequest";

export function useAuthUser() {
    return useQuery({
        queryKey: ["authuser"],
        queryFn: ()=>getAuthUserRequest(),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });
}