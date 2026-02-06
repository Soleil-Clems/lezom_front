import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';
import useAuthStore from '@/store/authStore';

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (!token) return;

        const socket = socketManager.connect();
        if (!socket) return;

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        setIsConnected(socket.connected);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [token]);

    return {
        isConnected,
        socket: socketManager.getSocket(),
        emit: socketManager.emit.bind(socketManager),
        on: socketManager.on.bind(socketManager),
        off: socketManager.off.bind(socketManager),
    };
}