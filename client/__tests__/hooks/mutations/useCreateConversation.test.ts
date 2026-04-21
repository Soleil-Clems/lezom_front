import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useCreateConversation } from '@/hooks/mutations/useCreateConversation'

vi.mock('@/requests/conversationRequest', () => ({
  createConversationRequest: vi.fn(),
  getAllConversationsRequest: vi.fn(),
  getConversationByIdRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('useCreateConversation', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useCreateConversation())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
