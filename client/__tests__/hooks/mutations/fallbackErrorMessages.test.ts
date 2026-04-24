import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';

const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...a: any[]) => toastError(...a),
    success: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }));

vi.mock('@/requests/friendRequest', () => ({
  acceptFriendRequestRequest: vi.fn(),
  declineFriendRequestRequest: vi.fn(),
  removeFriendRequest: vi.fn(),
  sendFriendRequestRequest: vi.fn(),
}));
vi.mock('@/requests/banRequest', () => ({
  banUserRequest: vi.fn(),
  unbanUserRequest: vi.fn(),
}));
vi.mock('@/requests/leaveServerRequest', () => ({
  leaveServerRequest: vi.fn(),
}));
vi.mock('@/requests/transferOwnershipRequest', () => ({
  transferOwnershipRequest: vi.fn(),
}));
vi.mock('@/requests/userRequest', () => ({
  updatePictureRequest: vi.fn(),
  getUserByIdRequest: vi.fn(),
}));
vi.mock('@/requests/channelRequest', () => ({
  createChannelRequest: vi.fn(),
}));
vi.mock('@/requests/conversationRequest', () => ({
  createConversationRequest: vi.fn(),
  updatePrivateMessageRequest: vi.fn(),
  deletePrivateMessageRequest: vi.fn(),
}));
vi.mock('@/requests/messageRequest', () => ({
  updateChannelMessageRequest: vi.fn(),
  deleteChannelMessageRequest: vi.fn(),
}));
vi.mock('@/requests/invitationRequest', () => ({
  createInvitationRequest: vi.fn(),
  joinServerByCodeRequest: vi.fn(),
  getInvitePreviewRequest: vi.fn(),
}));
vi.mock('@/requests/serverRequest', () => ({
  updateServerRequest: vi.fn(),
}));

import {
  acceptFriendRequestRequest,
  declineFriendRequestRequest,
  removeFriendRequest,
  sendFriendRequestRequest,
} from '@/requests/friendRequest';
import { banUserRequest, unbanUserRequest } from '@/requests/banRequest';
import { leaveServerRequest } from '@/requests/leaveServerRequest';
import { transferOwnershipRequest } from '@/requests/transferOwnershipRequest';
import { updatePictureRequest } from '@/requests/userRequest';
import {
  createConversationRequest,
  updatePrivateMessageRequest,
  deletePrivateMessageRequest,
} from '@/requests/conversationRequest';
import {
  updateChannelMessageRequest,
  deleteChannelMessageRequest,
} from '@/requests/messageRequest';
import { createInvitationRequest, joinServerByCodeRequest } from '@/requests/invitationRequest';

import { useAcceptFriendRequest } from '@/hooks/mutations/useAcceptFriendRequest';
import { useDeclineFriendRequest } from '@/hooks/mutations/useDeclineFriendRequest';
import { useRemoveFriend } from '@/hooks/mutations/useRemoveFriend';
import { useSendFriendRequest } from '@/hooks/mutations/useSendFriendRequest';
import { useBanUser, useUnbanUser } from '@/hooks/mutations/useBanManagement';
import { useLeaveServer } from '@/hooks/mutations/useLeaveServer';
import { useTransferOwnership } from '@/hooks/mutations/useTransferOwnership';
import { useEditProfilPicture } from '@/hooks/mutations/useEditProfilPicture';
import { useCreateConversation } from '@/hooks/mutations/useCreateConversation';
import { useUpdateChannelMessage } from '@/hooks/mutations/useUpdateChannelMessage';
import { useUpdatePrivateMessage } from '@/hooks/mutations/useUpdatePrivateMessage';
import { useDeleteChannelMessage } from '@/hooks/mutations/useDeleteChannelMessage';
import { useDeletePrivateMessage } from '@/hooks/mutations/useDeletePrivateMessage';
import { useCreateInvitation, useJoinServer } from '@/hooks/mutations/useInvitation';

const expectFallback = async (hookCall: () => any, input: any) => {
  const { result } = renderHookWithQuery(hookCall);
  await act(async () => {
    try {
      await result.current.mutateAsync(input);
    } catch {}
  });
  await waitFor(() => expect(toastError).toHaveBeenCalled());
};

describe('mutations: fallback error message (error sans .message)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('useAcceptFriendRequest fallback', async () => {
    vi.mocked(acceptFriendRequestRequest).mockRejectedValue({} as any);
    await expectFallback(() => useAcceptFriendRequest(), 1);
  });

  it('useDeclineFriendRequest fallback', async () => {
    vi.mocked(declineFriendRequestRequest).mockRejectedValue({} as any);
    await expectFallback(() => useDeclineFriendRequest(), 1);
  });

  it('useRemoveFriend fallback', async () => {
    vi.mocked(removeFriendRequest).mockRejectedValue({} as any);
    await expectFallback(() => useRemoveFriend(), 1);
  });

  it('useSendFriendRequest fallback', async () => {
    vi.mocked(sendFriendRequestRequest).mockRejectedValue({} as any);
    await expectFallback(() => useSendFriendRequest(), 1);
  });

  it('useBanUser fallback', async () => {
    vi.mocked(banUserRequest).mockRejectedValue({} as any);
    await expectFallback(() => useBanUser(), { serverId: 1, userId: 2 });
  });

  it('useUnbanUser fallback', async () => {
    vi.mocked(unbanUserRequest).mockRejectedValue({} as any);
    await expectFallback(() => useUnbanUser(), { serverId: 1, userId: 2 });
  });

  it('useLeaveServer fallback', async () => {
    vi.mocked(leaveServerRequest).mockRejectedValue({} as any);
    await expectFallback(() => useLeaveServer(), { serverId: 1 });
  });

  it('useTransferOwnership fallback', async () => {
    vi.mocked(transferOwnershipRequest).mockRejectedValue({} as any);
    await expectFallback(() => useTransferOwnership(), {
      serverId: 1,
      newOwnerId: 2,
    });
  });

  it('useEditProfilPicture fallback', async () => {
    vi.mocked(updatePictureRequest).mockRejectedValue({} as any);
    await expectFallback(() => useEditProfilPicture(1), new File([], 'a.png'));
  });

  it('useCreateConversation fallback', async () => {
    vi.mocked(createConversationRequest).mockRejectedValue({} as any);
    await expectFallback(() => useCreateConversation(), { user2Id: 1 } as any);
  });

  it('useUpdateChannelMessage fallback', async () => {
    vi.mocked(updateChannelMessageRequest).mockRejectedValue({} as any);
    await expectFallback(() => useUpdateChannelMessage('1'), {
      messageId: 1,
      content: 'x',
    });
  });

  it('useUpdatePrivateMessage fallback', async () => {
    vi.mocked(updatePrivateMessageRequest).mockRejectedValue({} as any);
    await expectFallback(() => useUpdatePrivateMessage('1'), {
      messageId: 1,
      content: 'x',
    });
  });

  it('useDeleteChannelMessage fallback', async () => {
    vi.mocked(deleteChannelMessageRequest).mockRejectedValue({} as any);
    await expectFallback(() => useDeleteChannelMessage('1'), 1);
  });

  it('useDeletePrivateMessage fallback', async () => {
    vi.mocked(deletePrivateMessageRequest).mockRejectedValue({} as any);
    await expectFallback(() => useDeletePrivateMessage('1'), 1);
  });

  it('useCreateInvitation fallback', async () => {
    vi.mocked(createInvitationRequest).mockRejectedValue({} as any);
    await expectFallback(() => useCreateInvitation(), { serverId: '1' });
  });

  it('useJoinServer fallback', async () => {
    vi.mocked(joinServerByCodeRequest).mockRejectedValue({} as any);
    await expectFallback(() => useJoinServer(), 'CODE');
  });
});
