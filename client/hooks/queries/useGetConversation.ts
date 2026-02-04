"use client";

import { useQuery } from "@tanstack/react-query";
import { getConversationByIdRequest } from "@/requests/conversationRequest";

export function useGetConversation(conversationId: string | undefined) {
    return useQuery({
        queryKey: ["conversation", conversationId],
        queryFn: () => getConversationByIdRequest(Number(conversationId)),
        enabled: !!conversationId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
