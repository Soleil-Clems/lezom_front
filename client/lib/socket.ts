import { io, Socket } from 'socket.io-client';
import useAuthStore from '@/store/authStore';

class SocketManager {
    private socket: Socket | null = null;
    private listeners: Map<string, Set<Function>> = new Map();

    connect() {
        const token = useAuthStore.getState().token;

        if (!token) {
            console.warn("⚠️ Tentative de connexion sans token");
            return;
        }

        if (this.socket) return this.socket;

        this.socket = io('http://localhost:8080', {
            auth: { token },
            autoConnect: true,
            reconnection: true,
        });

        this.socket.on('connect', () => {
        });

        this.socket.on('disconnect', () => {
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    emit(event: string, data?: any, callback?: Function) {
        if (!this.socket) {
            throw new Error('Socket non connecté');
        }
        if (callback) {
            this.socket.emit(event, data, callback);
        } else {
            this.socket.emit(event, data);
        }
    }

    on(event: string, callback: Function) {
        if (!this.socket) {
            this.connect();
        }

        this.socket?.on(event, callback as any);

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);
    }

    off(event: string, callback?: Function) {
        if (callback) {
            this.socket?.off(event, callback as any);
            this.listeners.get(event)?.delete(callback);
        } else {
            this.socket?.off(event);
            this.listeners.delete(event);
        }
    }

    getSocket() {
        return this.socket;
    }

    reconnectWithNewToken() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        return this.connect();
    }
}

export const socketManager = new SocketManager();