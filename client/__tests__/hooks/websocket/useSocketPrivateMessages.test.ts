import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const handlers: Record<string, (...args: any[]) => void> = {};
const mockSocket = {
  connected: true,
  on: vi.fn((event: string, cb: any) => {
    handlers[event] = cb;
  }),
  off: vi.fn(),
  emit: vi.fn(),
};

vi.mock('@/lib/socket', () => ({
  socketManager: {
    connect: vi.fn(() => mockSocket),
    getSocket: vi.fn(() => mockSocket),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

vi.mock('@/hooks/websocket/useSocket', () => ({
  useSocket: () => ({
    isConnected: true,
    socket: mockSocket,
    on: (event: string, cb: any) => mockSocket.on(event, cb),
    off: (event: string, cb: any) => mockSocket.off(event, cb),
    emit: (event: string, data: any, cb?: any) => mockSocket.emit(event, data, cb),
  }),
}));

import { useSocketPrivateMessages } from '@/hooks/websocket/useSocketPrivateMessages';

const makePage = (messages: any[]) => ({
  messages,
  total: messages.length,
  page: 1,
  limit: 20,
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient, children });
  return { queryClient, wrapper };
};

describe('useSocketPrivateMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const k of Object.keys(handlers)) delete handlers[k];
  });

  it('attache les listeners', () => {
    const { wrapper } = createWrapper();
    renderHook(() => useSocketPrivateMessages('1'), { wrapper });
    expect(handlers.newPrivateMessage).toBeDefined();
    expect(handlers.privateMessageUpdated).toBeDefined();
    expect(handlers.privateMessageDeleted).toBeDefined();
    expect(handlers.privateReactionAdded).toBeDefined();
  });

  it('ajoute un message reçu dans le cache', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['conversationMessages', '1'], {
      pages: [makePage([{ id: 1 }])],
      pageParams: [0],
    });
    renderHook(() => useSocketPrivateMessages('1'), { wrapper });

    act(() => handlers.newPrivateMessage({ id: 2, conversation: { id: 1 } }));
    const data: any = queryClient.getQueryData(['conversationMessages', '1']);
    expect(data.pages[0].messages).toHaveLength(2);
  });

  it('ignore un message d une autre conversation', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['conversationMessages', '1'], {
      pages: [makePage([])],
      pageParams: [0],
    });
    renderHook(() => useSocketPrivateMessages('1'), { wrapper });

    act(() => handlers.newPrivateMessage({ id: 2, conversationId: 99 }));
    const data: any = queryClient.getQueryData(['conversationMessages', '1']);
    expect(data.pages[0].messages).toHaveLength(0);
  });

  it('met à jour un message', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['conversationMessages', '1'], {
      pages: [makePage([{ id: 1, content: 'a' }])],
      pageParams: [0],
    });
    renderHook(() => useSocketPrivateMessages('1'), { wrapper });

    act(() => handlers.privateMessageUpdated({ id: 1, content: 'new' }));
    const data: any = queryClient.getQueryData(['conversationMessages', '1']);
    expect(data.pages[0].messages[0].content).toBe('new');
  });

  it('supprime un message', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['conversationMessages', '1'], {
      pages: [makePage([{ id: 1 }, { id: 2 }])],
      pageParams: [0],
    });
    renderHook(() => useSocketPrivateMessages('1'), { wrapper });

    act(() => handlers.privateMessageDeleted(1));
    const data: any = queryClient.getQueryData(['conversationMessages', '1']);
    expect(data.pages[0].messages).toHaveLength(1);
  });

  it('gère une réaction ajoutée', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['conversationMessages', '1'], {
      pages: [makePage([{ id: 1, reactions: [] }])],
      pageParams: [0],
    });
    renderHook(() => useSocketPrivateMessages('1'), { wrapper });

    act(() => handlers.privateReactionAdded({ id: 1, reactions: [{ emoji: '❤️' }] }));
    const data: any = queryClient.getQueryData(['conversationMessages', '1']);
    expect(data.pages[0].messages[0].reactions).toHaveLength(1);
  });

  it('addPrivateReaction émet au socket', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useSocketPrivateMessages('7'), {
      wrapper,
    });

    act(() => result.current.addPrivateReaction(10, '🔥'));
    expect(mockSocket.emit).toHaveBeenCalledWith('addPrivateReaction', {
      messageId: 10,
      emoji: '🔥',
      conversationId: 7,
    });
  });

  it('ne fait rien sans conversationId', () => {
    const { wrapper } = createWrapper();
    renderHook(() => useSocketPrivateMessages(undefined), { wrapper });
    expect(handlers.newPrivateMessage).toBeUndefined();
  });
});
