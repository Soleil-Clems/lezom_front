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

vi.mock('./useSocket', () => ({
  useSocket: () => ({ isConnected: true, socket: mockSocket }),
}));

vi.mock('@/hooks/websocket/useSocket', () => ({
  useSocket: () => ({ isConnected: true, socket: mockSocket }),
}));

import { useSocketMessages } from '@/hooks/websocket/useSocketMessages';

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

describe('useSocketMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const k of Object.keys(handlers)) delete handlers[k];
  });

  it('émet joinChannel et attache les listeners', () => {
    const { wrapper } = createWrapper();
    renderHook(() => useSocketMessages('1'), { wrapper });
    expect(mockSocket.emit).toHaveBeenCalledWith('joinChannel', 1);
    expect(handlers.newMessage).toBeDefined();
    expect(handlers.messageUpdated).toBeDefined();
    expect(handlers.messageDeleted).toBeDefined();
    expect(handlers.reactionAdded).toBeDefined();
    expect(handlers.userTyping).toBeDefined();
  });

  it('ajoute un nouveau message dans le cache', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['channel', '1'], {
      pages: [makePage([{ id: 1, content: 'a' }])],
      pageParams: [0],
    });
    renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => handlers.newMessage({ id: 2, content: 'b' }));

    const data: any = queryClient.getQueryData(['channel', '1']);
    expect(data.pages[0].messages).toHaveLength(2);
    expect(data.pages[0].total).toBe(2);
  });

  it('ignore un doublon de message', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['channel', '1'], {
      pages: [makePage([{ id: 1, content: 'a' }])],
      pageParams: [0],
    });
    renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => handlers.newMessage({ id: 1, content: 'a' }));
    const data: any = queryClient.getQueryData(['channel', '1']);
    expect(data.pages[0].messages).toHaveLength(1);
  });

  it('met à jour un message', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['channel', '1'], {
      pages: [makePage([{ id: 1, content: 'a' }])],
      pageParams: [0],
    });
    renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => handlers.messageUpdated({ id: 1, content: 'edit' }));
    const data: any = queryClient.getQueryData(['channel', '1']);
    expect(data.pages[0].messages[0].content).toBe('edit');
  });

  it('supprime un message', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['channel', '1'], {
      pages: [makePage([{ id: 1 }, { id: 2 }])],
      pageParams: [0],
    });
    renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => handlers.messageDeleted({ messageId: 1 }));
    const data: any = queryClient.getQueryData(['channel', '1']);
    expect(data.pages[0].messages).toHaveLength(1);
    expect(data.pages[0].total).toBe(1);
  });

  it('met à jour une réaction', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['channel', '1'], {
      pages: [makePage([{ id: 1, reactions: [] }])],
      pageParams: [0],
    });
    renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => handlers.reactionAdded({ id: 1, reactions: [{ emoji: '🔥' }] }));
    const data: any = queryClient.getQueryData(['channel', '1']);
    expect(data.pages[0].messages[0].reactions).toHaveLength(1);
  });

  it('gère userTyping et le retrait', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => handlers.userTyping({ firstname: 'Alice', isTyping: true }));
    expect(result.current.typingUsers).toContain('Alice');

    act(() => handlers.userTyping({ firstname: 'Alice', isTyping: false }));
    expect(result.current.typingUsers).not.toContain('Alice');
  });

  it('updateMessage met à jour le cache local', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['channel', '1'], {
      pages: [makePage([{ id: 1, content: 'a' }])],
      pageParams: [0],
    });
    const { result } = renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => result.current.updateMessage(1, 'new'));
    const data: any = queryClient.getQueryData(['channel', '1']);
    expect(data.pages[0].messages[0].content).toBe('new');
  });

  it('removeMessage retire le message du cache', () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(['channel', '1'], {
      pages: [makePage([{ id: 1 }, { id: 2 }])],
      pageParams: [0],
    });
    const { result } = renderHook(() => useSocketMessages('1'), { wrapper });

    act(() => result.current.removeMessage(1));
    const data: any = queryClient.getQueryData(['channel', '1']);
    expect(data.pages[0].messages).toHaveLength(1);
  });

  it('addReaction émet addReaction via le socket', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useSocketMessages('5'), { wrapper });

    act(() => result.current.addReaction(10, '🔥'));
    expect(mockSocket.emit).toHaveBeenCalledWith('addReaction', {
      messageId: 10,
      emoji: '🔥',
      channelId: 5,
    });
  });

  it('ne fait rien sans channelId', () => {
    const { wrapper } = createWrapper();
    renderHook(() => useSocketMessages(undefined), { wrapper });
    expect(mockSocket.emit).not.toHaveBeenCalledWith('joinChannel', expect.anything());
  });
});
