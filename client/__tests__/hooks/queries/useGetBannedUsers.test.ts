import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useGetBannedUsers } from '@/hooks/queries/useGetBannedUsers'

vi.mock('@/requests/banRequest', () => ({
  getBannedUsersRequest: vi.fn().mockResolvedValue([]),
}))

describe('useGetBannedUsers', () => {
  it('est désactivé si serverId est falsy', () => {
    const { result } = renderHookWithQuery(() => useGetBannedUsers(''))
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('est activé si serverId est fourni', () => {
    const { result } = renderHookWithQuery(() => useGetBannedUsers(1))
    expect(result.current).toHaveProperty('data')
  })
})
