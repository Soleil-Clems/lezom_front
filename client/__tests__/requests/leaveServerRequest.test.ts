import { describe, it, expect, vi, beforeEach } from 'vitest';
import { leaveServerRequest } from '@/requests/leaveServerRequest';

vi.mock('@/lib/customFetch', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import customfetch from '@/lib/customFetch';

describe('leaveServerRequest', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle POST servers/:id/leave sans newOwnerId', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({});
    await leaveServerRequest(1);
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/leave', {});
  });

  it('appelle POST servers/:id/leave avec newOwnerId', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({});
    await leaveServerRequest(1, 5);
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/leave', { newOwnerId: 5 });
  });
});
