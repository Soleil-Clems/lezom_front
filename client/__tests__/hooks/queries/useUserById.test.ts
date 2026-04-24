import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const getUserByIdRequest = vi.fn();
vi.mock('@/requests/userRequest', () => ({
  getUserByIdRequest: (id: number) => getUserByIdRequest(id),
}));

import { useUserById } from '@/hooks/queries/useUserById';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, {
    client: new QueryClient({
      defaultOptions: { queries: { retry: false } },
    }),
    children,
  });

describe('useUserById', () => {
  it('enabled=false si userId <= 0', () => {
    const { result } = renderHook(() => useUserById(0), { wrapper });
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetch quand userId > 0', async () => {
    getUserByIdRequest.mockResolvedValue({ id: 5 });
    const { result } = renderHook(() => useUserById(5), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 5 });
    expect(getUserByIdRequest).toHaveBeenCalledWith(5);
  });
});
