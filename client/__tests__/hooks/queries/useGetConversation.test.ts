import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useGetConversation } from '@/hooks/queries/useGetConversation'

vi.mock('@/requests/conversationRequest', () => ({
  getAllConversationsRequest: vi.fn(),
  getConversationByIdRequest: vi.fn().mockResolvedValue({}),
  getConversationMessagesRequest: vi.fn(),
}))

describe('useGetConversation', () => {
  it('est désactivé si conversationId est undefined', () => {
    const { result } = renderHookWithQuery(() => useGetConversation(undefined))
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('est activé si conversationId est fourni', () => {
    const { result } = renderHookWithQuery(() => useGetConversation('1'))
    expect(result.current).toHaveProperty('data')
  })
})
