import { describe, it, expect, vi, beforeEach } from 'vitest'
import { channelRequest, getAllMessagesOfAChannelRequest } from '@/requests/channelRequest'

vi.mock('@/lib/customFetch', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import customfetch from '@/lib/customFetch'

describe('channelRequest', () => {
  beforeEach(() => vi.clearAllMocks())

  it('channelRequest appelle POST channels', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ id: 1 })
    await channelRequest({ name: 'general', type: 'text', serverId: 1 })
    expect(customfetch.post).toHaveBeenCalledWith('channels', expect.objectContaining({ name: 'general' }))
  })

  it('getAllMessagesOfAChannelRequest appelle GET messages/channel/:id', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([])
    await getAllMessagesOfAChannelRequest(5)
    expect(customfetch.get).toHaveBeenCalledWith('messages/channel/5')
  })
})
