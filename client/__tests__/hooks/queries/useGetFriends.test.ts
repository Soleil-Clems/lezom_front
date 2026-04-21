import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useGetFriends } from '@/hooks/queries/useGetFriends';

vi.mock('@/requests/friendRequest', () => ({
  getFriendsRequest: vi.fn(),
}));

import { getFriendsRequest } from '@/requests/friendRequest';

describe('useGetFriends', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle getFriendsRequest', async () => {
    vi.mocked(getFriendsRequest).mockResolvedValue([]);
    const { result } = renderHookWithQuery(() => useGetFriends());
    expect(result.current).toBeDefined();
  });
});
