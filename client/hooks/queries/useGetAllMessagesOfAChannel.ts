"use client";

import { useQuery } from "@tanstack/react-query";
import {getAllMessagesOfAChannelRequest} from "@/requests/channelRequest";

export function useGetAllMessagesOfAChannel(channelId: string) {
    return useQuery({
        queryKey: ["channel", channelId],
        queryFn:  ()=>getAllMessagesOfAChannelRequest(channelId),
    });
}