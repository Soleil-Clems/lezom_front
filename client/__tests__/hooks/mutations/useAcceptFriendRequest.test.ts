import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useAcceptFriendRequest } from '@/hooks/mutations/useAcceptFriendRequest';

vi.mock('@/requests/friendRequest', () => ({
  acceptFriendRequestRequest: vi.fn(),
  declineFriendRequestRequest: vi.fn(),
  removeFriendRequest: vi.fn(),
  sendFriendRequestRequest: vi.fn(),
  getFriendsRequest: vi.fn(),
  getPendingRequestsRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useAcceptFriendRequest', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useAcceptFriendRequest());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
