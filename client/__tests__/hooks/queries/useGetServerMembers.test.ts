import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useGetServerMembers } from '@/hooks/queries/useGetServerMembers';

vi.mock('@/requests/serverRequest', () => ({
  getServerMembersRequest: vi.fn().mockResolvedValue({ data: [], meta: {} }),
  getAllServersRequest: vi.fn(),
  getAllChannelsOfAServerRequest: vi.fn(),
}));

describe('useGetServerMembers', () => {
  it('est désactivé si serverId est falsy', () => {
    const { result } = renderHookWithQuery(() => useGetServerMembers(''));
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('est activé si serverId est fourni', () => {
    const { result } = renderHookWithQuery(() => useGetServerMembers(1));
    expect(result.current).toHaveProperty('data');
  });
});
