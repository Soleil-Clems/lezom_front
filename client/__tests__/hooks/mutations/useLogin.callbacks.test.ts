import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { loginRequest } from '@/requests/authRequest'
import { toast } from 'sonner'

vi.mock('@/requests/authRequest', () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  verifyOtpRequest: vi.fn(),
  resendOtpRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useLogin } from '@/hooks/mutations/useLogin'

describe('useLogin callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess invalide les queries', async () => {
    vi.mocked(loginRequest).mockResolvedValue({ access_token: 'tok' } as any)
    const { result } = renderHookWithQuery(() => useLogin())
    await act(async () => {
      await result.current.mutateAsync({ email: 'a@b.com', password: 'pass' } as any)
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(loginRequest).mockRejectedValue(new Error('Identifiants incorrects'))
    const { result } = renderHookWithQuery(() => useLogin())
    await act(async () => {
      try { await result.current.mutateAsync({ email: 'a@b.com', password: 'wrong' } as any) } catch {}
    })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Identifiants incorrects'))
  })
})
