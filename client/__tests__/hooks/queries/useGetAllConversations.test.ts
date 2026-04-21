import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useGetAllConversations } from '@/hooks/queries/useGetAllConversations'

vi.mock('@/requests/conversationRequest', () => ({
  getAllConversationsRequest: vi.fn().mockResolvedValue([]),
  getConversationByIdRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
}))

describe('useGetAllConversations', () => {
  it('retourne un objet query', () => {
    const { result } = renderHookWithQuery(() => useGetAllConversations())
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
  })
})
