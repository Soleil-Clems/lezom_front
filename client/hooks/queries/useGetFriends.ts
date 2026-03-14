"use client";

import { useQuery } from "@tanstack/react-query";
import { getFriendsRequest } from "@/requests/friendRequest";
import { friendUserType } from "@/schemas/friend.dto";

export function useGetFriends() {
    return useQuery<friendUserType[]>({
        queryKey: ["friends"],
        queryFn: () => getFriendsRequest(),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
