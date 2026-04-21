import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'

vi.mock('@/lib/socket', () => ({
  socketManager: {
    connect: vi.fn(),
    getSocket: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useSendPrivateMessage } from '@/hooks/mutations/useSendPrivateMessage'

describe('useSendPrivateMessage', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useSendPrivateMessage('1'))
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })

  it('fonctionne sans conversationId', () => {
    const { result } = renderHookWithQuery(() => useSendPrivateMessage(undefined))
    expect(result.current).toHaveProperty('mutate')
  })
})
