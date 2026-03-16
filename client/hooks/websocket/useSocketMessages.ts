import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { messageType, ChannelMessagesPageType } from "@/schemas/message.dto";

export function useSocketMessages(channelId?: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { isConnected, socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    setTypingUsers([]);
  }, [channelId]);

  useEffect(() => {
    if (!channelId || !isConnected || !socket) return;

    socket.emit("joinChannel", parseInt(channelId));

    const handleNewMessage = (newMessage: messageType) => {
      queryClient.setQueryData<InfiniteData<ChannelMessagesPageType>>(
        ["channel", channelId],
        (old) => {
          if (!old) return old;
          const firstPage = old.pages[0];
          if (firstPage?.messages?.some((m) => m.id === newMessage.id))
            return old;
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    messages: [...page.messages, newMessage],
                    total: page.total + 1,
                  }
                : page,
            ),
          };
        },
      );
    };

    const handleMessageUpdated = (updatedMessage: messageType) => {
      queryClient.setQueryData<InfiniteData<ChannelMessagesPageType>>(
        ["channel", channelId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m.id === updatedMessage.id ? updatedMessage : m,
              ),
            })),
          };
        },
      );
    };

    const handleMessageDeleted = (data: any) => {
      const messageId = typeof data === "object" ? data.messageId : data;
      queryClient.setQueryData<InfiniteData<ChannelMessagesPageType>>(
        ["channel", channelId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              const filtered = page.messages.filter((m) => m.id !== messageId);
              if (filtered.length === page.messages.length) return page;
              return { ...page, messages: filtered, total: page.total - 1 };
            }),
          };
        },
      );
    };

    const handleReactionAdded = (updatedMessage: messageType) => {
      queryClient.setQueryData<InfiniteData<ChannelMessagesPageType>>(
        ["channel", channelId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                Number(m.id) === Number(updatedMessage.id) ? updatedMessage : m,
              ),
            })),
          };
        },
      );
    };

    const handleUserTyping = ({
      firstname,
      isTyping,
    }: {
      firstname: string;
      isTyping: boolean;
    }) => {
      setTypingUsers((prev) =>
        isTyping
          ? prev.includes(firstname)
            ? prev
            : [...prev, firstname]
          : prev.filter((u) => u !== firstname),
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("userTyping", handleUserTyping);
    socket.on("reactionAdded", handleReactionAdded);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("userTyping", handleUserTyping);
      socket.off("reactionAdded", handleReactionAdded);
    };
  }, [channelId, isConnected, socket, queryClient]);

  const updateMessage = (messageId: number, content: string) => {
    queryClient.setQueryData<InfiniteData<ChannelMessagesPageType>>(
      ["channel", channelId],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) =>
              m.id === messageId ? { ...m, content } : m,
            ),
          })),
        };
      },
    );
  };

  const removeMessage = (messageId: number) => {
    queryClient.setQueryData<InfiniteData<ChannelMessagesPageType>>(
      ["channel", channelId],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            messages: page.messages.filter((m) => m.id !== messageId),
          })),
        };
      },
    );
  };

  const addReaction = (messageId: number, emoji: string) => {
    socket?.emit("addReaction", {
      messageId,
      emoji,
      channelId: parseInt(channelId ?? "0"),
    });
  };

  return { typingUsers, updateMessage, removeMessage, addReaction };
}
