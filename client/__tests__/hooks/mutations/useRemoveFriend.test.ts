import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useRemoveFriend } from '@/hooks/mutations/useRemoveFriend'

vi.mock('@/requests/friendRequest', () => ({
  removeFriendRequest: vi.fn(),
  acceptFriendRequestRequest: vi.fn(),
  declineFriendRequestRequest: vi.fn(),
  sendFriendRequestRequest: vi.fn(),
  getFriendsRequest: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('useRemoveFriend', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useRemoveFriend())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
