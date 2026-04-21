import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useAuthUser } from '@/hooks/queries/useAuthUser'

vi.mock('@/requests/userRequest', () => ({
  getAuthUserRequest: vi.fn(),
}))

import { getAuthUserRequest } from '@/requests/userRequest'

describe('useAuthUser', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne un objet query', () => {
    vi.mocked(getAuthUserRequest).mockResolvedValue({ id: 1 })
    const { result } = renderHookWithQuery(() => useAuthUser())
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('isError')
  })
})
