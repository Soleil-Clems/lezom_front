'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getAllConversationsRequest } from '@/requests/conversationRequest';
import { ConversationsPageType } from '@/schemas/conversation.dto';

export function useGetAllConversations() {
  return useInfiniteQuery<ConversationsPageType>({
    queryKey: ['conversations'],
    queryFn: ({ pageParam }) => getAllConversationsRequest(pageParam as number, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
