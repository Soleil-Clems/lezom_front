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
            <div className="px-5 py-4 border-b border-zinc-700">
                <h2 className="text-lg font-semibold text-white">Messages privés</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations?.length === 0 ? (
                    <div className="p-4 text-center text-zinc-400">
                        <p>Vous n&apos;avez aucune conversation</p>
                    </div>
                ) : (
                    <div className="px-2 py-2 flex flex-col gap-0.5">
                        {conversations?.map((conversation: conversationType) => {
                            const otherUser = getOtherUser(conversation);
                            const isActive = pathname === `/conversation/${conversation.id}`;
                            const initials = (otherUser.username || "?").substring(0, 2).toUpperCase();

                            return (
                                <Link
                                    key={conversation.id}
                                    href={`/conversation/${conversation.id}`}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-700/50 transition-colors",
                                        isActive && "bg-zinc-700"
                                    )}
                                >
                                    <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-600 flex items-center justify-center text-[11px] font-semibold text-white uppercase">
                                        {initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-200 truncate">
                                                {otherUser.username}
                                            </span>
                                            <span className="text-xs text-zinc-500 ml-2 shrink-0">
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
