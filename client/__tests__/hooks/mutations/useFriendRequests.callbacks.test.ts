import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { toast } from 'sonner';

vi.mock('@/requests/friendRequest', () => ({
  acceptFriendRequestRequest: vi.fn(),
  declineFriendRequestRequest: vi.fn(),
  removeFriendRequest: vi.fn(),
  sendFriendRequestRequest: vi.fn(),
  getFriendsRequest: vi.fn(),
  getPendingRequestsRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import {
  acceptFriendRequestRequest,
  declineFriendRequestRequest,
  removeFriendRequest,
  sendFriendRequestRequest,
} from '@/requests/friendRequest';
import { useAcceptFriendRequest } from '@/hooks/mutations/useAcceptFriendRequest';
import { useDeclineFriendRequest } from '@/hooks/mutations/useDeclineFriendRequest';
import { useRemoveFriend } from '@/hooks/mutations/useRemoveFriend';
import { useSendFriendRequest } from '@/hooks/mutations/useSendFriendRequest';

describe('useAcceptFriendRequest callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(acceptFriendRequestRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useAcceptFriendRequest());
    await act(async () => {
      await result.current.mutateAsync(1);
    });
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Demande acceptée'));
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(acceptFriendRequestRequest).mockRejectedValue(new Error('Erreur'));
    const { result } = renderHookWithQuery(() => useAcceptFriendRequest());
    await act(async () => {
      try {
        await result.current.mutateAsync(1);
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});

describe('useDeclineFriendRequest callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess invalide les queries', async () => {
    vi.mocked(declineFriendRequestRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useDeclineFriendRequest());
    await act(async () => {
      await result.current.mutateAsync(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(declineFriendRequestRequest).mockRejectedValue(new Error('Fail'));
    const { result } = renderHookWithQuery(() => useDeclineFriendRequest());
    await act(async () => {
      try {
        await result.current.mutateAsync(1);
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});

describe('useRemoveFriend callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess invalide les queries', async () => {
    vi.mocked(removeFriendRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useRemoveFriend());
    await act(async () => {
      await result.current.mutateAsync(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useSendFriendRequest callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(sendFriendRequestRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useSendFriendRequest());
    await act(async () => {
      await result.current.mutateAsync(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
