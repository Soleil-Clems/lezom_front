"use client";

import { useQuery } from "@tanstack/react-query";
import { getPendingRequestsRequest } from "@/requests/friendRequest";

export function useGetPendingRequests() {
    return useQuery({
        queryKey: ["friends", "pending"],
        queryFn: () => getPendingRequestsRequest(),
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}
