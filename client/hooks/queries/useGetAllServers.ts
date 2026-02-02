"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllServersRequest } from "@/requests/serverRequest";

export function useGetAllServers() {
    return useQuery({
        queryKey: ["allservers"],
        queryFn: ()=>getAllServersRequest(),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });
}