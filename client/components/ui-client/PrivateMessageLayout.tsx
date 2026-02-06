"use client";

import { useEffect, useRef } from "react";
import { useGetConversationMessages } from "@/hooks/queries/useGetConversationMessages";
import { useSocketPrivateMessages } from "@/hooks/websocket/useSocketPrivateMessages";
import PrivateMessageScreen from "@/components/ui-client/PrivateMessageScreen";
import Message from "@/components/ui-client/messageComponent";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";

interface PrivateMessageLayoutProps {
    conversationId: string;
}

export default function PrivateMessageLayout({ conversationId }: PrivateMessageLayoutProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        data,
        isLoading,
        isError,
    } = useGetConversationMessages(conversationId);

    const messages = data?.messages || [];

    useSocketPrivateMessages(conversationId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Error />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                <PrivateMessageScreen messages={messages || []} conversationId={conversationId} />
                <div ref={messagesEndRef} />
            </div>

            <Message conversationId={conversationId} />
        </div>
    );
}
