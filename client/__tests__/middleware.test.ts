import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/server
const mockRedirect = vi.fn((url: URL) => ({ type: 'redirect', url }));
const mockNext = vi.fn(() => ({ type: 'next' }));

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: (...args: any[]) => mockRedirect(...args),
    next: () => mockNext(),
  },
}));

import { middleware } from '@/middleware';

function createMockRequest(path: string, token?: string): any {
  return {
    nextUrl: { pathname: path },
    cookies: {
      get: (name: string) =>
        token && name === 'auth-token' ? { name, value: token } : undefined,
    },
    url: `http://localhost:3000${path}`,
  };
}

describe('middleware', () => {
  beforeEach(() => {
    mockRedirect.mockClear();
    mockNext.mockClear();
  });

  it('redirects to /login when accessing / without token', async () => {
    await middleware(createMockRequest('/'));
    expect(mockRedirect).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/login',
    }));
  });

  it('redirects to /login when accessing /profil without token', async () => {
    await middleware(createMockRequest('/profil'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('redirects to /login when accessing /servers without token', async () => {
    await middleware(createMockRequest('/servers/1'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('allows authenticated user to access protected routes', async () => {
    await middleware(createMockRequest('/profil', 'valid-token'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('redirects authenticated user away from /login', async () => {
    await middleware(createMockRequest('/login', 'valid-token'));
    expect(mockRedirect).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/(homepage)',
    }));
  });

  it('redirects authenticated user away from /register', async () => {
    await middleware(createMockRequest('/register', 'valid-token'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('allows unauthenticated user to access /login', async () => {
    await middleware(createMockRequest('/login'));
    expect(mockNext).toHaveBeenCalled();
  });

  it('allows unauthenticated user to access /register', async () => {
    await middleware(createMockRequest('/register'));
    expect(mockNext).toHaveBeenCalled();
  });
});
