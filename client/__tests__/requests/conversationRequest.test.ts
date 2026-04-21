import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createConversationRequest,
  getAllConversationsRequest,
  getConversationByIdRequest,
  getConversationMessagesRequest,
  sendPrivateMessageRequest,
  updatePrivateMessageRequest,
  deletePrivateMessageRequest,
} from '@/requests/conversationRequest'

vi.mock('@/lib/customFetch', () => ({
  customfetch: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import { customfetch } from '@/lib/customFetch'

describe('conversationRequest', () => {
  beforeEach(() => vi.clearAllMocks())

  it('createConversationRequest appelle POST conversations', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ id: 1 })
    await createConversationRequest({ userId: 2 })
    expect(customfetch.post).toHaveBeenCalledWith('conversations', { userId: 2 })
  })

  it('getAllConversationsRequest appelle GET conversations', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([])
    await getAllConversationsRequest()
    expect(customfetch.get).toHaveBeenCalledWith('conversations')
  })

  it('getConversationByIdRequest appelle GET conversations/:id', async () => {
    vi.mocked(customfetch.get).mockResolvedValue({})
    await getConversationByIdRequest(3)
    expect(customfetch.get).toHaveBeenCalledWith('conversations/3')
  })

  it('getConversationMessagesRequest appelle GET avec pagination', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([])
    await getConversationMessagesRequest(1, 2, 20)
    expect(customfetch.get).toHaveBeenCalledWith('conversations/1/messages?page=2&limit=20')
  })

  it('sendPrivateMessageRequest appelle POST conversations/:id/messages', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({})
    await sendPrivateMessageRequest(1, { content: 'hi', type: 'text' })
    expect(customfetch.post).toHaveBeenCalledWith('conversations/1/messages', { content: 'hi', type: 'text' })
  })

  it('updatePrivateMessageRequest appelle PATCH conversations/messages/:id', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({})
    await updatePrivateMessageRequest(5, { content: 'updated' })
    expect(customfetch.patch).toHaveBeenCalledWith('conversations/messages/5', { content: 'updated' })
  })

  it('deletePrivateMessageRequest appelle DELETE conversations/messages/:id', async () => {
    vi.mocked(customfetch.delete).mockResolvedValue({})
    await deletePrivateMessageRequest(5)
    expect(customfetch.delete).toHaveBeenCalledWith('conversations/messages/5')
  })
})
