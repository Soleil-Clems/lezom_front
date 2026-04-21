import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useVerifyOtp } from '@/hooks/mutations/useVerifyOtp';

vi.mock('@/requests/authRequest', () => ({
  verifyOtpRequest: vi.fn(),
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  resendOtpRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useVerifyOtp', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useVerifyOtp());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
