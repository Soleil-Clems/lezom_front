import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSetToken, mockReconnect } = vi.hoisted(() => ({
  mockSetToken: vi.fn(),
  mockReconnect: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  default: {
    getState: vi.fn(() => ({
      token: 'old-token',
      setToken: mockSetToken,
      logout: vi.fn(),
    })),
  },
}));

vi.mock('@/lib/socket', () => ({
  socketManager: {
    reconnectWithNewToken: mockReconnect,
  },
}));

import { refreshAccessToken } from '@/lib/tokenRefresh';

describe('refreshAccessToken', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    mockSetToken.mockClear();
    mockReconnect.mockClear();
  });

  it('returns new token on success', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: 'new-token' }),
    } as Response);

    const token = await refreshAccessToken();

    expect(token).toBe('new-token');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });

  it('updates auth store and reconnects socket on success', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: 'new-token' }),
    } as Response);

    await refreshAccessToken();

    expect(mockSetToken).toHaveBeenCalledWith('new-token');
    expect(mockReconnect).toHaveBeenCalled();
  });

  it('returns null on failed refresh', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    } as Response);

    const token = await refreshAccessToken();
    expect(token).toBeNull();
  });

  it('returns null on network error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const token = await refreshAccessToken();
    expect(token).toBeNull();
  });

  it('returns null when no access_token in response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    const token = await refreshAccessToken();
    expect(token).toBeNull();
  });
});
