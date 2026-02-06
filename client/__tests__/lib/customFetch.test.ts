import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockLogout = vi.fn();

vi.mock('@/store/authStore', () => ({
  default: {
    getState: vi.fn(() => ({
      token: 'test-token',
      setToken: vi.fn(),
      logout: mockLogout,
    })),
  },
}));

vi.mock('@/lib/tokenRefresh', () => ({
  refreshAccessToken: vi.fn(),
}));

import { customfetch } from '@/lib/customFetch';
import { refreshAccessToken } from '@/lib/tokenRefresh';

describe('CustomFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    mockLogout.mockClear();
    vi.mocked(refreshAccessToken).mockClear();
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    });
  });

  const mockSuccessResponse = (data: any) => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
    } as Response);
  };

  const mockErrorResponse = (status: number, message: string) => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status,
      json: () => Promise.resolve({ message }),
    } as Response);
  };

  describe('GET', () => {
    it('makes a GET request with auth token', async () => {
      mockSuccessResponse({ data: 'test' });
      const result = await customfetch.get('users/me');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('users/me'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('POST', () => {
    it('makes a POST request with body', async () => {
      mockSuccessResponse({ id: 1 });
      const result = await customfetch.post('servers', { name: 'Test' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('servers'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
        })
      );
      expect(result).toEqual({ id: 1 });
    });

    it('handles FormData without Content-Type', async () => {
      mockSuccessResponse({ success: true });
      const formData = new FormData();
      formData.append('file', 'test');

      await customfetch.post('upload', formData);

      const callArgs = vi.mocked(fetch).mock.calls[0];
      const headers = (callArgs[1] as any).headers;
      expect(headers).not.toHaveProperty('Content-Type');
    });
  });

  describe('PUT', () => {
    it('makes a PUT request', async () => {
      mockSuccessResponse({ updated: true });
      await customfetch.put('servers/1', { name: 'Updated' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('servers/1'),
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('PATCH', () => {
    it('makes a PATCH request', async () => {
      mockSuccessResponse({ updated: true });
      await customfetch.patch('users/1', { username: 'new' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('users/1'),
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  describe('DELETE', () => {
    it('makes a DELETE request', async () => {
      mockSuccessResponse({ deleted: true });
      await customfetch.delete('servers/1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('servers/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('error handling', () => {
    it('throws on non-OK response', async () => {
      mockErrorResponse(400, 'Bad Request');
      await expect(customfetch.get('bad-endpoint')).rejects.toThrow('Bad Request');
    });

    it('attempts token refresh on 401', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) } as Response)
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ data: 'refreshed' }) } as Response);

      vi.mocked(refreshAccessToken).mockResolvedValue('new-token');

      const result = await customfetch.get('protected');
      expect(refreshAccessToken).toHaveBeenCalled();
      expect(result).toEqual({ data: 'refreshed' });
    });

    it('calls logout on failed refresh', async () => {
      vi.mocked(fetch).mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) } as Response);
      vi.mocked(refreshAccessToken).mockResolvedValue(null);

      await expect(customfetch.get('protected')).rejects.toThrow('Session expirée');
      expect(mockLogout).toHaveBeenCalled();
    });

    it('skips refresh for auth endpoints', async () => {
      vi.mocked(fetch).mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) } as Response);

      await expect(customfetch.post('auth/login', {})).rejects.toThrow('Session expirée');
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
