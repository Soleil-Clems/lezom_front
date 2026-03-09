"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Download, FileText } from "lucide-react";
import { privateMessageType } from "@/schemas/conversation.dto";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { useUpdatePrivateMessage } from "@/hooks/mutations/useUpdatePrivateMessage";
import { useDeletePrivateMessage } from "@/hooks/mutations/useDeletePrivateMessage";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import MessageActions from "@/components/ui-client/MessageActions";
import EditMessageDialog from "@/components/ui-client/EditMessageDialog";
import DeleteMessageDialog from "@/components/ui-client/DeleteMessageDialog";

interface PrivateMessageScreenProps {
    messages: privateMessageType[];
    conversationId?: string;
}

export default function PrivateMessageScreen({ messages, conversationId }: PrivateMessageScreenProps) {
    const { data: user, isLoading, isError } = useAuthUser();
    const updateMessage = useUpdatePrivateMessage(conversationId);
    const deleteMessage = useDeletePrivateMessage(conversationId);

    const [editingMessage, setEditingMessage] = useState<privateMessageType | null>(null);
    const [deletingMessage, setDeletingMessage] = useState<privateMessageType | null>(null);
    const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
    const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

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

    const canEditMessage = (message: privateMessageType) => {
        return message.sender.id === user?.id && message.type === "text";
    };

    const canDeleteMessage = (message: privateMessageType) => {
        return message.sender.id === user?.id;
    };

    const handleEditMessage = (content: string) => {
        if (editingMessage) {
            updateMessage.mutate(
                { messageId: editingMessage.id, content },
                { onSuccess: () => setEditingMessage(null) }
            );
        }
    };

    const handleDeleteMessage = () => {
        if (deletingMessage) {
            deleteMessage.mutate(deletingMessage.id, {
                onSuccess: () => setDeletingMessage(null),
            });
        }
    };

    const toggleAudio = (messageId: number, audioUrl: string) => {
        if (playingAudioId !== null && playingAudioId !== messageId) {
            const prevAudio = audioRefs.current.get(playingAudioId);
            if (prevAudio) {
                prevAudio.pause();
                prevAudio.currentTime = 0;
            }
        }

        const currentAudio = audioRefs.current.get(messageId);
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
            return decodeURIComponent(raw.split("?")[0]) || "Fichier";
        } catch {
            return "Fichier";
        }
    };

    const getFileExtension = (url: string) => {
        try {
            const name = getFileName(url);
            return name.split(".").pop()?.toLowerCase() || "";
        } catch {
            return "";
        }
    };

    const formatDate = (dateString: Date | string | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        } else if (days === 1) {
            return "Hier";
        } else if (days < 7) {
            return date.toLocaleDateString("fr-FR", { weekday: "short" });
        } else {
            return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
        }
    };

    const messageList = Array.isArray(messages) ? messages : [];

    return (
        <div className="w-full p-4 space-y-4">
            {messageList.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-400">
                    <p>Aucun message. Commencez la conversation !</p>
                </div>
            ) : (
                messageList.map((message) => {
                    const isMyMessage = message.sender.id === user?.id;
                    const canEdit = canEditMessage(message);
                    const canDelete = canDeleteMessage(message);
                    const isGif = message.type === "gif";
                    const isVoice = message.type === "voice";
                    const isFile = message.type === "file";
                    const isText = message.type === "text";
                    const isImage = message.type === "img";

                    return (
                        <div
                            key={message.id}
                            className={`flex flex-col gap-1 group ${isMyMessage ? "items-end" : "items-start"}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isMyMessage ? "text-emerald-400" : "text-indigo-400"}`}>
                                    {isMyMessage ? "Moi" : message.sender.username}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {formatDate(message.createdAt)}
                                </span>
                            </div>

                            {/* ── GIF ── */}
                            {isGif && (
                                <div className="relative group">
                                    {canDelete && (
                                        <div className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10`}>
                                            <MessageActions canEdit={false} canDelete={canDelete} onDelete={() => setDeletingMessage(message)} />
                                        </div>
                                    )}
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
                            )}

                            {/* ── IMAGE ── */}
                            {isImage && (
                                <div className="relative">
                                    {canDelete && (
                                        <div className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10`}>
                                            <MessageActions canEdit={false} canDelete={canDelete} onDelete={() => setDeletingMessage(message)} />
                                        </div>
                                    )}
                                    <img
                                        src={message.content}
                                        alt="Image"
                                        className="max-w-[400px] max-h-[400px] rounded-xl object-cover shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        loading="lazy"
                                        onClick={() => window.open(message.content, "_blank")}
                                    />
                                </div>
                            )}

                            {/* ── VOICE ── */}
                            {isVoice && (
                                <div className="relative">
                                    {canDelete && (
                                        <div className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10`}>
                                            <MessageActions canEdit={false} canDelete={canDelete} onDelete={() => setDeletingMessage(message)} />
                                        </div>
                                    )}
                                    <div className={`flex items-center gap-3 p-3 rounded-xl min-w-[220px] max-w-[320px] ${isMyMessage ? "bg-indigo-600" : "bg-[#383a40]"}`}>
                                        <button
                                            onClick={() => toggleAudio(message.id, message.content)}
                                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                                isMyMessage ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-zinc-600 hover:bg-zinc-500 text-zinc-200"
                                            }`}
                                        >
                                            {playingAudioId === message.id ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
                                        </button>
                                        <div className="flex items-center gap-[3px] flex-1 h-8">
                                            {Array.from({ length: 20 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-[3px] rounded-full transition-all duration-150 ${
                                                        isMyMessage ? "bg-indigo-300/60" : "bg-zinc-500/60"
                                                    } ${playingAudioId === message.id ? "animate-pulse" : ""}`}
                                                    style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 50}ms` }}
                                                />
                                            ))}
                                        </div>
                                        <span className={`text-xs flex-shrink-0 ${isMyMessage ? "text-indigo-200" : "text-zinc-400"}`}>🎤</span>
                                    </div>
                                </div>
                            )}

                            {/* ── FILE ── */}
                            {isFile && (
                                <div className="relative">
                                    {canDelete && (
                                        <div className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10`}>
                                            <MessageActions canEdit={false} canDelete={canDelete} onDelete={() => setDeletingMessage(message)} />
                                        </div>
                                    )}
                                    <a
                                        href={message.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className={`flex items-center gap-3 p-3 rounded-xl max-w-[360px] transition-colors ${
                                            isMyMessage ? "bg-indigo-600 hover:bg-indigo-500" : "bg-[#383a40] hover:bg-[#43454b]"
                                        }`}
                                    >
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isMyMessage ? "bg-indigo-500 text-white" : "bg-zinc-600 text-zinc-300"}`}>
                                            <FileText className="size-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isMyMessage ? "text-white" : "text-zinc-200"}`}>
                                                {getFileName(message.content)}
                                            </p>
                                            {getFileExtension(message.content) && (
                                                <p className={`text-xs ${isMyMessage ? "text-indigo-200" : "text-zinc-400"}`}>
                                                    {getFileExtension(message.content).toUpperCase()}
                                                </p>
                                            )}
                                        </div>
                                        <Download className={`size-4 flex-shrink-0 ${isMyMessage ? "text-indigo-200" : "text-zinc-400"}`} />
                                    </a>
                                </div>
                            )}

                            {/* ── TEXT ── */}
                            {isText && (
                                <div
                                    className={`relative p-3 max-w-[80%] break-words ${
                                        isMyMessage
                                            ? "bg-indigo-600 rounded-l-xl rounded-br-xl text-white"
                                            : "bg-[#383a40] rounded-r-xl rounded-bl-xl text-zinc-200"
                                    }`}
                                >
                                    {(canEdit || canDelete) && (
                                        <div className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10`}>
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
                            )}
                        </div>
                    );
                })
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