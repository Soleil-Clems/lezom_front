import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';

export const useSocketServers = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("J’émet findAllServers");


        socketManager.emit('findAllServers', {}, (response: any) => {
            if (response?.error) {
                setError(response.error);
            } else {
                console.log("Données reçues du socket:", response);
                setServers(response);
            }
            setLoading(false);
        });
    }, []);

    return { servers, loading, error };
};