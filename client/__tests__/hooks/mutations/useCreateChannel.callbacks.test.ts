import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { channelRequest } from '@/requests/channelRequest'
import { toast } from 'sonner'

vi.mock('@/requests/channelRequest', () => ({
  channelRequest: vi.fn(),
  getAllChannelsOfAServerRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useCreateChannel } from '@/hooks/mutations/useCreateChannel'

describe('useCreateChannel callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess invalide les queries', async () => {
    vi.mocked(channelRequest).mockResolvedValue({ id: 1, name: 'general' } as any)
    const { result } = renderHookWithQuery(() => useCreateChannel())
    await act(async () => {
      await result.current.mutateAsync({ name: 'general', type: 'text', serverId: 1 } as any)
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(channelRequest).mockRejectedValue(new Error('Erreur canal'))
    const { result } = renderHookWithQuery(() => useCreateChannel())
    await act(async () => { try { await result.current.mutateAsync({} as any) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Erreur canal'))
  })
})
