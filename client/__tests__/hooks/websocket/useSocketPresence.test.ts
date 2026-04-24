import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const handlers: Record<string, (...args: any[]) => void> = {};
const emit = vi.fn();
const on = vi.fn((event: string, cb: any) => {
  handlers[event] = cb;
});
const off = vi.fn();

vi.mock('@/hooks/websocket/useSocket', () => ({
  useSocket: () => ({ isConnected: true, emit, on, off }),
}));

import { useSocketPresence } from '@/hooks/websocket/useSocketPresence';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient, children });
  return { queryClient, wrapper };
};

describe('useSocketPresence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const k of Object.keys(handlers)) delete handlers[k];
  });

  it('demande la liste initiale des users en ligne', () => {
    const { queryClient, wrapper } = createWrapper();
    renderHook(() => useSocketPresence(), { wrapper });

    expect(emit).toHaveBeenCalledWith('getOnlineUsers', {}, expect.any(Function));

    const cb = emit.mock.calls[0][2];
    act(() => cb({ onlineUserIds: [1, 2, 3] }));
    expect(queryClient.getQueryData(['onlineUserIds'])).toEqual([1, 2, 3]);
  });

  it('gère userOnline en ajoutant un id', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['onlineUserIds'], [1]);
    renderHook(() => useSocketPresence(), { wrapper });

    act(() => handlers.userOnline({ userId: 2 }));
    expect(queryClient.getQueryData(['onlineUserIds'])).toEqual([1, 2]);
  });

  it('ignore userOnline si id déjà présent', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['onlineUserIds'], [1]);
    renderHook(() => useSocketPresence(), { wrapper });

    act(() => handlers.userOnline({ userId: 1 }));
    expect(queryClient.getQueryData(['onlineUserIds'])).toEqual([1]);
  });

  it('initialise la liste avec userOnline si vide', () => {
    const { queryClient, wrapper } = createWrapper();
    renderHook(() => useSocketPresence(), { wrapper });

    act(() => handlers.userOnline({ userId: 5 }));
    expect(queryClient.getQueryData(['onlineUserIds'])).toEqual([5]);
  });

  it('gère userOffline en retirant l id', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['onlineUserIds'], [1, 2]);
    renderHook(() => useSocketPresence(), { wrapper });

    act(() => handlers.userOffline({ userId: 1 }));
    expect(queryClient.getQueryData(['onlineUserIds'])).toEqual([2]);
  });

  it('userOffline retourne [] si pas de données', () => {
    const { queryClient, wrapper } = createWrapper();
    renderHook(() => useSocketPresence(), { wrapper });

    act(() => handlers.userOffline({ userId: 1 }));
    expect(queryClient.getQueryData(['onlineUserIds'])).toEqual([]);
  });
});
