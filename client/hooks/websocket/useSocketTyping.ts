import { useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "./useSocket";
import { userType } from "@/schemas/user.dto";

interface TypingUser {
    userId: number;
    username: string;
}

export function useSocketTyping(conversationId?: string) {
    const { isConnected, emit, on, off } = useSocket();
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef(false);

    useEffect(() => {
        if (!isConnected || !conversationId) return;

        const handleUserTyping = (data: { userId: number; username: string; conversationId: number }) => {
            if (String(data.conversationId) !== conversationId) return;

            setTypingUsers((prev) => {
                if (prev.some((u) => u.userId === data.userId)) {
                    return prev;
                }
                return [...prev, { userId: data.userId, username: data.username }];
            });
        };

        const handleUserStoppedTyping = (data: { userId: number; conversationId: number }) => {
            if (String(data.conversationId) !== conversationId) return;

            setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        };

        on("userTyping", handleUserTyping);
        on("userStoppedTyping", handleUserStoppedTyping);

        return () => {
            off("userTyping", handleUserTyping);
            off("userStoppedTyping", handleUserStoppedTyping);
        };
    }, [isConnected, conversationId, on, off]);

    const startTyping = useCallback(() => {
        if (!conversationId || !isConnected) return;

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            emit("typing", { conversationId: Number(conversationId) });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 3000);
    }, [conversationId, isConnected, emit]);

    const stopTyping = useCallback(() => {
        if (!conversationId || !isConnected) return;

        if (isTypingRef.current) {
            isTypingRef.current = false;
            emit("stopTyping", { conversationId: Number(conversationId) });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    }, [conversationId, isConnected, emit]);

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const isAnyoneTyping = typingUsers.length > 0;

    return {
        typingUsers,
        startTyping,
        stopTyping,
        isAnyoneTyping,
    };
}
