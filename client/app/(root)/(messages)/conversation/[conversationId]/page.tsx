"use client";

import { use } from "react";
import { useGetConversation } from "@/hooks/queries/useGetConversation";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import PrivateMessageHeader from "@/components/ui-client/PrivateMessageHeader";
import PrivateMessageLayout from "@/components/ui-client/PrivateMessageLayout";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";

export default function ConversationPage({
    params,
}: {
    params: Promise<{ conversationId: string }>;
}) {
    const { conversationId } = use(params);

    const { data: conversation, isLoading, isError } = useGetConversation(conversationId);
    const { data: currentUser } = useAuthUser();

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError || !conversation) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Error />
            </div>
        );
    }

    const otherUser =
        currentUser && conversation.user1.id === currentUser.id
            ? conversation.user2
            : conversation.user1;

    return (
        <div className="flex flex-col h-full w-full">
            <PrivateMessageHeader otherUser={otherUser} />
            <PrivateMessageLayout conversationId={conversationId} />
        </div>
    );
}
