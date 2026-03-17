import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useGetInvitePreview } from '@/hooks/queries/useGetInvitePreview'

vi.mock('@/requests/invitationRequest', () => ({
  getInvitePreviewRequest: vi.fn().mockResolvedValue({ name: 'Serveur' }),
  createInvitationRequest: vi.fn(),
  joinServerByCodeRequest: vi.fn(),
}))

describe('useGetInvitePreview', () => {
  it('est désactivé si code est vide', () => {
    const { result } = renderHookWithQuery(() => useGetInvitePreview(''))
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('est activé si code est fourni', () => {
    const { result } = renderHookWithQuery(() => useGetInvitePreview('abc123'))
    expect(result.current).toHaveProperty('data')
  })
})
