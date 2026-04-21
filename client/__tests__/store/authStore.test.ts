import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('zustand/middleware', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    persist: (fn: any) => fn,
    createJSONStorage: () => ({}),
  };
});

global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

import useAuthStore from '@/store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('setToken et logout sont des fonctions', () => {
    const state = useAuthStore.getState();
    expect(typeof state.setToken).toBe('function');
    expect(typeof state.logout).toBe('function');
  });

  it('setToken met à jour le token', () => {
    useAuthStore.getState().setToken('my-token');
    expect(useAuthStore.getState().token).toBe('my-token');
  });

  it('logout remet le token à null', () => {
    useAuthStore.getState().setToken('existing-token');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('logout appelle fetch pour déconnecter', () => {
    useAuthStore.getState().logout();
    expect(global.fetch).toHaveBeenCalled();
  });
});
