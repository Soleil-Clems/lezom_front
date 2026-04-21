import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loginRequest,
  registerRequest,
  verifyOtpRequest,
  resendOtpRequest,
} from '@/requests/authRequest';

vi.mock('@/lib/customFetch', () => ({
  customfetch: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { customfetch } from '@/lib/customFetch';

describe('authRequest', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loginRequest appelle POST auth/login', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ access_token: 'tok' });
    await loginRequest({ email: 'a@b.com', password: 'pass' });
    expect(customfetch.post).toHaveBeenCalledWith(
      'auth/login',
      expect.objectContaining({ email: 'a@b.com' }),
    );
  });

  it('registerRequest appelle POST users', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ id: 1 });
    await registerRequest({
      email: 'a@b.com',
      password: 'pass',
      firstname: 'A',
      lastname: 'B',
      username: 'ab',
      birthdate: '2000-01-01',
    });
    expect(customfetch.post).toHaveBeenCalledWith('users', expect.any(Object));
  });

  it('verifyOtpRequest appelle POST auth/verify-otp', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({});
    await verifyOtpRequest({ userId: 1, code: '123456' });
    expect(customfetch.post).toHaveBeenCalledWith('auth/verify-otp', { userId: 1, code: '123456' });
  });

  it('resendOtpRequest appelle POST auth/resend-otp', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({});
    await resendOtpRequest({ userId: 1 });
    expect(customfetch.post).toHaveBeenCalledWith('auth/resend-otp', { userId: 1 });
  });
});
