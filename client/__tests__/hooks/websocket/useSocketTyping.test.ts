import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockSocket = {
  connected: true,
  on: vi.fn(),
  off: vi.fn(),
  once: vi.fn(),
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

import { useSocketTyping } from '@/hooks/websocket/useSocketTyping';

describe('useSocketTyping', () => {
  beforeEach(() => vi.clearAllMocks());

  it('est défini avec un channelId', () => {
    const { result } = renderHook(() => useSocketTyping('1'));
    expect(result.current).toBeDefined();
  });
});
