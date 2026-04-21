import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { toast } from 'sonner'

vi.mock('@/requests/messageRequest', () => ({
  updateChannelMessageRequest: vi.fn(),
  deleteChannelMessageRequest: vi.fn(),
  getMessagesRequest: vi.fn(),
}))
vi.mock('@/requests/conversationRequest', () => ({
  updatePrivateMessageRequest: vi.fn(),
  deletePrivateMessageRequest: vi.fn(),
  getAllConversationsRequest: vi.fn(),
  createConversationRequest: vi.fn(),
  getConversationRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { updateChannelMessageRequest } from '@/requests/messageRequest'
import { updatePrivateMessageRequest } from '@/requests/conversationRequest'
import { useUpdateChannelMessage } from '@/hooks/mutations/useUpdateChannelMessage'
import { useUpdatePrivateMessage } from '@/hooks/mutations/useUpdatePrivateMessage'

describe('useUpdateChannelMessage callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(updateChannelMessageRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useUpdateChannelMessage('1'))
    await act(async () => {
      await result.current.mutateAsync({ messageId: 1, content: 'updated' })
    })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Message modifié'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(updateChannelMessageRequest).mockRejectedValue(new Error('Fail'))
    const { result } = renderHookWithQuery(() => useUpdateChannelMessage('1'))
    await act(async () => { try { await result.current.mutateAsync({ messageId: 1, content: 'x' }) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})

describe('useUpdatePrivateMessage callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(updatePrivateMessageRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useUpdatePrivateMessage('1'))
    await act(async () => {
      await result.current.mutateAsync({ messageId: 1, content: 'updated' })
    })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Message modifié'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(updatePrivateMessageRequest).mockRejectedValue(new Error('Fail'))
    const { result } = renderHookWithQuery(() => useUpdatePrivateMessage('1'))
    await act(async () => { try { await result.current.mutateAsync({ messageId: 1, content: 'x' }) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})
