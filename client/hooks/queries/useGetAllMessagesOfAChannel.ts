"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllMessagesOfAChannelRequest } from "@/requests/channelRequest";
import { ChannelMessagesPageType } from "@/schemas/message.dto";

export function useGetAllMessagesOfAChannel(channelId: string) {
  return useInfiniteQuery<ChannelMessagesPageType>({
    queryKey: ["channel", channelId],
    queryFn: ({ pageParam }) =>
      getAllMessagesOfAChannelRequest(channelId, pageParam as number, 50),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!channelId,
    staleTime: 1 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
