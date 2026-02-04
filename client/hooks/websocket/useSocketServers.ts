import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';

export const useSocketServers = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const socket = socketManager.connect();

        if (!socket) {
            setError('Socket non disponible' as any);
            setLoading(false);
            return;
        }

        const emitFindServers = () => {
            console.log("J'émet findAllServers");
            socketManager.emit('findAllServers', {}, (response: any) => {
                if (response?.error) {
                    setError(response.error);
                } else {
                    console.log("Données reçues du socket:", response);
                    setServers(response);
                }
                setLoading(false);
            });
        };

        if (socket.connected) {
            emitFindServers();
        } else {
            socket.once('connect', emitFindServers);
        }
    }, []);

    return { servers, loading, error };
};