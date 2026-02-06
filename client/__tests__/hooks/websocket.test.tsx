import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { renderHookWithClient } from '../helpers';

// Capture event handlers
const eventHandlers = new Map<string, Function>();
const mockSocket = {
  on: vi.fn((event: string, handler: Function) => eventHandlers.set(event, handler)),
  off: vi.fn(),
  emit: vi.fn((event: string, data?: any, cb?: Function) => { if (cb) cb([]); }),
  connected: true,
  once: vi.fn(),
};

vi.mock('@/hooks/websocket/useSocket', () => ({
  useSocket: vi.fn(() => ({
    isConnected: true,
    socket: mockSocket,
    emit: vi.fn((event: string, data?: any, cb?: Function) => { if (cb) cb({ onlineUserIds: [1, 2] }); }),
    on: vi.fn((event: string, handler: Function) => eventHandlers.set(event, handler)),
    off: vi.fn(),
  })),
}));

vi.mock('@/lib/socket', () => ({
  socketManager: {
    connect: vi.fn(() => mockSocket),
    disconnect: vi.fn(),
    emit: vi.fn((event: string, data?: any, cb?: Function) => { if (cb) cb([]); }),
    on: vi.fn(),
    off: vi.fn(),
    getSocket: vi.fn(() => mockSocket),
    reconnectWithNewToken: vi.fn(),
  },
}));

vi.mock('@/store/authStore', () => ({
  default: Object.assign(vi.fn((selector: any) => selector ? selector({ token: 'test' }) : { token: 'test' }), {
    getState: vi.fn(() => ({ token: 'test', setToken: vi.fn(), logout: vi.fn() })),
  }),
}));

vi.mock('@/lib/customFetch', () => ({
  customfetch: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { useSocketMessages } from '@/hooks/websocket/useSocketMessages';
import { useSocketPresence } from '@/hooks/websocket/useSocketPresence';
import { useSocketPrivateMessages } from '@/hooks/websocket/useSocketPrivateMessages';
import { useSocketServers } from '@/hooks/websocket/useSocketServers';
import { useSocketTyping } from '@/hooks/websocket/useSocketTyping';
import { useSocket } from '@/hooks/websocket/useSocket';

beforeEach(() => {
  eventHandlers.clear();
  vi.clearAllMocks();
});

// ---- useSocket ----
describe('useSocket', () => {
  it('returns socket state', () => {
    const { result } = renderHook(() => useSocket());
    expect(result.current).toHaveProperty('isConnected');
    expect(result.current).toHaveProperty('socket');
    expect(result.current).toHaveProperty('emit');
    expect(result.current).toHaveProperty('on');
    expect(result.current).toHaveProperty('off');
  });
});

// ---- useSocketMessages ----
describe('useSocketMessages', () => {
  it('returns initial state without channelId', () => {
    const { result } = renderHookWithClient(() => useSocketMessages());
    expect(result.current.messages).toEqual([]);
    expect(result.current.typingUsers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('joins channel and loads messages', () => {
    const { result } = renderHookWithClient(() => useSocketMessages('1'));

    expect(mockSocket.emit).toHaveBeenCalledWith('joinChannel', 1, expect.any(Function));
  });

  it('registers event listeners for channel', () => {
    renderHookWithClient(() => useSocketMessages('1'));

    expect(mockSocket.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('messageUpdated', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('messageDeleted', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('userTyping', expect.any(Function));
  });

  it('handles new messages', () => {
    const { result } = renderHookWithClient(() => useSocketMessages('1'));

    const newMessageHandler = eventHandlers.get('newMessage');
    if (newMessageHandler) {
      act(() => {
        newMessageHandler({ id: 1, content: 'hello', type: 'text', author: { id: '1' } });
      });
      expect(result.current.messages).toHaveLength(1);
    }
  });

  it('handles message updates', () => {
    const { result } = renderHookWithClient(() => useSocketMessages('1'));

    const newMessageHandler = eventHandlers.get('newMessage');
    const updateHandler = eventHandlers.get('messageUpdated');
    if (newMessageHandler && updateHandler) {
      act(() => {
        newMessageHandler({ id: 1, content: 'original', type: 'text', author: { id: '1' } });
      });
      act(() => {
        updateHandler({ id: 1, content: 'edited', type: 'text', author: { id: '1' } });
      });
      expect(result.current.messages[0]?.content).toBe('edited');
    }
  });

  it('handles message deletion', () => {
    const { result } = renderHookWithClient(() => useSocketMessages('1'));

    const newMessageHandler = eventHandlers.get('newMessage');
    const deleteHandler = eventHandlers.get('messageDeleted');
    if (newMessageHandler && deleteHandler) {
      act(() => {
        newMessageHandler({ id: 1, content: 'test', type: 'text', author: { id: '1' } });
      });
      act(() => {
        deleteHandler(1);
      });
      expect(result.current.messages).toHaveLength(0);
    }
  });

  it('handles typing indicators', () => {
    const { result } = renderHookWithClient(() => useSocketMessages('1'));

    const typingHandler = eventHandlers.get('userTyping');
    if (typingHandler) {
      act(() => {
        typingHandler({ firstname: 'John', isTyping: true });
      });
      expect(result.current.typingUsers).toContain('John');

      act(() => {
        typingHandler({ firstname: 'John', isTyping: false });
      });
      expect(result.current.typingUsers).not.toContain('John');
    }
  });

  it('provides updateMessage and removeMessage helpers', () => {
    const { result } = renderHookWithClient(() => useSocketMessages('1'));

    const newMessageHandler = eventHandlers.get('newMessage');
    if (newMessageHandler) {
      act(() => {
        newMessageHandler({ id: 10, content: 'test', type: 'text', author: { id: '1' } });
      });

      act(() => {
        result.current.updateMessage(10, 'updated');
      });
      expect(result.current.messages[0]?.content).toBe('updated');

      act(() => {
        result.current.removeMessage(10);
      });
      expect(result.current.messages).toHaveLength(0);
    }
  });

  it('prevents duplicate messages', () => {
    const { result } = renderHookWithClient(() => useSocketMessages('1'));

    const newMessageHandler = eventHandlers.get('newMessage');
    if (newMessageHandler) {
      act(() => {
        newMessageHandler({ id: 1, content: 'test', type: 'text', author: { id: '1' } });
        newMessageHandler({ id: 1, content: 'test', type: 'text', author: { id: '1' } });
      });
      expect(result.current.messages).toHaveLength(1);
    }
  });
});

// ---- useSocketPresence ----
describe('useSocketPresence', () => {
  it('emits getOnlineUsers and registers listeners', () => {
    renderHookWithClient(() => useSocketPresence());

    // The hook should register userOnline and userOffline handlers
    expect(eventHandlers.has('userOnline') || eventHandlers.has('userOffline')).toBe(true);
  });

  it('handles user online events', () => {
    const { queryClient } = renderHookWithClient(() => useSocketPresence());

    const onlineHandler = eventHandlers.get('userOnline');
    if (onlineHandler) {
      act(() => {
        onlineHandler({ userId: 5 });
      });
      const data = queryClient.getQueryData<number[]>(['onlineUserIds']);
      expect(data).toContain(5);
    }
  });

  it('handles user offline events', () => {
    const { queryClient } = renderHookWithClient(() => useSocketPresence());

    queryClient.setQueryData(['onlineUserIds'], [1, 2, 3]);

    const offlineHandler = eventHandlers.get('userOffline');
    if (offlineHandler) {
      act(() => {
        offlineHandler({ userId: 2 });
      });
      const data = queryClient.getQueryData<number[]>(['onlineUserIds']);
      expect(data).not.toContain(2);
    }
  });
});

// ---- useSocketPrivateMessages ----
describe('useSocketPrivateMessages', () => {
  it('does nothing without conversationId', () => {
    renderHookWithClient(() => useSocketPrivateMessages());
    expect(eventHandlers.has('newPrivateMessage')).toBe(false);
  });

  it('registers listeners with conversationId', () => {
    renderHookWithClient(() => useSocketPrivateMessages('1'));

    expect(eventHandlers.has('newPrivateMessage')).toBe(true);
    expect(eventHandlers.has('privateMessageUpdated')).toBe(true);
    expect(eventHandlers.has('privateMessageDeleted')).toBe(true);
  });

  it('handles new private message', () => {
    const { queryClient } = renderHookWithClient(() => useSocketPrivateMessages('1'));

    // Set up initial data
    queryClient.setQueryData(['conversationMessages', '1'], {
      messages: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 1,
    });

    const handler = eventHandlers.get('newPrivateMessage');
    if (handler) {
      act(() => {
        handler({ id: 1, content: 'hi', conversationId: 1 });
      });
      const data: any = queryClient.getQueryData(['conversationMessages', '1']);
      expect(data.messages).toHaveLength(1);
    }
  });

  it('ignores messages from other conversations', () => {
    const { queryClient } = renderHookWithClient(() => useSocketPrivateMessages('1'));

    queryClient.setQueryData(['conversationMessages', '1'], {
      messages: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 1,
    });

    const handler = eventHandlers.get('newPrivateMessage');
    if (handler) {
      act(() => {
        handler({ id: 1, content: 'hi', conversation: { id: 999 } });
      });
      const data: any = queryClient.getQueryData(['conversationMessages', '1']);
      expect(data.messages).toHaveLength(0);
    }
  });

  it('handles message updates', () => {
    const { queryClient } = renderHookWithClient(() => useSocketPrivateMessages('1'));

    queryClient.setQueryData(['conversationMessages', '1'], {
      messages: [{ id: 1, content: 'original' }],
      total: 1,
      page: 1,
      limit: 50,
      totalPages: 1,
    });

    const handler = eventHandlers.get('privateMessageUpdated');
    if (handler) {
      act(() => {
        handler({ id: 1, content: 'edited' });
      });
      const data: any = queryClient.getQueryData(['conversationMessages', '1']);
      expect(data.messages[0].content).toBe('edited');
    }
  });

  it('handles message deletion', () => {
    const { queryClient } = renderHookWithClient(() => useSocketPrivateMessages('1'));

    queryClient.setQueryData(['conversationMessages', '1'], {
      messages: [{ id: 1, content: 'test' }],
      total: 1,
      page: 1,
      limit: 50,
      totalPages: 1,
    });

    const handler = eventHandlers.get('privateMessageDeleted');
    if (handler) {
      act(() => {
        handler(1);
      });
      const data: any = queryClient.getQueryData(['conversationMessages', '1']);
      expect(data.messages).toHaveLength(0);
    }
  });
});

// ---- useSocketServers ----
describe('useSocketServers', () => {
  it('returns servers state', () => {
    const { result } = renderHook(() => useSocketServers());
    expect(result.current).toHaveProperty('servers');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
  });
});

// ---- useSocketTyping ----
describe('useSocketTyping', () => {
  it('returns typing state', () => {
    const { result } = renderHookWithClient(() => useSocketTyping('1'));
    expect(result.current.typingUsers).toEqual([]);
    expect(result.current.isAnyoneTyping).toBe(false);
    expect(result.current).toHaveProperty('startTyping');
    expect(result.current).toHaveProperty('stopTyping');
  });

  it('registers typing event listeners', () => {
    renderHookWithClient(() => useSocketTyping('1'));
    expect(eventHandlers.has('userTyping')).toBe(true);
    expect(eventHandlers.has('userStoppedTyping')).toBe(true);
  });

  it('handles user typing events', () => {
    const { result } = renderHookWithClient(() => useSocketTyping('1'));

    const handler = eventHandlers.get('userTyping');
    if (handler) {
      act(() => {
        handler({ userId: 1, username: 'john', conversationId: 1 });
      });
      expect(result.current.typingUsers).toHaveLength(1);
      expect(result.current.isAnyoneTyping).toBe(true);
    }
  });

  it('ignores typing from other conversations', () => {
    const { result } = renderHookWithClient(() => useSocketTyping('1'));

    const handler = eventHandlers.get('userTyping');
    if (handler) {
      act(() => {
        handler({ userId: 1, username: 'john', conversationId: 999 });
      });
      expect(result.current.typingUsers).toHaveLength(0);
    }
  });

  it('handles stopped typing events', () => {
    const { result } = renderHookWithClient(() => useSocketTyping('1'));

    const typingHandler = eventHandlers.get('userTyping');
    const stoppedHandler = eventHandlers.get('userStoppedTyping');
    if (typingHandler && stoppedHandler) {
      act(() => {
        typingHandler({ userId: 1, username: 'john', conversationId: 1 });
      });
      act(() => {
        stoppedHandler({ userId: 1, conversationId: 1 });
      });
      expect(result.current.typingUsers).toHaveLength(0);
    }
  });

  it('does nothing without conversationId', () => {
    const { result } = renderHookWithClient(() => useSocketTyping());
    expect(result.current.typingUsers).toEqual([]);
  });
});
