import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSocket = {
  connected: false,
  on: vi.fn(),
  off: vi.fn(),
  once: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}));

vi.mock('@/store/authStore', () => ({
  default: {
    getState: vi.fn(() => ({ token: 'test-token', setToken: vi.fn(), logout: vi.fn() })),
  },
}));

import { socketManager } from '@/lib/socket';
import useAuthStore from '@/store/authStore';

describe('SocketManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset socket privé entre tests
    (socketManager as any).socket = null;
    (socketManager as any).listeners = new Map();
  });

  it('connect retourne null si pas de token', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: null,
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    const result = socketManager.connect();
    expect(result).toBeUndefined();
  });

  it('connect crée un socket si token présent', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    const result = socketManager.connect();
    expect(result).toBeDefined();
  });

  it('connect retourne le socket existant si déjà connecté', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    const s1 = socketManager.connect();
    const s2 = socketManager.connect();
    expect(s1).toBe(s2);
  });

  it('disconnect met le socket à null', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    socketManager.connect();
    socketManager.disconnect();
    expect(socketManager.getSocket()).toBeNull();
  });

  it('getSocket retourne null si pas connecté', () => {
    expect(socketManager.getSocket()).toBeNull();
  });

  it('emit lève une erreur si pas de socket', () => {
    expect(() => socketManager.emit('test')).toThrow('Socket non connecté');
  });

  it('emit appelle socket.emit avec callback', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    socketManager.connect();
    const cb = vi.fn();
    socketManager.emit('test', { data: 1 }, cb);
    expect(mockSocket.emit).toHaveBeenCalledWith('test', { data: 1 }, cb);
  });

  it('emit appelle socket.emit sans callback', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    socketManager.connect();
    socketManager.emit('test', { data: 1 });
    expect(mockSocket.emit).toHaveBeenCalledWith('test', { data: 1 });
  });

  it('on enregistre un listener', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    socketManager.connect();
    const cb = vi.fn();
    socketManager.on('message', cb);
    expect(mockSocket.on).toHaveBeenCalledWith('message', cb);
  });

  it('off supprime un listener spécifique', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    socketManager.connect();
    const cb = vi.fn();
    socketManager.on('message', cb);
    socketManager.off('message', cb);
    expect(mockSocket.off).toHaveBeenCalledWith('message', cb);
  });

  it("off supprime tous les listeners d'un event", () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    socketManager.connect();
    socketManager.off('message');
    expect(mockSocket.off).toHaveBeenCalledWith('message');
  });

  it('reconnectWithNewToken déconnecte et reconnecte', () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: 'tok',
      setToken: vi.fn(),
      logout: vi.fn(),
    } as any);
    socketManager.connect();
    socketManager.reconnectWithNewToken();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
