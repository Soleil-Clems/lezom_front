"use client";

import { useQuery } from "@tanstack/react-query";
import { getBannedUsersRequest } from "@/requests/banRequest";

export function useGetBannedUsers(serverId: string | number) {
    return useQuery({
        queryKey: ["server-bans", serverId],
        queryFn: () => getBannedUsersRequest(serverId),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: !!serverId,
    });
}
