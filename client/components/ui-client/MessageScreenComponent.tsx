import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { MessageSquare, User, Download, FileText, Play, Pause } from "lucide-react";
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
import MessageReactions from "@/components/ui-client/messageReactions";
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
  onAddReaction?: (messageId: number, emoji: string) => void;
}

export default function MessageScreenComponent({
                                                 messages,
                                                 typingUsers = [],
                                                 channelId,
                                                 onUpdateMessage,
                                                 onRemoveMessage,
                                                 onAddReaction,
                                               }: Props) {
  const t = useTranslations("messages");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { data: user, isLoading, isError } = useAuthUser();
  const { data: allServersData } = useGetAllServers();
  const router = useRouter();
  const params = useParams();
  const createConversation = useCreateConversation();

  const currentChannelId = channelId || (params.channelId as string);
  const serverId = params.serverId as string;

  const updateMessage = useUpdateChannelMessage(currentChannelId);
  const deleteMessage = useDeleteChannelMessage(currentChannelId);

  const [editingMessage, setEditingMessage] = useState<messageType | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<messageType | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

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
      router.push(`/conversation/${conversation.id}`);
    } catch (error) {}
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

  const toggleAudio = (messageId: number, audioUrl: string) => {
    const currentAudio = audioRefs.current.get(messageId);

    // Pause any currently playing audio
    if (playingAudioId !== null && playingAudioId !== messageId) {
      const prevAudio = audioRefs.current.get(playingAudioId);
      if (prevAudio) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
      }
    }

    if (currentAudio) {
      if (playingAudioId === messageId) {
        currentAudio.pause();
        setPlayingAudioId(null);
      } else {
        currentAudio.play();
        setPlayingAudioId(messageId);
      }
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudioId(null);
      audioRefs.current.set(messageId, audio);
      audio.play();
      setPlayingAudioId(messageId);
    }
  };

  const getFileName = (url: string) => {
    try {
      const parts = url.split("/");
      const raw = parts[parts.length - 1];
      return decodeURIComponent(raw.split("?")[0]) || tc("file");
    } catch {
      return tc("file");
    }
  };

  const getFileExtension = (url: string) => {
    try {
      const name = getFileName(url);
      const ext = name.split(".").pop()?.toLowerCase();
      return ext || "";
    } catch {
      return "";
    }
  };


  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  const formatDate = (dateString: Date | undefined) => {
    const date = new Date(dateString || "");
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0)
      return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (days === 1) return tc("yesterday");
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const AuthorName = ({ message, isMyMessage }: { message: messageType; isMyMessage: boolean }) => {
    if (isMyMessage) {
      return <span className="text-xs font-bold text-emerald-400">{tc("me")}</span>;
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
              {t("sendMessage")}
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => router.push(`/profil/${message.author.id}`)}
                className="cursor-pointer text-zinc-200 focus:bg-zinc-700 focus:text-white"
            >
              <User className="size-4" />
              {t("viewProfile")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    );
  };

  const MessageWrapper = ({
                            message,
                            isMyMessage,
                            children,
                          }: {
    message: messageType;
    isMyMessage: boolean;
    children: React.ReactNode;
  }) => {
    const canDelete = canDeleteMessage(message);

    const isActive = activeMessageId === Number(message.id);

    return (
        <div
            key={message.id}
            className={`flex flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
            onClick={() => setActiveMessageId(isActive ? null : Number(message.id))}
        >
          <div className="flex items-center gap-2">
            <AuthorName message={message} isMyMessage={isMyMessage} />
            <span className="text-xs text-zinc-500">
            {formatDate(message.createdAt)}
          </span>
          </div>
          <div className="relative group">
            {canDelete && (
                <div
                    className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} ${isActive ? "opacity-100" : "opacity-0"} sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10`}
                    onClick={(e) => e.stopPropagation()}
                >
                  <MessageActions
                      canEdit={false}
                      canDelete={canDelete}
                      onDelete={() => setDeletingMessage(message)}
                      onReact={(emoji) => { onAddReaction?.(Number(message.id), emoji); setActiveMessageId(null); }}
                  />
                </div>
            )}
            {children}
          </div>
          <MessageReactions
              reactions={message.reactions ?? []}
              currentUserId={Number(user?.id ?? 0)}
              onReact={(emoji) => { onAddReaction?.(Number(message.id), emoji); setActiveMessageId(null); }}
          />
        </div>
    );
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="text-yellow-300 font-medium bg-yellow-400/10 rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
      <div className="w-full p-4 space-y-4 min-h-full">
        {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                {t("noMessages")}
              </h3>
              <p className="text-sm text-zinc-500 max-w-md">
                {t("beFirst")}
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

                {/* ── GIF ── */}
                if (message.type === "gif") {
                  return (
                      <MessageWrapper key={message.id} message={message} isMyMessage={isMyMessage}>
                        <img
                            src={message.content}
                            alt="GIF"
                            className="max-w-[300px] max-h-[300px] rounded-xl object-cover shadow-lg"
                            loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          GIF
                        </div>
                      </MessageWrapper>
                  );
                }

                {/* ── IMAGE ── */}
                if (message.type === "img") {
                  return (
                      <MessageWrapper key={message.id} message={message} isMyMessage={isMyMessage}>
                        <img
                            src={message.content}
                            alt="Image"
                            className="max-w-[400px] max-h-[400px] rounded-xl object-cover shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                            loading="lazy"
                            onClick={() => window.open(message.content, "_blank")}
                        />
                      </MessageWrapper>
                  );
                }

                {/* ── VOICE ── */}
                if (message.type === "voice") {
                  const isPlaying = playingAudioId === message.id;

                  return (
                      <MessageWrapper key={message.id} message={message} isMyMessage={isMyMessage}>
                        <div
                            className={`flex items-center gap-3 p-3 rounded-xl min-w-[220px] max-w-[320px] ${
                                isMyMessage
                                    ? "bg-indigo-600"
                                    : "bg-[#383a40]"
                            }`}
                        >
                          <button
                              onClick={() => toggleAudio(message.id, message.content)}
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                  isMyMessage
                                      ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                                      : "bg-zinc-600 hover:bg-zinc-500 text-zinc-200"
                              }`}
                          >
                            {isPlaying ? (
                                <Pause className="size-5" />
                            ) : (
                                <Play className="size-5 ml-0.5" />
                            )}
                          </button>

                          {/* Waveform visuel */}
                          <div className="flex items-center gap-[3px] flex-1 h-8">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-[3px] rounded-full transition-all duration-150 ${
                                        isMyMessage
                                            ? "bg-indigo-300/60"
                                            : "bg-zinc-500/60"
                                    } ${
                                        isPlaying
                                            ? "animate-pulse"
                                            : ""
                                    }`}
                                    style={{
                                      height: `${Math.random() * 60 + 20}%`,
                                      animationDelay: `${i * 50}ms`,
                                    }}
                                />
                            ))}
                          </div>

                          <span
                              className={`text-xs flex-shrink-0 ${
                                  isMyMessage ? "text-indigo-200" : "text-zinc-400"
                              }`}
                          >
                      🎤
                    </span>
                        </div>
                      </MessageWrapper>
                  );
                }

                {/* ── FILE ── */}
                if (message.type === "file") {
                  const fileName = getFileName(message.content);
                  const ext = getFileExtension(message.content);

                  return (
                      <MessageWrapper key={message.id} message={message} isMyMessage={isMyMessage}>
                        <a
                            href={message.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className={`flex items-center gap-3 p-3 rounded-xl max-w-[360px] transition-colors ${
                                isMyMessage
                                    ? "bg-indigo-600 hover:bg-indigo-500"
                                    : "bg-[#383a40] hover:bg-[#43454b]"
                            }`}
                        >
                          <div
                              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isMyMessage
                                      ? "bg-indigo-500 text-white"
                                      : "bg-zinc-600 text-zinc-300"
                              }`}
                          >
                            <FileText className="size-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                                className={`text-sm font-medium truncate ${
                                    isMyMessage ? "text-white" : "text-zinc-200"
                                }`}
                            >
                              {fileName}
                            </p>
                            {ext && (
                                <p
                                    className={`text-xs ${
                                        isMyMessage ? "text-indigo-200" : "text-zinc-400"
                                    }`}
                                >
                                  {ext.toUpperCase()}
                                </p>
                            )}
                          </div>

                          <Download
                              className={`size-4 flex-shrink-0 ${
                                  isMyMessage ? "text-indigo-200" : "text-zinc-400"
                              }`}
                          />
                        </a>
                      </MessageWrapper>
                  );
                }

                {/* ── TEXT (default) ── */}
                const canEdit = canEditMessage(message);
                const canDelete = canDeleteMessage(message);

                const isActive = activeMessageId === Number(message.id);

                return (
                    <div
                        key={message.id}
                        className={`flex flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}
                        onClick={() => setActiveMessageId(isActive ? null : Number(message.id))}
                    >
                      <div className="flex items-center gap-2">
                        <AuthorName message={message} isMyMessage={isMyMessage} />
                        <span className="text-xs text-zinc-500">
                    {formatDate(message.createdAt)}
                  </span>
                      </div>
                      <div
                          className={`relative group p-3 max-w-[80%] wrap-break-word ${
                              isMyMessage
                                  ? "bg-indigo-600 rounded-l-xl rounded-br-xl text-white"
                                  : "bg-[#383a40] rounded-r-xl rounded-bl-xl text-zinc-200"
                          }`}
                      >
                        {(canEdit || canDelete) && (
                            <div
                                className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} ${isActive ? "opacity-100" : "opacity-0"} sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10`}
                                onClick={(e) => e.stopPropagation()}
                            >
                              <MessageActions
                                  canEdit={canEdit}
                                  canDelete={canDelete}
                                  onEdit={() => setEditingMessage(message)}
                                  onDelete={() => setDeletingMessage(message)}
                                  onReact={(emoji) => { onAddReaction?.(Number(message.id), emoji); setActiveMessageId(null); }}
                              />
                            </div>
                        )}
                        {renderContent(message.content)}
                      </div>
                      <MessageReactions
                          reactions={message.reactions ?? []}
                          currentUserId={Number(user?.id ?? 0)}
                          onReact={(emoji) => { onAddReaction?.(Number(message.id), emoji); setActiveMessageId(null); }}
                      />
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
              {typingUsers.length > 1 ? t("writingMultiple") : t("writingSingle")}
            </div>
        )}


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