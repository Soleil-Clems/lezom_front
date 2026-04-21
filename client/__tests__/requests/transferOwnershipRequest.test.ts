import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transferOwnershipRequest } from '@/requests/transferOwnershipRequest';

vi.mock('@/lib/customFetch', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import customfetch from '@/lib/customFetch';

describe('transferOwnershipRequest', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle POST servers/:id/transfer-ownership', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({});
    await transferOwnershipRequest(1, 2);
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/transfer-ownership', {
      newOwnerId: 2,
    });
  });
});
