import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useDeleteChannelMessage } from '@/hooks/mutations/useDeleteChannelMessage'

vi.mock('@/requests/messageRequest', () => ({
  deleteChannelMessageRequest: vi.fn(),
  updateChannelMessageRequest: vi.fn(),
  sendMessageRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('useDeleteChannelMessage', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useDeleteChannelMessage('1'))
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
