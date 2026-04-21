import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useGetConversationMessages } from '@/hooks/queries/useGetConversationMessages'

vi.mock('@/requests/conversationRequest', () => ({
  getConversationMessagesRequest: vi.fn().mockResolvedValue([]),
  getAllConversationsRequest: vi.fn(),
  getConversationByIdRequest: vi.fn(),
}))

describe('useGetConversationMessages', () => {
  it('est désactivé si conversationId est undefined', () => {
    const { result } = renderHookWithQuery(() => useGetConversationMessages(undefined))
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('est activé si conversationId est fourni', () => {
    const { result } = renderHookWithQuery(() => useGetConversationMessages('1'))
    expect(result.current).toHaveProperty('data')
  })
})
