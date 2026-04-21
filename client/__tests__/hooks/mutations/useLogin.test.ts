import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useLogin } from '@/hooks/mutations/useLogin';

vi.mock('@/requests/authRequest', () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  verifyOtpRequest: vi.fn(),
  resendOtpRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useLogin', () => {
  it('expose mutate et status', () => {
    const { result } = renderHookWithQuery(() => useLogin());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
