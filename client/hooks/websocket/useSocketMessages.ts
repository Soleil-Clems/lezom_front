// hooks/websocket/useSocketMessages.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';
import { messageType } from '@/schemas/message.dto';

export function useSocketMessages(channelId?: string) {
    const { isConnected, on, off } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isConnected || !channelId) return;

        const handleNewMessage = (message: messageType) => {
            // Invalider le cache TanStack Query pour recharger les messages
            queryClient.invalidateQueries({
                queryKey: ['messages', channelId]
            });

            // OU mettre à jour directement le cache (optimistic update)
            queryClient.setQueryData<messageType[]>(
                ['messages', channelId],
                (old) => old ? [...old, message] : [message]
            );
        };

        const handleMessageDeleted = (messageId: number) => {
            queryClient.setQueryData<messageType[]>(
                ['messages', channelId],
                (old) => old?.filter((msg) => msg.id !== messageId) || []
            );
        };

        // Écouter les événements
        on('newMessage', handleNewMessage);
        on('messageDeleted', handleMessageDeleted);

        return () => {
            off('newMessage', handleNewMessage);
            off('messageDeleted', handleMessageDeleted);
        };
    }, [isConnected, channelId, on, off, queryClient]);
}