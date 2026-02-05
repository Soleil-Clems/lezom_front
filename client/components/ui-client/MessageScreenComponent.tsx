import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MessageSquare, User } from "lucide-react";
import { messageType } from "@/schemas/message.dto";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { useCreateConversation } from "@/hooks/mutations/useCreateConversation";
import { useGetAllServers } from "@/hooks/queries/useGetAllServers";
import { useUpdateChannelMessage } from "@/hooks/mutations/useUpdateChannelMessage";
import { useDeleteChannelMessage } from "@/hooks/mutations/useDeleteChannelMessage";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import SystemMessage from "@/components/ui-client/SystemMessage";
import MessageActions from "@/components/ui-client/MessageActions";
import EditMessageDialog from "@/components/ui-client/EditMessageDialog";
import DeleteMessageDialog from "@/components/ui-client/DeleteMessageDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  messages: messageType[];
  typingUsers?: string[];
  channelId?: string;
  onUpdateMessage?: (messageId: number, content: string) => void;
  onRemoveMessage?: (messageId: number) => void;
}

export default function MessageScreenComponent({
  messages,
  typingUsers = [],
  channelId,
  onUpdateMessage,
  onRemoveMessage,
}: Props) {
  const { data: user, isLoading, isError } = useAuthUser();
  const { data: allServersData } = useGetAllServers();
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const createConversation = useCreateConversation();

  const currentChannelId = channelId || (params.channelId as string);
  const serverId = params.serverId as string;

  const updateMessage = useUpdateChannelMessage(currentChannelId);
  const deleteMessage = useDeleteChannelMessage(currentChannelId);

  const [editingMessage, setEditingMessage] = useState<messageType | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<messageType | null>(null);

  const allServers = Array.isArray(allServersData) ? allServersData : (allServersData as any)?.data || [];
  const currentServer = allServers.find((s: any) => s.id.toString() === serverId);
  const currentUserMembership = currentServer?.memberships?.find(
    (m: any) => m.members?.id === user?.id
  );
  const currentUserRole = currentUserMembership?.role;
  const isServerOwner = currentUserRole === "server_owner";
  const isServerAdmin = currentUserRole === "server_admin";

  const handleSendMessage = async (userId: number) => {
    try {
      const conversation = await createConversation.mutateAsync({ userId });
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
    }
  };

  const canEditMessage = (message: messageType) => {
    return message.author.id === user?.id && message.type === "text";
  };

  const canDeleteMessage = (message: messageType) => {
    return message.author.id === user?.id || isServerOwner || isServerAdmin;
  };

  const handleEditMessage = (content: string) => {
    if (editingMessage) {
      updateMessage.mutate(
        { messageId: editingMessage.id, content },
        {
          onSuccess: () => {
            onUpdateMessage?.(editingMessage.id, content);
            setEditingMessage(null);
          },
        }
      );
    }
  };

  const handleDeleteMessage = () => {
    if (deletingMessage) {
      deleteMessage.mutate(deletingMessage.id, {
        onSuccess: () => {
          onRemoveMessage?.(deletingMessage.id);
          setDeletingMessage(null);
        },
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  const formatDate = (dateString: Date | undefined) => {
    const date = new Date(dateString || "");
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0)
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (days === 1) return "Hier";
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const AuthorName = ({ message, isMyMessage }: { message: messageType; isMyMessage: boolean }) => {
    if (isMyMessage) {
      return <span className="text-xs font-bold text-emerald-400">Moi</span>;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors">
            {message.author.username}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-zinc-800 border-zinc-700">
          <DropdownMenuItem
            onClick={() => handleSendMessage(message.author.id)}
            className="cursor-pointer text-zinc-200 focus:bg-zinc-700 focus:text-white"
          >
            <MessageSquare className="size-4" />
            Envoyer un message
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/profil/${message.author.id}`)}
            className="cursor-pointer text-zinc-200 focus:bg-zinc-700 focus:text-white"
          >
            <User className="size-4" />
            Voir le profil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-full p-4 space-y-4 min-h-full">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">
            Aucun message pour le moment
          </h3>
          <p className="text-sm text-zinc-500 max-w-md">
            Soyez le premier à lancer la conversation ! Envoyez un message pour
            commencer à discuter.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => {
            if (message.type === "system") {
              return (
                <SystemMessage
                  key={message.id}
                  content={message.content}
                  date={message.createdAt}
                />
              );
            }

            const isMyMessage = message.author.id === user?.id;

            if (message.type === "gif") {
              return (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2">
                    <AuthorName message={message} isMyMessage={isMyMessage} />
                    <span className="text-xs text-zinc-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <div className="relative group">
                    <img
                      src={message.content}
                      alt="GIF"
                      className="max-w-[300px] max-h-[300px] rounded-xl object-cover shadow-lg"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      GIF
                    </div>
                  </div>
                </div>
              );
            }

            const canEdit = canEditMessage(message);
            const canDelete = canDeleteMessage(message);

            return (
              <div
                key={message.id}
                className={`flex flex-col gap-1 group ${isMyMessage ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2">
                  <AuthorName message={message} isMyMessage={isMyMessage} />
                  <span className="text-xs text-zinc-500">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
                <div
                  className={`relative p-3 max-w-[80%] break-words ${
                    isMyMessage
                      ? "bg-indigo-600 rounded-l-xl rounded-br-xl text-white"
                      : "bg-[#383a40] rounded-r-xl rounded-bl-xl text-zinc-200"
                  }`}
                >
                  {(canEdit || canDelete) && (
                    <div className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                      <MessageActions
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onEdit={() => setEditingMessage(message)}
                        onDelete={() => setDeletingMessage(message)}
                      />
                    </div>
                  )}
                  {message.content}
                </div>
              </div>
            );
          })}
        </>
      )}

      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-zinc-400 italic animate-pulse">
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"></span>
            <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
          {typingUsers.join(", ")}{" "}
          {typingUsers.length > 1 ? "écrivent..." : "écrit..."}
        </div>
      )}

      <div ref={scrollRef} />

      <EditMessageDialog
        open={!!editingMessage}
        onOpenChange={(open) => !open && setEditingMessage(null)}
        initialContent={editingMessage?.content || ""}
        onSave={handleEditMessage}
        isLoading={updateMessage.isPending}
      />

      <DeleteMessageDialog
        open={!!deletingMessage}
        onOpenChange={(open) => !open && setDeletingMessage(null)}
        onConfirm={handleDeleteMessage}
        isLoading={deleteMessage.isPending}
      />
    </div>
  );
}