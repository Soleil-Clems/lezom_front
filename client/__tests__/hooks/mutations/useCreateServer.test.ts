import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useCreateServer } from '@/hooks/mutations/useCreateServer'

vi.mock('@/requests/serverRequest', () => ({
  serverRequest: vi.fn(),
  getAllServersRequest: vi.fn(),
  getAllChannelsOfAServerRequest: vi.fn(),
  deleteServerRequest: vi.fn(),
  updateServerNameRequest: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('useCreateServer', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useCreateServer())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
