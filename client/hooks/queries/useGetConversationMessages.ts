'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getConversationMessagesRequest } from '@/requests/conversationRequest';
import { PrivateMessagesPageType } from '@/schemas/conversation.dto';

export function useGetConversationMessages(conversationId: string | undefined) {
  return useInfiniteQuery<PrivateMessagesPageType>({
    queryKey: ['conversationMessages', conversationId],
    queryFn: ({ pageParam }) =>
      getConversationMessagesRequest(Number(conversationId), pageParam as number, 50),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!conversationId,
    staleTime: 1 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
