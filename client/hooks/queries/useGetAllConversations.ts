"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllConversationsRequest } from "@/requests/conversationRequest";

export function useGetAllConversations() {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: () => getAllConversationsRequest(),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
