import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAuthUserRequest, updateUserRequest, updatePictureRequest } from '@/requests/userRequest'

vi.mock('@/lib/customFetch', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import customfetch from '@/lib/customFetch'

describe('userRequest', () => {
  beforeEach(() => vi.clearAllMocks())

  it('getAuthUserRequest appelle GET auth/me', async () => {
    vi.mocked(customfetch.get).mockResolvedValue({ id: 1 })
    await getAuthUserRequest()
    expect(customfetch.get).toHaveBeenCalledWith('auth/me')
  })

  it('updateUserRequest appelle PATCH users/:id', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({})
    await updateUserRequest(1, { username: 'newname' })
    expect(customfetch.patch).toHaveBeenCalledWith('users/1', { username: 'newname' })
  })

  it('updatePictureRequest appelle PATCH users/picture/:id avec FormData', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({})
    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    await updatePictureRequest(1, file)
    expect(customfetch.patch).toHaveBeenCalledWith('users/picture/1', expect.any(FormData))
  })
})
