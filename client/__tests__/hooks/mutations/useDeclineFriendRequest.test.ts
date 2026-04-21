import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useDeclineFriendRequest } from '@/hooks/mutations/useDeclineFriendRequest';

vi.mock('@/requests/friendRequest', () => ({
  acceptFriendRequestRequest: vi.fn(),
  declineFriendRequestRequest: vi.fn(),
  removeFriendRequest: vi.fn(),
  sendFriendRequestRequest: vi.fn(),
  getFriendsRequest: vi.fn(),
  getPendingRequestsRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useDeclineFriendRequest', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useDeclineFriendRequest());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
