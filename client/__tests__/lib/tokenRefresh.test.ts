import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/store/authStore', () => ({
  default: {
    getState: vi.fn(() => ({
      token: null,
      setToken: vi.fn(),
      logout: vi.fn(),
    })),
  },
}));

vi.mock('@/lib/socket', () => ({
  socketManager: {
    reconnectWithNewToken: vi.fn(),
    getSocket: vi.fn(),
    emit: vi.fn(),
  },
}));

global.fetch = vi.fn();

import { refreshAccessToken } from '@/lib/tokenRefresh';
import useAuthStore from '@/store/authStore';

describe('refreshAccessToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const setToken = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: null,
      setToken,
      logout: vi.fn(),
    } as any);
  });

  it('retourne null si la réponse est ko', async () => {
    vi.mocked(global.fetch).mockResolvedValue({ ok: false } as any);
    const result = await refreshAccessToken();
    expect(result).toBeNull();
  });

  it('retourne null si fetch échoue', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));
    const result = await refreshAccessToken();
    expect(result).toBeNull();
  });

  it('retourne le nouveau token et appelle setToken', async () => {
    const setToken = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      token: null,
      setToken,
      logout: vi.fn(),
    } as any);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'new-token' }),
    } as any);

    const result = await refreshAccessToken();
    expect(result).toBe('new-token');
    expect(setToken).toHaveBeenCalledWith('new-token');
  });

  it('retourne null si pas de access_token dans la réponse', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as any);
    const result = await refreshAccessToken();
    expect(result).toBeNull();
  });
});
