import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

      queryClient.setQueryData<PrivateMessagesPageType>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) {
            return {
              messages: [message],
              total: 1,
              page: 1,
              limit: 50,
              totalPages: 1,
            };
          }
          if (old.messages.some((msg) => msg.id === message.id)) {
            return old;
          }
          return {
            ...old,
            messages: [...old.messages, message],
            total: old.total + 1,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handlePrivateMessageUpdated = (updatedMessage: any) => {
      queryClient.setQueryData<PrivateMessagesPageType>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: old.messages.map((msg) =>
              msg.id === updatedMessage.id
                ? { ...msg, ...updatedMessage }
                : msg,
            ),
          };
        },
      );
    };

    const handlePrivateMessageDeleted = (messageId: number) => {
      queryClient.setQueryData<PrivateMessagesPageType>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: old.messages.filter((msg) => msg.id !== messageId),
            total: old.total - 1,
          };
        },
      );
    };

    const handlePrivateReactionAdded = (updatedMessage: any) => {
      queryClient.setQueryData<PrivateMessagesPageType>(
        ["conversationMessages", conversationId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: old.messages.map((msg) =>
              Number(msg.id) === Number(updatedMessage.id)
                ? { ...msg, ...updatedMessage }
                : msg,
            ),
          };
        },
      );
    };

    on("newPrivateMessage", handleNewPrivateMessage);
    on("privateMessageUpdated", handlePrivateMessageUpdated);
    on("privateMessageDeleted", handlePrivateMessageDeleted);
    on("privateReactionAdded", handlePrivateReactionAdded);

    queryClient.invalidateQueries({
      queryKey: ["conversationMessages", conversationId],
    });

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
