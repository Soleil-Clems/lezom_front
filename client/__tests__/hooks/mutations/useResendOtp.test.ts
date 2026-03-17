import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useResendOtp } from '@/hooks/mutations/useResendOtp'

vi.mock('@/requests/authRequest', () => ({
  resendOtpRequest: vi.fn(),
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  verifyOtpRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('useResendOtp', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useResendOtp())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
