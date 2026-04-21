import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  searchUsersRequest,
  sendFriendRequestRequest,
  acceptFriendRequestRequest,
  declineFriendRequestRequest,
  getFriendsRequest,
  getPendingRequestsRequest,
  removeFriendRequest,
  blockUserRequest,
} from '@/requests/friendRequest'

vi.mock('@/lib/customFetch', () => ({
  customfetch: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import { customfetch } from '@/lib/customFetch'

describe('friendRequest', () => {
  beforeEach(() => vi.clearAllMocks())

  it('searchUsersRequest appelle GET users/search', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([])
    await searchUsersRequest('alex')
    expect(customfetch.get).toHaveBeenCalledWith('users/search?q=alex')
  })

  it('sendFriendRequestRequest appelle POST friends/request/:userId', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({})
    await sendFriendRequestRequest(2)
    expect(customfetch.post).toHaveBeenCalledWith('friends/request/2', {})
  })

  it('acceptFriendRequestRequest appelle PATCH friends/request/:id/accept', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({})
    await acceptFriendRequestRequest(5)
    expect(customfetch.patch).toHaveBeenCalledWith('friends/request/5/accept', {})
  })

  it('declineFriendRequestRequest appelle PATCH friends/request/:id/decline', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({})
    await declineFriendRequestRequest(5)
    expect(customfetch.patch).toHaveBeenCalledWith('friends/request/5/decline', {})
  })

  it('getFriendsRequest appelle GET friends', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([])
    await getFriendsRequest()
    expect(customfetch.get).toHaveBeenCalledWith('friends')
  })

  it('getPendingRequestsRequest appelle GET friends/requests/pending', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([])
    await getPendingRequestsRequest()
    expect(customfetch.get).toHaveBeenCalledWith('friends/requests/pending')
  })

  it('removeFriendRequest appelle DELETE friends/:userId', async () => {
    vi.mocked(customfetch.delete).mockResolvedValue({})
    await removeFriendRequest(3)
    expect(customfetch.delete).toHaveBeenCalledWith('friends/3')
  })

  it('blockUserRequest appelle POST friends/block/:userId', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({})
    await blockUserRequest(4)
    expect(customfetch.post).toHaveBeenCalledWith('friends/block/4', {})
  })
})
