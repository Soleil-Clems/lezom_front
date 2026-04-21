import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createInvitationRequest, getInvitePreviewRequest, joinServerByCodeRequest } from '@/requests/invitationRequest'

vi.mock('@/lib/customFetch', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import customfetch from '@/lib/customFetch'

describe('invitationRequest', () => {
  beforeEach(() => vi.clearAllMocks())

  it('createInvitationRequest appelle POST servers/:id/invitations', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ code: 'abc123' })
    await createInvitationRequest(1)
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/invitations', undefined)
  })

  it('createInvitationRequest passe les params si fournis', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ code: 'abc123' })
    await createInvitationRequest(1, { maxUses: 10 })
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/invitations', { maxUses: 10 })
  })

  it('getInvitePreviewRequest appelle GET servers/invite-preview/:code', async () => {
    vi.mocked(customfetch.get).mockResolvedValue({ name: 'Serveur' })
    await getInvitePreviewRequest('abc123')
    expect(customfetch.get).toHaveBeenCalledWith('servers/invite-preview/abc123')
  })

  it('joinServerByCodeRequest appelle POST servers/join/:code', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ id: 1 })
    await joinServerByCodeRequest('abc123')
    expect(customfetch.post).toHaveBeenCalledWith('servers/join/abc123')
  })
})
