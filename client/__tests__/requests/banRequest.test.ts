import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getBannedUsersRequest, banUserRequest, unbanUserRequest } from '@/requests/banRequest'

vi.mock('@/lib/customFetch', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import customfetch from '@/lib/customFetch'

describe('banRequest', () => {
  beforeEach(() => vi.clearAllMocks())

  it('getBannedUsersRequest appelle GET servers/:id/bans', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([])
    await getBannedUsersRequest(1)
    expect(customfetch.get).toHaveBeenCalledWith('servers/1/bans')
  })

  it('banUserRequest appelle POST servers/:id/bans', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({})
    await banUserRequest(1, 2, 'spam')
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/bans', { userId: 2, reason: 'spam' })
  })

  it('unbanUserRequest appelle DELETE servers/:id/bans/:userId', async () => {
    vi.mocked(customfetch.delete).mockResolvedValue({})
    await unbanUserRequest(1, 2)
    expect(customfetch.delete).toHaveBeenCalledWith('servers/1/bans/2')
  })
})
