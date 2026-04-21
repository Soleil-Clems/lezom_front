import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useDeletePrivateMessage } from '@/hooks/mutations/useDeletePrivateMessage';

vi.mock('@/requests/conversationRequest', () => ({
  deletePrivateMessageRequest: vi.fn(),
  createConversationRequest: vi.fn(),
  getAllConversationsRequest: vi.fn(),
  getConversationByIdRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useDeletePrivateMessage', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useDeletePrivateMessage('1'));
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
