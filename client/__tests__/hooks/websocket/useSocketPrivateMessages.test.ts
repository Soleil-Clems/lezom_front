import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('@/lib/socket', () => ({
  socketManager: {
    connect: vi.fn(() => ({
      connected: true,
      on: vi.fn(),
      off: vi.fn(),
      once: vi.fn(),
      emit: vi.fn(),
    })),
    getSocket: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

import { useSocketPrivateMessages } from '@/hooks/websocket/useSocketPrivateMessages';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, {
    client: new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    children,
  });

describe('useSocketPrivateMessages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('est défini avec un conversationId', () => {
    const { result } = renderHook(() => useSocketPrivateMessages('1'), { wrapper });
    expect(result.current).toBeDefined();
  });
});
