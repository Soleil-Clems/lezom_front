"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import MessageScreenComponent from "./MessageScreenComponent";
import Message from "@/components/ui-client/messageComponent";
import Loading from "@/components/ui-client/Loading";
import { useGetAllMessagesOfAChannel } from "@/hooks/queries/useGetAllMessagesOfAChannel";
import { useSocketMessages } from "@/hooks/websocket/useSocketMessages";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { OnlineFriendsList } from "@/components/ui-client/onlinefriendlist";

export default function MessageLayout({ channelId }: { channelId: string }) {
  const params = useParams();
  const serverId = params.serverId as string;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllMessagesOfAChannel(channelId);

  const { typingUsers, updateMessage, removeMessage, addReaction } =
    useSocketMessages(channelId);

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
    resetKey: channelId,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-row w-full h-full overflow-hidden bg-[#313338]">
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div ref={sentinelRef} className="h-1" />
          <MessageScreenComponent
            messages={messages}
            typingUsers={typingUsers}
            channelId={channelId}
            onUpdateMessage={updateMessage}
            onRemoveMessage={removeMessage}
            onAddReaction={addReaction}
          />
        </div>
        <div className="shrink-0">
          <Message channelId={channelId} />
        </div>
      </div>

      <OnlineFriendsList serverId={serverId} />
    </div>
  );
}
