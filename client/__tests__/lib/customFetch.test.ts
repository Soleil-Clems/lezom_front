import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/store/authStore', () => ({
  default: {
    getState: vi.fn(() => ({ token: 'test-token', logout: vi.fn() })),
  },
}))

vi.mock('@/lib/tokenRefresh', () => ({
  refreshAccessToken: vi.fn(),
}))

const makeResponse = (status: number, body: unknown = {}) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
})

global.fetch = vi.fn()

import { customfetch } from '@/lib/customFetch'
import useAuthStore from '@/store/authStore'
import { refreshAccessToken } from '@/lib/tokenRefresh'

describe('CustomFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore.getState).mockReturnValue({ token: 'test-token', logout: vi.fn() } as any)
  })

  it('GET envoie une requête avec Authorization header', async () => {
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(200, { data: 'ok' }) as any)
    const result = await customfetch.get('test/endpoint')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('test/endpoint'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      })
    )
    expect(result).toEqual({ data: 'ok' })
  })

  it('POST envoie le body en JSON', async () => {
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(200, { id: 1 }) as any)
    const result = await customfetch.post('test/endpoint', { name: 'test' })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('test/endpoint'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
    expect(result).toEqual({ id: 1 })
  })

  it('POST avec FormData ne set pas Content-Type', async () => {
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(200, {}) as any)
    const formData = new FormData()
    formData.append('file', new Blob(['test']))
    await customfetch.post('test/endpoint', formData)
    const call = vi.mocked(global.fetch).mock.calls[0][1] as any
    expect(call.headers['Content-Type']).toBeUndefined()
  })

  it('PATCH envoie le body', async () => {
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(200, {}) as any)
    await customfetch.patch('test/endpoint', { name: 'new' })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('DELETE envoie la bonne méthode', async () => {
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(200, {}) as any)
    await customfetch.delete('test/endpoint')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('lève une erreur si la réponse est ko', async () => {
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(500, { message: 'Server error' }) as any)
    await expect(customfetch.get('test/endpoint')).rejects.toThrow('Server error')
  })

  it('lève une erreur générique si pas de message dans la réponse', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 500,
      ok: false,
      json: async () => { throw new Error() },
    } as any)
    await expect(customfetch.get('test/endpoint')).rejects.toThrow('Erreur 500')
  })

  it('sur 401 avec endpoint login, lève une erreur sans retry', async () => {
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(401, { message: 'Identifiants incorrects' }) as any)
    await expect(customfetch.post('auth/login', {})).rejects.toThrow('Identifiants incorrects')
    expect(refreshAccessToken).not.toHaveBeenCalled()
  })

  it('sur 401, tente un refresh et retry', async () => {
    vi.mocked(refreshAccessToken).mockResolvedValue('new-token')
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(makeResponse(401) as any)
      .mockResolvedValueOnce(makeResponse(200, { ok: true }) as any)

    const result = await customfetch.get('protected/resource')
    expect(refreshAccessToken).toHaveBeenCalled()
    expect(result).toEqual({ ok: true })
  })

  it('sur 401 + refresh échoue, appelle logout', async () => {
    const logoutMock = vi.fn()
    vi.mocked(useAuthStore.getState).mockReturnValue({ token: 'test-token', logout: logoutMock } as any)
    vi.mocked(refreshAccessToken).mockResolvedValue(null)
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(401) as any)

    await expect(customfetch.get('protected/resource')).rejects.toThrow()
    expect(logoutMock).toHaveBeenCalled()
  })

  it('sur 401 auth/me, appelle logout', async () => {
    const logoutMock = vi.fn()
    vi.mocked(useAuthStore.getState).mockReturnValue({ token: 'test-token', logout: logoutMock } as any)
    vi.mocked(global.fetch).mockResolvedValue(makeResponse(404) as any)

    await expect(customfetch.get('auth/me')).rejects.toThrow()
    expect(logoutMock).toHaveBeenCalled()
  })
})
