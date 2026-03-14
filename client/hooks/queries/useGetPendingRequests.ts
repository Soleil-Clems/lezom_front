"use client";

import { useQuery } from "@tanstack/react-query";
import { getPendingRequestsRequest } from "@/requests/friendRequest";
import { friendRequestType } from "@/schemas/friend.dto";

export function useGetPendingRequests() {
    return useQuery<friendRequestType[]>({
        queryKey: ["friends", "pending"],
        queryFn: () => getPendingRequestsRequest(),
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}
