import { describe, it, expect, vi, beforeEach } from 'vitest';
import { io } from 'socket.io-client';
import useAuthStore from '@/store/authStore';

vi.mock('socket.io-client', () => ({
  io: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  default: {
    getState: vi.fn(() => ({ token: 'test-token' })),
  },
}));

import { socketManager } from '@/lib/socket';

describe('SocketManager', () => {
  const mockSocket = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
  };

  beforeEach(() => {
    socketManager.disconnect();
    vi.mocked(io).mockReturnValue(mockSocket as any);
    vi.mocked(useAuthStore.getState).mockReturnValue({ token: 'test-token' } as any);
    vi.clearAllMocks();
  });

  describe('connect', () => {
    it('connects with token', () => {
      socketManager.connect();

      expect(io).toHaveBeenCalledWith('http://localhost:8080', {
        auth: { token: 'test-token' },
        autoConnect: true,
        reconnection: true,
      });
    });

    it('does not connect without token', () => {
      vi.mocked(useAuthStore.getState).mockReturnValue({ token: null } as any);

      socketManager.connect();
      expect(io).not.toHaveBeenCalled();
    });

    it('returns existing socket if already connected', () => {
      socketManager.connect();
      const callCount = vi.mocked(io).mock.calls.length;

      socketManager.connect();
      expect(vi.mocked(io).mock.calls.length).toBe(callCount);
    });
  });

  describe('disconnect', () => {
    it('disconnects and clears socket', () => {
      socketManager.connect();
      socketManager.disconnect();

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('emit', () => {
    it('emits events on connected socket', () => {
      socketManager.connect();
      socketManager.emit('test', { data: 'value' });

      expect(mockSocket.emit).toHaveBeenCalledWith('test', { data: 'value' });
    });

    it('emits events with callback', () => {
      socketManager.connect();
      const callback = vi.fn();
      socketManager.emit('test', { data: 'value' }, callback);

      expect(mockSocket.emit).toHaveBeenCalledWith('test', { data: 'value' }, callback);
    });

    it('throws when socket is not connected', () => {
      expect(() => socketManager.emit('test', {})).toThrow('Socket non connecté');
    });
  });

  describe('on', () => {
    it('registers event listeners', () => {
      socketManager.connect();
      const handler = vi.fn();
      socketManager.on('message', handler);

      expect(mockSocket.on).toHaveBeenCalledWith('message', handler);
    });

    it('connects automatically if not connected', () => {
      const handler = vi.fn();
      socketManager.on('message', handler);

      expect(io).toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('removes specific event listener', () => {
      socketManager.connect();
      const handler = vi.fn();
      socketManager.off('message', handler);

      expect(mockSocket.off).toHaveBeenCalledWith('message', handler);
    });

    it('removes all listeners for an event', () => {
      socketManager.connect();
      socketManager.off('message');

      expect(mockSocket.off).toHaveBeenCalledWith('message');
    });
  });

  describe('getSocket', () => {
    it('returns null when not connected', () => {
      expect(socketManager.getSocket()).toBeNull();
    });

    it('returns socket when connected', () => {
      socketManager.connect();
      expect(socketManager.getSocket()).toBe(mockSocket);
    });
  });

  describe('reconnectWithNewToken', () => {
    it('disconnects and reconnects', () => {
      socketManager.connect();
      socketManager.reconnectWithNewToken();

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(io).toHaveBeenCalledTimes(2);
    });
  });
});
