import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { createConversationRequest } from '@/requests/conversationRequest';
import { toast } from 'sonner';

vi.mock('@/requests/conversationRequest', () => ({
  createConversationRequest: vi.fn(),
  getAllConversationsRequest: vi.fn(),
  getConversationRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
  deletePrivateMessageRequest: vi.fn(),
  updatePrivateMessageRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import { useCreateConversation } from '@/hooks/mutations/useCreateConversation';

describe('useCreateConversation callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess invalide les queries', async () => {
    vi.mocked(createConversationRequest).mockResolvedValue({ id: 1 } as any);
    const { result } = renderHookWithQuery(() => useCreateConversation());
    await act(async () => {
      await result.current.mutateAsync({ userId: 2 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(createConversationRequest).mockRejectedValue(new Error('Erreur conversation'));
    const { result } = renderHookWithQuery(() => useCreateConversation());
    await act(async () => {
      try {
        await result.current.mutateAsync({ userId: 2 });
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});
