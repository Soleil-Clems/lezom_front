"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllChannelsOfAServerRequest } from "@/requests/serverRequest";

export function useGetAllChannelsOfAServer(serverId: string) {
    return useQuery({
        queryKey: ["server", serverId],
        queryFn:  ()=>getAllChannelsOfAServerRequest(serverId),
    });
}