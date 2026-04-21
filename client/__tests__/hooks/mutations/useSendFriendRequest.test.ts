import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useSendFriendRequest } from '@/hooks/mutations/useSendFriendRequest';

vi.mock('@/requests/friendRequest', () => ({
  sendFriendRequestRequest: vi.fn(),
  removeFriendRequest: vi.fn(),
  acceptFriendRequestRequest: vi.fn(),
  declineFriendRequestRequest: vi.fn(),
  getFriendsRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useSendFriendRequest', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useSendFriendRequest());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
