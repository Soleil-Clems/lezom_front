"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetAllConversations } from "@/hooks/queries/useGetAllConversations";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { conversationType } from "@/schemas/conversation.dto";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import { cn } from "@/lib/utils";

export default function ConversationList() {
    const pathname = usePathname();
    const { data: conversations, isLoading, isError } = useGetAllConversations();
    const { data: currentUser } = useAuthUser();

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError) {
        return <Error />;
    }

    const formatRelativeTime = (dateString: Date | string | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "maintenant";
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days === 1) return "hier";
        if (days < 7) return `${days}j`;
        return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    };

    const getOtherUser = (conversation: conversationType) => {
        if (!currentUser) return conversation.user1;
        return conversation.user1.id === currentUser.id
            ? conversation.user2
            : conversation.user1;
    };


    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-zinc-700">
                <h2 className="text-lg font-semibold text-white">Messages privés</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations?.length === 0 ? (
                    <div className="p-4 text-center text-zinc-400">
                        <p>Vous n'avez aucune conversation</p>
                    </div>
                ) : (
                    <div className="py-2">
                        {conversations?.map((conversation: conversationType) => {
                            const otherUser = getOtherUser(conversation);
                            const isActive = pathname === `/messages/${conversation.id}`;

                            return (
                                <Link
                                    key={conversation.id}
                                    href={`/messages/${conversation.id}`}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 hover:bg-zinc-700/50 transition-colors",
                                        isActive && "bg-zinc-700"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-white truncate">
                                                {otherUser.username}
                                            </span>
                                            <span className="text-xs text-zinc-400 ml-2">
                                                {formatRelativeTime(conversation.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
