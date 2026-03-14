"use client";

import { useQuery } from "@tanstack/react-query";
import { searchUsersRequest } from "@/requests/friendRequest";

export function useSearchUsers(query: string) {
    return useQuery({
        queryKey: ["users", "search", query],
        queryFn: () => searchUsersRequest(query),
        enabled: query.trim().length >= 2,
        staleTime: 30 * 1000,
    });
}
