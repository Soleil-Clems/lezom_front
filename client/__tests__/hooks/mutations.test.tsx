import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import { renderHookWithClient } from '../helpers';
import { toast } from 'sonner';

// Mock all request modules
vi.mock('@/requests/authRequest', () => ({
  loginRequest: vi.fn().mockResolvedValue({ access_token: 'token123' }),
  registerRequest: vi.fn().mockResolvedValue({ id: 1 }),
}));

vi.mock('@/requests/serverRequest', () => ({
  serverRequest: vi.fn().mockResolvedValue({ id: 1, name: 'Server' }),
  getAllServersRequest: vi.fn(),
  getAllChannelsOfAServerRequest: vi.fn(),
  updateServerNameRequest: vi.fn().mockResolvedValue({}),
  deleteServerRequest: vi.fn().mockResolvedValue({}),
  updateChannelNameRequest: vi.fn().mockResolvedValue({}),
  deleteChannelRequest: vi.fn().mockResolvedValue({}),
  updateMemberRoleRequest: vi.fn().mockResolvedValue({}),
  getServerMembersRequest: vi.fn(),
}));

vi.mock('@/requests/channelRequest', () => ({
  channelRequest: vi.fn().mockResolvedValue({ id: 1, name: 'general' }),
  getAllMessagesOfAChannelRequest: vi.fn(),
}));

vi.mock('@/requests/messageRequest', () => ({
  sendMessageRequest: vi.fn().mockResolvedValue({ id: 1 }),
  updateChannelMessageRequest: vi.fn().mockResolvedValue({}),
  deleteChannelMessageRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/requests/conversationRequest', () => ({
  createConversationRequest: vi.fn().mockResolvedValue({ id: 1 }),
  sendPrivateMessageRequest: vi.fn().mockResolvedValue({}),
  updatePrivateMessageRequest: vi.fn().mockResolvedValue({}),
  deletePrivateMessageRequest: vi.fn().mockResolvedValue({}),
  getAllConversationsRequest: vi.fn(),
  getConversationByIdRequest: vi.fn(),
  getConversationMessagesRequest: vi.fn(),
}));

vi.mock('@/requests/banRequest', () => ({
  banUserRequest: vi.fn().mockResolvedValue({}),
  unbanUserRequest: vi.fn().mockResolvedValue({}),
  getBannedUsersRequest: vi.fn(),
}));

vi.mock('@/requests/invitationRequest', () => ({
  createInvitationRequest: vi.fn().mockResolvedValue({ code: 'ABC' }),
  joinServerByCodeRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/requests/leaveServerRequest', () => ({
  leaveServerRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/requests/transferOwnershipRequest', () => ({
  transferOwnershipRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/requests/userRequest', () => ({
  getAuthUserRequest: vi.fn(),
  updateUserRequest: vi.fn().mockResolvedValue({}),
  updatePictureRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/lib/customFetch', () => ({
  customfetch: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

vi.mock('@/store/authStore', () => ({
  default: Object.assign(vi.fn((selector: any) => selector ? selector({ token: 'test' }) : { token: 'test' }), {
    getState: vi.fn(() => ({ token: 'test', setToken: vi.fn(), logout: vi.fn() })),
  }),
}));

vi.mock('@/lib/socket', () => ({
  socketManager: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getSocket: vi.fn(() => ({ connected: true, emit: vi.fn() })),
    reconnectWithNewToken: vi.fn(),
  },
}));

import { loginRequest, registerRequest } from '@/requests/authRequest';
import { serverRequest, updateServerNameRequest, deleteServerRequest, updateChannelNameRequest, deleteChannelRequest, updateMemberRoleRequest } from '@/requests/serverRequest';
import { channelRequest } from '@/requests/channelRequest';
import { updateChannelMessageRequest, deleteChannelMessageRequest } from '@/requests/messageRequest';
import { createConversationRequest, updatePrivateMessageRequest, deletePrivateMessageRequest } from '@/requests/conversationRequest';
import { banUserRequest, unbanUserRequest } from '@/requests/banRequest';
import { createInvitationRequest, joinServerByCodeRequest } from '@/requests/invitationRequest';
import { leaveServerRequest } from '@/requests/leaveServerRequest';
import { transferOwnershipRequest } from '@/requests/transferOwnershipRequest';
import { updateUserRequest, updatePictureRequest } from '@/requests/userRequest';

import { useLogin } from '@/hooks/mutations/useLogin';
import { useRegister } from '@/hooks/mutations/useRegister';
import { useCreateServer } from '@/hooks/mutations/useCreateServer';
import { useCreateChannel } from '@/hooks/mutations/useCreateChannel';
import { useBanUser, useUnbanUser } from '@/hooks/mutations/useBanManagement';
import { useCreateInvitation, useJoinServer } from '@/hooks/mutations/useInvitation';
import { useLeaveServer } from '@/hooks/mutations/useLeaveServer';
import { useTransferOwnership } from '@/hooks/mutations/useTransferOwnership';
import { useEditProfil } from '@/hooks/mutations/useEditProfil';
import { useEditProfilPicture } from '@/hooks/mutations/useEditProfilPicture';
import { useUpdateChannelMessage } from '@/hooks/mutations/useUpdateChannelMessage';
import { useDeleteChannelMessage } from '@/hooks/mutations/useDeleteChannelMessage';
import { useUpdatePrivateMessage } from '@/hooks/mutations/useUpdatePrivateMessage';
import { useDeletePrivateMessage } from '@/hooks/mutations/useDeletePrivateMessage';
import { useCreateConversation } from '@/hooks/mutations/useCreateConversation';
import { useSendMessage } from '@/hooks/mutations/useSendMessage';
import { useSendPrivateMessage } from '@/hooks/mutations/useSendPrivateMessage';
import { useUpdateServer, useDeleteServer, useUpdateChannel, useDeleteChannel, useUpdateMemberRole } from '@/hooks/mutations/updateServerSettings';
import { socketManager } from '@/lib/socket';

beforeEach(() => {
  vi.clearAllMocks();
});

// ---- Auth Mutations ----
describe('useLogin', () => {
  it('calls loginRequest on mutate', async () => {
    const { result } = renderHookWithClient(() => useLogin());

    await act(async () => {
      result.current.mutate({ email: 'a@b.com', password: 'pass1234' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(loginRequest).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass1234' }, expect.anything());
  });

  it('shows toast on error', async () => {
    (loginRequest as any).mockRejectedValueOnce(new Error('Invalid'));
    const { result } = renderHookWithClient(() => useLogin());

    await act(async () => {
      result.current.mutate({ email: 'a@b.com', password: 'pass1234' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Invalid');
  });
});

describe('useRegister', () => {
  it('calls registerRequest on mutate', async () => {
    const body = { username: 'john', firstname: 'John', lastname: 'Doe', email: 'j@d.com', password: 'pass1234', birthdate: '1990-01-01' };
    const { result } = renderHookWithClient(() => useRegister());

    await act(async () => {
      result.current.mutate(body);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(registerRequest).toHaveBeenCalledWith(body, expect.anything());
  });
});

// ---- Server Mutations ----
describe('useCreateServer', () => {
  it('calls serverRequest', async () => {
    const { result } = renderHookWithClient(() => useCreateServer());

    await act(async () => {
      result.current.mutate({ name: 'My Server' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(serverRequest).toHaveBeenCalledWith({ name: 'My Server' }, expect.anything());
  });
});

describe('useCreateChannel', () => {
  it('calls channelRequest', async () => {
    const { result } = renderHookWithClient(() => useCreateChannel());

    await act(async () => {
      result.current.mutate({ name: 'general', type: 'text', serverId: 1 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(channelRequest).toHaveBeenCalledWith({ name: 'general', type: 'text', serverId: 1 }, expect.anything());
  });
});

// ---- Server Settings Mutations ----
describe('useUpdateServer', () => {
  it('calls updateServerNameRequest', async () => {
    const { result } = renderHookWithClient(() => useUpdateServer());
    await act(async () => { result.current.mutate({ id: 1, name: 'New' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateServerNameRequest).toHaveBeenCalledWith(1, 'New');
  });
});

describe('useDeleteServer', () => {
  it('calls deleteServerRequest', async () => {
    const { result } = renderHookWithClient(() => useDeleteServer());
    await act(async () => { result.current.mutate(1); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteServerRequest).toHaveBeenCalledWith(1);
  });
});

describe('useUpdateChannel', () => {
  it('calls updateChannelNameRequest', async () => {
    const { result } = renderHookWithClient(() => useUpdateChannel());
    await act(async () => { result.current.mutate({ id: 5, name: 'renamed' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateChannelNameRequest).toHaveBeenCalledWith(5, 'renamed');
  });
});

describe('useDeleteChannel', () => {
  it('calls deleteChannelRequest', async () => {
    const { result } = renderHookWithClient(() => useDeleteChannel());
    await act(async () => { result.current.mutate(5); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteChannelRequest).toHaveBeenCalledWith(5);
  });
});

describe('useUpdateMemberRole', () => {
  it('calls updateMemberRoleRequest', async () => {
    const { result } = renderHookWithClient(() => useUpdateMemberRole());
    await act(async () => { result.current.mutate({ serverId: 1, memberId: 2, role: 'server_admin' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateMemberRoleRequest).toHaveBeenCalledWith(1, 2, 'server_admin');
  });
});

// ---- Ban Mutations ----
describe('useBanUser', () => {
  it('calls banUserRequest', async () => {
    const { result } = renderHookWithClient(() => useBanUser());
    await act(async () => { result.current.mutate({ serverId: 1, userId: 2, reason: 'spam' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(banUserRequest).toHaveBeenCalledWith(1, 2, 'spam');
  });
});

describe('useUnbanUser', () => {
  it('calls unbanUserRequest', async () => {
    const { result } = renderHookWithClient(() => useUnbanUser());
    await act(async () => { result.current.mutate({ serverId: 1, userId: 2 }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(unbanUserRequest).toHaveBeenCalledWith(1, 2);
  });
});

// ---- Invitation Mutations ----
describe('useCreateInvitation', () => {
  it('calls createInvitationRequest', async () => {
    const { result } = renderHookWithClient(() => useCreateInvitation());
    await act(async () => { result.current.mutate({ serverId: 1, params: { maxUses: 10 } }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createInvitationRequest).toHaveBeenCalledWith(1, { maxUses: 10 });
  });
});

describe('useJoinServer', () => {
  it('calls joinServerByCodeRequest', async () => {
    const { result } = renderHookWithClient(() => useJoinServer());
    await act(async () => { result.current.mutate('ABC123'); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(joinServerByCodeRequest).toHaveBeenCalledWith('ABC123');
  });
});

// ---- Leave / Transfer ----
describe('useLeaveServer', () => {
  it('calls leaveServerRequest', async () => {
    const { result } = renderHookWithClient(() => useLeaveServer());
    await act(async () => { result.current.mutate({ serverId: 1 }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(leaveServerRequest).toHaveBeenCalledWith(1, undefined);
  });
});

describe('useTransferOwnership', () => {
  it('calls transferOwnershipRequest', async () => {
    const { result } = renderHookWithClient(() => useTransferOwnership());
    await act(async () => { result.current.mutate({ serverId: 1, newOwnerId: 5 }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(transferOwnershipRequest).toHaveBeenCalledWith(1, 5);
  });
});

// ---- User Mutations ----
describe('useEditProfil', () => {
  it('calls updateUserRequest', async () => {
    const { result } = renderHookWithClient(() => useEditProfil('1'));
    await act(async () => { result.current.mutate({ username: 'new', firstname: 'F', lastname: 'L', isActive: true }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateUserRequest).toHaveBeenCalledWith('1', { username: 'new', firstname: 'F', lastname: 'L', isActive: true });
  });
});

describe('useEditProfilPicture', () => {
  it('calls updatePictureRequest', async () => {
    const file = new File(['test'], 'photo.jpg');
    const { result } = renderHookWithClient(() => useEditProfilPicture(1));
    await act(async () => { result.current.mutate(file); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updatePictureRequest).toHaveBeenCalledWith('1', file);
  });
});

// ---- Message Mutations ----
describe('useUpdateChannelMessage', () => {
  it('calls updateChannelMessageRequest', async () => {
    const { result } = renderHookWithClient(() => useUpdateChannelMessage('1'));
    await act(async () => { result.current.mutate({ messageId: 10, content: 'edited' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateChannelMessageRequest).toHaveBeenCalledWith(10, { content: 'edited' });
  });
});

describe('useDeleteChannelMessage', () => {
  it('calls deleteChannelMessageRequest', async () => {
    const { result } = renderHookWithClient(() => useDeleteChannelMessage('1'));
    await act(async () => { result.current.mutate(10); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteChannelMessageRequest).toHaveBeenCalledWith(10);
  });
});

describe('useUpdatePrivateMessage', () => {
  it('calls updatePrivateMessageRequest', async () => {
    const { result } = renderHookWithClient(() => useUpdatePrivateMessage('1'));
    await act(async () => { result.current.mutate({ messageId: 5, content: 'edited' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updatePrivateMessageRequest).toHaveBeenCalledWith(5, { content: 'edited' });
  });
});

describe('useDeletePrivateMessage', () => {
  it('calls deletePrivateMessageRequest', async () => {
    const { result } = renderHookWithClient(() => useDeletePrivateMessage('1'));
    await act(async () => { result.current.mutate(5); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deletePrivateMessageRequest).toHaveBeenCalledWith(5);
  });
});

describe('useCreateConversation', () => {
  it('calls createConversationRequest', async () => {
    const { result } = renderHookWithClient(() => useCreateConversation());
    await act(async () => { result.current.mutate({ userId: 2 }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createConversationRequest).toHaveBeenCalledWith({ userId: 2 });
  });
});

// ---- Socket-based Message Mutations ----
describe('useSendMessage', () => {
  it('emits createMessage via socket', async () => {
    const mockEmit = vi.fn((_event: string, _data: any, cb: Function) => cb({ id: 1, channelId: '1' }));
    vi.mocked(socketManager.getSocket).mockReturnValue({ connected: true, emit: mockEmit } as any);

    const { result } = renderHookWithClient(() => useSendMessage());

    await act(async () => {
      result.current.mutate({ content: 'hello', type: 'text', channelId: 1 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEmit).toHaveBeenCalledWith('createMessage', { content: 'hello', type: 'text', channelId: 1 }, expect.any(Function));
  });

  it('rejects when socket is disconnected', async () => {
    vi.mocked(socketManager.getSocket).mockReturnValue(null);

    const { result } = renderHookWithClient(() => useSendMessage());

    await act(async () => {
      result.current.mutate({ content: 'hello', type: 'text', channelId: 1 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useSendPrivateMessage', () => {
  it('emits sendPrivateMessage via socket', async () => {
    const mockEmit = vi.fn();
    vi.mocked(socketManager.emit).mockImplementation((_event: string, _data: any, cb?: Function) => {
      if (cb) cb({ id: 1 });
    });

    const { result } = renderHookWithClient(() => useSendPrivateMessage('1'));

    await act(async () => {
      result.current.mutate({ content: 'hi', type: 'text' as const });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(socketManager.emit).toHaveBeenCalledWith('sendPrivateMessage', expect.objectContaining({ content: 'hi', conversationId: 1 }), expect.any(Function));
  });
});
