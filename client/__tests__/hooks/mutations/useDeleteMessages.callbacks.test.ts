import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { toast } from 'sonner';

vi.mock('@/requests/messageRequest', () => ({
  deleteChannelMessageRequest: vi.fn(),
  updateChannelMessageRequest: vi.fn(),
  getMessagesRequest: vi.fn(),
}));
vi.mock('@/requests/conversationRequest', () => ({
  deletePrivateMessageRequest: vi.fn(),
  updatePrivateMessageRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
  getAllConversationsRequest: vi.fn(),
  createConversationRequest: vi.fn(),
  getConversationRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import { deleteChannelMessageRequest } from '@/requests/messageRequest';
import { deletePrivateMessageRequest } from '@/requests/conversationRequest';
import { useDeleteChannelMessage } from '@/hooks/mutations/useDeleteChannelMessage';
import { useDeletePrivateMessage } from '@/hooks/mutations/useDeletePrivateMessage';

describe('useDeleteChannelMessage callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(deleteChannelMessageRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useDeleteChannelMessage('1'));
    await act(async () => {
      await result.current.mutateAsync(42);
    });
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Message supprimé'));
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(deleteChannelMessageRequest).mockRejectedValue(new Error('Erreur'));
    const { result } = renderHookWithQuery(() => useDeleteChannelMessage('1'));
    await act(async () => {
      try {
        await result.current.mutateAsync(42);
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});

describe('useDeletePrivateMessage callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess est appelé avec succès', async () => {
    vi.mocked(deletePrivateMessageRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useDeletePrivateMessage('1'));
    await act(async () => {
      await result.current.mutateAsync(42);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(deletePrivateMessageRequest).mockRejectedValue(new Error('Erreur'));
    const { result } = renderHookWithQuery(() => useDeletePrivateMessage('1'));
    await act(async () => {
      try {
        await result.current.mutateAsync(42);
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});
