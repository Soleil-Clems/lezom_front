import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';

export const useSocketServers = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null|string>(null);

    useEffect(() => {
        const socket = socketManager.connect();

        if (!socket) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError('Socket non disponible');
            setLoading(false);
            return;
        }

        const emitFindServers = () => {
            socketManager.emit('findAllServers', {}, (response: any) => {
                if (response?.error) {
                    setError(response.error);
                } else {
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