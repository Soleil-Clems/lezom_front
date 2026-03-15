"use client";

import { useMemo } from "react";
import { useGetConversationMessages } from "@/hooks/queries/useGetConversationMessages";
import { useSocketPrivateMessages } from "@/hooks/websocket/useSocketPrivateMessages";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import PrivateMessageScreen from "@/components/ui-client/PrivateMessageScreen";
import Message from "@/components/ui-client/messageComponent";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";

interface PrivateMessageLayoutProps {
  conversationId: string;
}

export default function PrivateMessageLayout({
  conversationId,
}: PrivateMessageLayoutProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetConversationMessages(conversationId);

  const { addPrivateReaction } = useSocketPrivateMessages(conversationId);

  const messages = useMemo(
    () => (data ? [...data.pages].reverse().flatMap((p) => p.messages) : []),
    [data],
  );

  const { scrollContainerRef, sentinelRef } = useInfiniteScroll({
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    messageCount: messages.length,
    resetKey: conversationId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Error />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto discord-scrollbar"
      >
        <div ref={sentinelRef} className="h-1" />
        <PrivateMessageScreen
          messages={messages}
          conversationId={conversationId}
          onAddReaction={addPrivateReaction}
        />
      </div>

      <Message conversationId={conversationId} />
    </div>
  );
}
