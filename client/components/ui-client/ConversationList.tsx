"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetAllConversations } from "@/hooks/queries/useGetAllConversations";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { conversationType } from "@/schemas/conversation.dto";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

export default function ConversationList() {
  const pathname = usePathname();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllConversations();
  const { data: currentUser } = useAuthUser();
  const tm = useTranslations("messages");
  const tc = useTranslations("common");
  const locale = useLocale();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastConversationRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

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

  const conversations = data?.pages.flatMap((page) => page.conversations) ?? [];

  const formatRelativeTime = (dateString: Date | string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return tc("now");
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return tc("yesterday");
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getOtherUser = (conversation: conversationType) => {
    if (!currentUser) return conversation.user1;
    return conversation.user1.id === currentUser.id
      ? conversation.user2
      : conversation.user1;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="h-12 px-5 flex items-center border-b border-zinc-700 shrink-0">
        <h2 className="font-semibold text-white">{tm("privateMessages")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-zinc-400">
            <p>{tm("noConversation")}</p>
          </div>
        ) : (
          <div className="px-2 py-2 flex flex-col gap-0.5">
            {conversations.map(
              (conversation: conversationType, index: number) => {
                const otherUser = getOtherUser(conversation);
                const isActive =
                  pathname === `/conversation/${conversation.id}`;
                const initials = (otherUser.username || "?")
                  .substring(0, 2)
                  .toUpperCase();
                const isLast = index === conversations.length - 1;

                return (
                  <Link
                    key={conversation.id}
                    href={`/conversation/${conversation.id}`}
                    ref={isLast ? lastConversationRef : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-700/50 transition-colors",
                      isActive && "bg-zinc-700",
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
              },
            )}
            {isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Loading />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
