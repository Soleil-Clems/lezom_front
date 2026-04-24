import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const handlers: Record<string, (...args: any[]) => void> = {};
const emit = vi.fn();
const on = vi.fn((event: string, cb: any) => {
  handlers[event] = cb;
});
const off = vi.fn();

vi.mock('@/hooks/websocket/useSocket', () => ({
  useSocket: () => ({ isConnected: true, emit, on, off }),
}));

import { useSocketTyping } from '@/hooks/websocket/useSocketTyping';

describe('useSocketTyping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    for (const k of Object.keys(handlers)) delete handlers[k];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('attache les listeners userTyping / userStoppedTyping', () => {
    renderHook(() => useSocketTyping('1'));
    expect(handlers.userTyping).toBeDefined();
    expect(handlers.userStoppedTyping).toBeDefined();
  });

  it('ajoute un user qui tape', () => {
    const { result } = renderHook(() => useSocketTyping('1'));
    act(() => handlers.userTyping({ userId: 10, username: 'Bob', conversationId: 1 }));
    expect(result.current.typingUsers).toHaveLength(1);
    expect(result.current.isAnyoneTyping).toBe(true);
  });

  it('ignore un user de conversation différente', () => {
    const { result } = renderHook(() => useSocketTyping('1'));
    act(() => handlers.userTyping({ userId: 10, username: 'Bob', conversationId: 99 }));
    expect(result.current.typingUsers).toHaveLength(0);
  });

  it('ignore un doublon', () => {
    const { result } = renderHook(() => useSocketTyping('1'));
    act(() => handlers.userTyping({ userId: 10, username: 'Bob', conversationId: 1 }));
    act(() => handlers.userTyping({ userId: 10, username: 'Bob', conversationId: 1 }));
    expect(result.current.typingUsers).toHaveLength(1);
  });

  it('retire un user quand il arrête de taper', () => {
    const { result } = renderHook(() => useSocketTyping('1'));
    act(() => handlers.userTyping({ userId: 10, username: 'Bob', conversationId: 1 }));
    act(() => handlers.userStoppedTyping({ userId: 10, conversationId: 1 }));
    expect(result.current.typingUsers).toHaveLength(0);
  });

  it('ignore userStoppedTyping de conversation différente', () => {
    const { result } = renderHook(() => useSocketTyping('1'));
    act(() => handlers.userTyping({ userId: 10, username: 'Bob', conversationId: 1 }));
    act(() => handlers.userStoppedTyping({ userId: 10, conversationId: 99 }));
    expect(result.current.typingUsers).toHaveLength(1);
  });

  it('startTyping émet typing et déclenche stopTyping après 3s', () => {
    const { result } = renderHook(() => useSocketTyping('5'));
    act(() => result.current.startTyping());
    expect(emit).toHaveBeenCalledWith('typing', { conversationId: 5 });

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(emit).toHaveBeenCalledWith('stopTyping', { conversationId: 5 });
  });

  it('startTyping ne ré-émet pas si déjà en train de taper', () => {
    const { result } = renderHook(() => useSocketTyping('5'));
    act(() => result.current.startTyping());
    act(() => result.current.startTyping());
    const typingCalls = emit.mock.calls.filter((c) => c[0] === 'typing');
    expect(typingCalls).toHaveLength(1);
  });

  it('stopTyping n émet rien si pas en train de taper', () => {
    const { result } = renderHook(() => useSocketTyping('5'));
    act(() => result.current.stopTyping());
    const stopCalls = emit.mock.calls.filter((c) => c[0] === 'stopTyping');
    expect(stopCalls).toHaveLength(0);
  });

  it('startTyping ne fait rien sans conversationId', () => {
    const { result } = renderHook(() => useSocketTyping(undefined));
    act(() => result.current.startTyping());
    expect(emit).not.toHaveBeenCalled();
  });
});
