import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import { messageType } from '@/schemas/message.dto';

export function useSocketMessages(channelId?: string) {
    const [messages, setMessages] = useState<messageType[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(!!channelId);
    const { isConnected, socket } = useSocket();

    useEffect(() => {
        setMessages([]);
        setTypingUsers([]);
        setIsLoading(!!channelId);
    }, [channelId]);

    useEffect(() => {
        if (!channelId || !isConnected || !socket) return;

        socket.emit('joinChannel', parseInt(channelId), (history: messageType[]) => {
            setMessages(history);
            setIsLoading(false);
        });

        const handleNewMessage = (newMessage: messageType) => {
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

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('messageUpdated', handleMessageUpdated);
            socket.off('messageDeleted', handleMessageDeleted);
            socket.off('userTyping', handleUserTyping);
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

    return { messages, isLoading, typingUsers, updateMessage, removeMessage };
}