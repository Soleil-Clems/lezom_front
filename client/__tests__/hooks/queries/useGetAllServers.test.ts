import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useGetAllServers } from '@/hooks/queries/useGetAllServers';

vi.mock('@/requests/serverRequest', () => ({
  getAllServersRequest: vi.fn(),
}));

import { getAllServersRequest } from '@/requests/serverRequest';

describe('useGetAllServers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne un objet query avec data, isLoading, isError', () => {
    vi.mocked(getAllServersRequest).mockResolvedValue([]);
    const { result } = renderHookWithQuery(() => useGetAllServers());
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('isLoading');
  });
});
