import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useGetPendingRequests } from '@/hooks/queries/useGetPendingRequests';

vi.mock('@/requests/friendRequest', () => ({
  getPendingRequestsRequest: vi.fn(),
}));

import { getPendingRequestsRequest } from '@/requests/friendRequest';

describe('useGetPendingRequests', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne un objet query', () => {
    vi.mocked(getPendingRequestsRequest).mockResolvedValue([]);
    const { result } = renderHookWithQuery(() => useGetPendingRequests());
    expect(result.current).toHaveProperty('data');
  });
});
