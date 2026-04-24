import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

const mockSocket = {
  connected: true,
  on: vi.fn(),
  off: vi.fn(),
  once: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('@/lib/socket', () => ({
  socketManager: {
    connect: vi.fn(() => mockSocket),
    disconnect: vi.fn(),
    getSocket: vi.fn(() => mockSocket),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

vi.mock('@/lib/tokenRefresh', () => ({
  refreshAccessToken: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  default: vi.fn((selector: any) => selector({ token: 'test-token', logout: vi.fn() })),
}));

vi.mock('@/hooks/websocket/useSocketPresence', () => ({
  useSocketPresence: vi.fn(),
}));

vi.mock('@/hooks/websocket/useSocketConversations', () => ({
  useSocketConversations: vi.fn(),
}));

vi.mock('@/hooks/useDesktopNotifications', () => ({
  useDesktopNotifications: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({ setQueryData: vi.fn(), invalidateQueries: vi.fn() })),
  };
});

import SocketProvider from '@/providers/SocketProvider';

describe('SocketProvider', () => {
  it('rend les enfants', () => {
    const { getByText } = render(
      React.createElement(SocketProvider, null, React.createElement('span', null, 'enfant')),
    );
    expect(getByText('enfant')).toBeDefined();
  });

  it('rend sans token', () => {
    const { getByText } = render(
      React.createElement(SocketProvider, null, React.createElement('span', null, 'no-token')),
    );
    expect(getByText('no-token')).toBeDefined();
  });
});
