import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { banUserRequest, unbanUserRequest } from '@/requests/banRequest'
import { toast } from 'sonner'

vi.mock('@/requests/banRequest', () => ({
  banUserRequest: vi.fn(),
  unbanUserRequest: vi.fn(),
  getBannedUsersRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useBanUser, useUnbanUser } from '@/hooks/mutations/useBanManagement'

describe('useBanUser callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(banUserRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useBanUser())
    await act(async () => {
      await result.current.mutateAsync({ serverId: '1', userId: 2, reason: 'spam' })
    })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Utilisateur banni avec succès'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(banUserRequest).mockRejectedValue(new Error('Non autorisé'))
    const { result } = renderHookWithQuery(() => useBanUser())
    await act(async () => { try { await result.current.mutateAsync({ serverId: '1', userId: 2 }) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})

describe('useUnbanUser callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(unbanUserRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useUnbanUser())
    await act(async () => {
      await result.current.mutateAsync({ serverId: '1', userId: 2 })
    })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Utilisateur débanni avec succès'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(unbanUserRequest).mockRejectedValue(new Error('Erreur'))
    const { result } = renderHookWithQuery(() => useUnbanUser())
    await act(async () => { try { await result.current.mutateAsync({ serverId: '1', userId: 2 }) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})
