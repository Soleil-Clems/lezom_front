import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useUpdatePrivateMessage } from '@/hooks/mutations/useUpdatePrivateMessage';

vi.mock('@/requests/conversationRequest', () => ({
  updatePrivateMessageRequest: vi.fn(),
  createConversationRequest: vi.fn(),
  getAllConversationsRequest: vi.fn(),
  getConversationByIdRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
  deletePrivateMessageRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useUpdatePrivateMessage', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useUpdatePrivateMessage('1'));
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
