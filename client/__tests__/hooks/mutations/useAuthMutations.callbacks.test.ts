import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import {
  registerRequest,
  verifyOtpRequest,
  resendOtpRequest,
} from '@/requests/authRequest'
import { toast } from 'sonner'

vi.mock('@/requests/authRequest', () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  verifyOtpRequest: vi.fn(),
  resendOtpRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useRegister } from '@/hooks/mutations/useRegister'
import { useVerifyOtp } from '@/hooks/mutations/useVerifyOtp'
import { useResendOtp } from '@/hooks/mutations/useResendOtp'

describe('useRegister callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess retourne les données', async () => {
    vi.mocked(registerRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useRegister())
    await act(async () => { await result.current.mutateAsync({ email: 'a@b.com', password: 'pass', username: 'user', firstname: 'F', lastname: 'L' } as any) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(registerRequest).mockRejectedValue(new Error('Email déjà utilisé'))
    const { result } = renderHookWithQuery(() => useRegister())
    await act(async () => { try { await result.current.mutateAsync({} as any) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Email déjà utilisé'))
  })
})

describe('useVerifyOtp callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess invalide authuser', async () => {
    vi.mocked(verifyOtpRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useVerifyOtp())
    await act(async () => { await result.current.mutateAsync({ email: 'a@b.com', otp: '123456' } as any) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(verifyOtpRequest).mockRejectedValue(new Error('OTP invalide'))
    const { result } = renderHookWithQuery(() => useVerifyOtp())
    await act(async () => { try { await result.current.mutateAsync({} as any) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalledWith('OTP invalide'))
  })
})

describe('useResendOtp callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(resendOtpRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useResendOtp())
    await act(async () => { await result.current.mutateAsync({ email: 'a@b.com' } as any) })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Code renvoyé !'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(resendOtpRequest).mockRejectedValue(new Error('Erreur envoi'))
    const { result } = renderHookWithQuery(() => useResendOtp())
    await act(async () => { try { await result.current.mutateAsync({} as any) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})
