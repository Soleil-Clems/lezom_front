import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { createInvitationRequest, joinServerByCodeRequest } from '@/requests/invitationRequest'
import { toast } from 'sonner'

vi.mock('@/requests/invitationRequest', () => ({
  createInvitationRequest: vi.fn(),
  joinServerByCodeRequest: vi.fn(),
  getInvitePreviewRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useCreateInvitation, useJoinServer } from '@/hooks/mutations/useInvitation'

describe('useCreateInvitation callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onError appelle toast.error', async () => {
    vi.mocked(createInvitationRequest).mockRejectedValue(new Error('Erreur invitation'))
    const { result } = renderHookWithQuery(() => useCreateInvitation())
    await act(async () => {
      try { await result.current.mutateAsync({ serverId: '1' }) } catch {}
    })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })

  it('onSuccess retourne les données', async () => {
    vi.mocked(createInvitationRequest).mockResolvedValue({ code: 'ABC123' } as any)
    const { result } = renderHookWithQuery(() => useCreateInvitation())
    await act(async () => { await result.current.mutateAsync({ serverId: '1' }) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useJoinServer callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(joinServerByCodeRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useJoinServer())
    await act(async () => { await result.current.mutateAsync('ABC123') })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Vous avez rejoint le serveur !'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(joinServerByCodeRequest).mockRejectedValue(new Error('Code invalide'))
    const { result } = renderHookWithQuery(() => useJoinServer())
    await act(async () => { try { await result.current.mutateAsync('INVALID') } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})
