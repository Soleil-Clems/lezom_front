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
    emit: vi.fn((_event: string, _data: unknown, cb?: (r: unknown) => void) => {
      if (cb) cb([{ id: 1, name: 'Server' }]);
    }),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

import { useSocketServers } from '@/hooks/websocket/useSocketServers';

describe('useSocketServers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne servers, loading, error', () => {
    const { result } = renderHook(() => useSocketServers());
    expect(result.current).toHaveProperty('servers');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
  });
});
