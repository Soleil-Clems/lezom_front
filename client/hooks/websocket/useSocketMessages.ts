import { useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';
import { messageType } from '@/schemas/message.dto';

export function useSocketMessages(channelId?: string) {
    const [messages, setMessages] = useState<messageType[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(!!channelId);
    const { isConnected, socket } = useSocket();
    const pendingMessages = useRef<messageType[]>([]);
    const historyLoaded = useRef(false);

    useEffect(() => {
        setMessages([]);
        setTypingUsers([]);
        setIsLoading(!!channelId);
        pendingMessages.current = [];
        historyLoaded.current = false;
    }, [channelId]);

    useEffect(() => {
        if (!channelId || !isConnected || !socket) return;

        const handleNewMessage = (newMessage: messageType) => {
            if (!historyLoaded.current) {
                pendingMessages.current.push(newMessage);
                return;
            }
            setMessages((prev) => {
                if (prev.find(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
            });
        };

        const handleMessageUpdated = (updatedMessage: messageType) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
            );
        };

        const handleMessageDeleted = (messageId: number) => {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        };

        const handleReactionAdded = (addReaction: messageType) => {
            setMessages((prev) =>
                prev.map((m) => (Number(m.id) === Number(addReaction.id) ? addReaction : m)))
        }

        const handleUserTyping = ({ firstname, isTyping }: { firstname: string, isTyping: boolean }) => {
            setTypingUsers((prev) =>
                isTyping
                    ? (prev.includes(firstname) ? prev : [...prev, firstname])
                    : prev.filter((u) => u !== firstname)
            );
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('messageUpdated', handleMessageUpdated);
        socket.on('messageDeleted', handleMessageDeleted);
        socket.on('userTyping', handleUserTyping);
        socket.on('reactionAdded',handleReactionAdded);

        socket.emit('joinChannel', parseInt(channelId), (history: messageType[]) => {
            const merged = [...history];
            for (const msg of pendingMessages.current) {
                if (!merged.find(m => m.id === msg.id)) {
                    merged.push(msg);
                }
            }
            pendingMessages.current = [];
            historyLoaded.current = true;
            setMessages(merged);
            setIsLoading(false);
        });

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('messageUpdated', handleMessageUpdated);
            socket.off('messageDeleted', handleMessageDeleted);
            socket.off('userTyping', handleUserTyping);
            socket.off('reactionAdded', handleReactionAdded);
        };
    }, [channelId, isConnected, socket]);

    const updateMessage = (messageId: number, content: string) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, content } : m))
        );
    };

    const removeMessage = (messageId: number) => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
    };

    const addReaction = (messageId: number, emoji: string) => {
        socket?.emit('addReaction', { messageId, emoji, channelId: parseInt(channelId ?? '0') })
    };

    return { messages, isLoading, typingUsers, updateMessage, removeMessage, addReaction };
}