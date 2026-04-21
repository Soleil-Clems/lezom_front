import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useGetAllChannelsOfAServer } from '@/hooks/queries/useGetAllChannelsOfAServer';

vi.mock('@/requests/serverRequest', () => ({
  getAllChannelsOfAServerRequest: vi.fn().mockResolvedValue([]),
  getAllServersRequest: vi.fn(),
  serverRequest: vi.fn(),
}));

describe('useGetAllChannelsOfAServer', () => {
  it('retourne un objet query', () => {
    const { result } = renderHookWithQuery(() => useGetAllChannelsOfAServer('1'));
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('isLoading');
  });
});
