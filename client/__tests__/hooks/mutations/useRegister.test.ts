import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useRegister } from '@/hooks/mutations/useRegister';

vi.mock('@/requests/authRequest', () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  verifyOtpRequest: vi.fn(),
  resendOtpRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useRegister', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useRegister());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
