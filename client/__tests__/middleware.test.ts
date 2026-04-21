import { describe, it, expect, vi } from 'vitest';
import { middleware } from '@/middleware';

const makeRequest = (path: string, token?: string) => ({
  nextUrl: { pathname: path },
  cookies: {
    get: (key: string) => (token && key === 'auth-token' ? { value: token } : undefined),
  },
  url: `http://localhost${path}`,
});

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url: URL) => ({ type: 'redirect', url: url.toString() })),
    next: vi.fn(() => ({ type: 'next' })),
  },
}));

import { NextResponse } from 'next/server';

describe('middleware', () => {
  it('redirige vers /login si pas de token et route protégée', async () => {
    const req = makeRequest('/');
    await middleware(req as any);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: expect.stringContaining('/login') }),
    );
  });

  it('redirige vers / si token présent et route publique', async () => {
    const req = makeRequest('/login', 'valid-token');
    await middleware(req as any);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: expect.stringContaining('/') }),
    );
  });

  it('laisse passer si pas de token et route publique', async () => {
    const req = makeRequest('/login');
    await middleware(req as any);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('laisse passer si token présent et route protégée', async () => {
    const req = makeRequest('/servers/1', 'valid-token');
    await middleware(req as any);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('laisse passer /register sans token', async () => {
    const req = makeRequest('/register');
    await middleware(req as any);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('laisse passer /verify-otp sans token', async () => {
    const req = makeRequest('/verify-otp');
    await middleware(req as any);
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
