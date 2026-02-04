"use client";

import { useQuery } from "@tanstack/react-query";
import { getConversationMessagesRequest } from "@/requests/conversationRequest";

export function useGetConversationMessages(
    conversationId: string | undefined,
    page: number = 1,
    limit: number = 50
) {
    return useQuery({
        queryKey: ["conversationMessages", conversationId],
        queryFn: () => getConversationMessagesRequest(Number(conversationId), page, limit),
        enabled: !!conversationId,
        staleTime: 1 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
