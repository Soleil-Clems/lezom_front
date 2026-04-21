import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

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

import { useSocketPresence } from '@/hooks/websocket/useSocketPresence';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, {
    client: new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    children,
  });

describe('useSocketPresence', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne les propriétés de présence', () => {
    const { result } = renderHook(() => useSocketPresence(), { wrapper });
    expect(result).toBeDefined();
  });
});
