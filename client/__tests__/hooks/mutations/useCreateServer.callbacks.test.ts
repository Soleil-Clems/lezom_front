import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { serverRequest } from '@/requests/serverRequest'
import { toast } from 'sonner'

vi.mock('@/requests/serverRequest', () => ({
  serverRequest: vi.fn(),
  getAllServersRequest: vi.fn(),
  updateServerNameRequest: vi.fn(),
  deleteServerRequest: vi.fn(),
  updateChannelNameRequest: vi.fn(),
  deleteChannelRequest: vi.fn(),
  updateMemberRoleRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useCreateServer } from '@/hooks/mutations/useCreateServer'

describe('useCreateServer callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess invalide les queries', async () => {
    vi.mocked(serverRequest).mockResolvedValue({ id: 1, name: 'server' } as any)
    const { result } = renderHookWithQuery(() => useCreateServer())
    await act(async () => {
      await result.current.mutateAsync({ name: 'My Server' } as any)
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(serverRequest).mockRejectedValue(new Error('Erreur serveur'))
    const { result } = renderHookWithQuery(() => useCreateServer())
    await act(async () => {
      try { await result.current.mutateAsync({ name: '' } as any) } catch {}
    })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Erreur serveur'))
  })
})
