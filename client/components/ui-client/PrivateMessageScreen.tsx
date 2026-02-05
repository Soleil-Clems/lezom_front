"use client";

import React, { useState } from "react";
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

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <Error />;
    }

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
                {
                    onSuccess: () => setEditingMessage(null),
                }
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

    const formatDate = (dateString: Date | string | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (days === 1) {
            return "Hier";
        } else if (days < 7) {
            return date.toLocaleDateString("fr-FR", { weekday: "short" });
        } else {
            return date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
            });
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

                    return (
                        <div
                            key={message.id}
                            className={`flex flex-col gap-1 group ${
                                isMyMessage ? "items-end" : "items-start"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xs font-bold ${
                                        isMyMessage ? "text-emerald-400" : "text-indigo-400"
                                    }`}
                                >
                                    {isMyMessage ? "Moi" : message.sender.username}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {formatDate(message.createdAt)}
                                </span>
                            </div>

                            {isGif ? (
                                <div className="relative group">
                                    {canDelete && (
                                        <div className={`absolute -top-4 ${isMyMessage ? "-left-2" : "-right-2"} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                                            <MessageActions
                                                canEdit={false}
                                                canDelete={canDelete}
                                                onDelete={() => setDeletingMessage(message)}
                                            />
                                        </div>
                                    )}
                                    <img
                                        src={message.content}
                                        alt="GIF"
                                        className="max-w-[300px] max-h-[300px] rounded-xl object-cover shadow-lg"
                                        loading="lazy"
                                    />
                                    {/* Badge GIF optionnel */}
                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        GIF
                                    </div>
                                </div>
                            ) : (
                                // ✅ Affichage texte normal
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