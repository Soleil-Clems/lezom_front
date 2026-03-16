import { useEffect } from "react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useSocket } from "./useSocket";
import { PrivateMessagesPageType } from "@/schemas/conversation.dto";

export function useSocketPrivateMessages(conversationId?: string) {
  const { isConnected, on, off, socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isConnected || !conversationId) return;

    const handleNewPrivateMessage = (message: any) => {
      const msgConversationId =
        message.conversation?.id || message.conversationId;
      if (msgConversationId && String(msgConversationId) !== conversationId) {
        return;
      }

      queryClient.setQueryData<InfiniteData<PrivateMessagesPageType>>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) return old;
          const firstPage = old.pages[0];
          if (firstPage?.messages?.some((msg) => msg.id === message.id)) return old;
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    messages: [...page.messages, message],
                    total: page.total + 1,
                  }
                : page,
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handlePrivateMessageUpdated = (updatedMessage: any) => {
      queryClient.setQueryData<InfiniteData<PrivateMessagesPageType>>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                msg.id === updatedMessage.id
                  ? { ...msg, ...updatedMessage }
                  : msg,
              ),
            })),
          };
        },
      );
    };

    const handlePrivateMessageDeleted = (messageId: number) => {
      queryClient.setQueryData<InfiniteData<PrivateMessagesPageType>>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              const filtered = page.messages.filter((msg) => msg.id !== messageId);
              if (filtered.length === page.messages.length) return page;
              return { ...page, messages: filtered, total: page.total - 1 };
            }),
          };
        },
      );
    };

    const handlePrivateReactionAdded = (updatedMessage: any) => {
      queryClient.setQueryData<InfiniteData<PrivateMessagesPageType>>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                Number(msg.id) === Number(updatedMessage.id)
                  ? { ...msg, ...updatedMessage }
                  : msg,
              ),
            })),
          };
        },
      );
    };

    on("newPrivateMessage", handleNewPrivateMessage);
    on("privateMessageUpdated", handlePrivateMessageUpdated);
    on("privateMessageDeleted", handlePrivateMessageDeleted);
    on("privateReactionAdded", handlePrivateReactionAdded);

    return () => {
      off("newPrivateMessage", handleNewPrivateMessage);
      off("privateMessageUpdated", handlePrivateMessageUpdated);
      off("privateMessageDeleted", handlePrivateMessageDeleted);
      off("privateReactionAdded", handlePrivateReactionAdded);
    };
  }, [isConnected, conversationId, on, off, queryClient]);

  const addPrivateReaction = (messageId: number, emoji: string) => {
    socket?.emit("addPrivateReaction", {
      messageId,
      emoji,
      conversationId: parseInt(conversationId ?? "0"),
    });
  };

  return { addPrivateReaction };
}
