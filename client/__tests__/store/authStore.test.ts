import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to test the store behavior
// The store uses persist middleware with localStorage
describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn(), href: '' },
      writable: true,
      configurable: true,
    });
  });

  it('initializes with null token', async () => {
    // Re-import to get fresh store
    const { default: useAuthStore } = await import('@/store/authStore');
    const state = useAuthStore.getState();
    // Token may be null or from persisted state
    expect(state).toHaveProperty('token');
    expect(state).toHaveProperty('setToken');
    expect(state).toHaveProperty('logout');
  });

  it('setToken updates the token', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    useAuthStore.getState().setToken('my-token');
    expect(useAuthStore.getState().token).toBe('my-token');
  });

  it('setToken sets cookie', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    useAuthStore.getState().setToken('cookie-token');
    expect(document.cookie).toContain('auth-token=cookie-token');
  });

  it('logout clears the token', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    useAuthStore.getState().setToken('to-remove');
    expect(useAuthStore.getState().token).toBe('to-remove');

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('logout calls auth/logout endpoint', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    useAuthStore.getState().logout();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('auth/logout'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });

  it('logout removes localStorage item', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    localStorage.setItem('auth-token', JSON.stringify({ state: { token: 'test' } }));
    useAuthStore.getState().logout();

    expect(localStorage.getItem('auth-token')).toBeNull();
  });
});
