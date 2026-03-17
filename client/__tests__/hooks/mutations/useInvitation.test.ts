import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useCreateInvitation, useJoinServer } from '@/hooks/mutations/useInvitation'

vi.mock('@/requests/invitationRequest', () => ({
  createInvitationRequest: vi.fn(),
  joinServerByCodeRequest: vi.fn(),
  getInvitePreviewRequest: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('useInvitation', () => {
  it('useCreateInvitation expose mutate', () => {
    const { result } = renderHookWithQuery(() => useCreateInvitation())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })

  it('useJoinServer expose mutate', () => {
    const { result } = renderHookWithQuery(() => useJoinServer())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
