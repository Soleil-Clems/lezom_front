import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useSearchUsers } from '@/hooks/queries/useSearchUsers';

vi.mock('@/requests/friendRequest', () => ({
  searchUsersRequest: vi.fn().mockResolvedValue([]),
  getFriendsRequest: vi.fn(),
  getPendingRequestsRequest: vi.fn(),
}));

describe('useSearchUsers', () => {
  it('est désactivé si query < 2 caractères', () => {
    const { result } = renderHookWithQuery(() => useSearchUsers('a'));
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('est activé si query >= 2 caractères', () => {
    const { result } = renderHookWithQuery(() => useSearchUsers('al'));
    expect(result.current).toHaveProperty('data');
  });
});
