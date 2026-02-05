import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';
import { messageType } from '@/schemas/message.dto';

export function useSocketMessages(channelId?: string) {
    const [messages, setMessages] = useState<messageType[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(!!channelId);

    useEffect(() => {
        if (!channelId) return;

        const socket = socketManager.getSocket();
        if (!socket) return;

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
            setMessages([]);
            setTypingUsers([]);
            setIsLoading(true);
        };
    }, [channelId]);

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