import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHookWithClient } from '../helpers';

// Mock all request modules
vi.mock('@/requests/userRequest', () => ({
  getAuthUserRequest: vi.fn().mockResolvedValue({ id: '1', username: 'testuser' }),
  updateUserRequest: vi.fn(),
  updatePictureRequest: vi.fn(),
}));

vi.mock('@/requests/serverRequest', () => ({
  getAllServersRequest: vi.fn().mockResolvedValue([{ id: 1, name: 'Server 1' }]),
  getAllChannelsOfAServerRequest: vi.fn().mockResolvedValue([{ id: 1, name: 'general' }]),
  getServerMembersRequest: vi.fn().mockResolvedValue({
    data: [{ id: 1, role: 'server_member', members: { id: 1, username: 'john' } }],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
  }),
  serverRequest: vi.fn(),
  updateServerNameRequest: vi.fn(),
  deleteServerRequest: vi.fn(),
  updateChannelNameRequest: vi.fn(),
  deleteChannelRequest: vi.fn(),
  updateMemberRoleRequest: vi.fn(),
}));

vi.mock('@/requests/channelRequest', () => ({
  channelRequest: vi.fn(),
  getAllMessagesOfAChannelRequest: vi.fn().mockResolvedValue([{ id: 1, content: 'hello' }]),
}));

vi.mock('@/requests/banRequest', () => ({
  getBannedUsersRequest: vi.fn().mockResolvedValue([]),
  banUserRequest: vi.fn(),
  unbanUserRequest: vi.fn(),
}));

vi.mock('@/requests/conversationRequest', () => ({
  getAllConversationsRequest: vi.fn().mockResolvedValue([]),
  getConversationByIdRequest: vi.fn().mockResolvedValue({ id: 1 }),
  getConversationMessagesRequest: vi.fn().mockResolvedValue({ messages: [], total: 0 }),
  createConversationRequest: vi.fn(),
  sendPrivateMessageRequest: vi.fn(),
  updatePrivateMessageRequest: vi.fn(),
  deletePrivateMessageRequest: vi.fn(),
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
    getSocket: vi.fn(() => null),
    reconnectWithNewToken: vi.fn(),
  },
}));

import { useAuthUser } from '@/hooks/queries/useAuthUser';
import { useGetAllServers } from '@/hooks/queries/useGetAllServers';
import { useGetAllChannelsOfAServer } from '@/hooks/queries/useGetAllChannelsOfAServer';
import { useGetAllMessagesOfAChannel } from '@/hooks/queries/useGetAllMessagesOfAChannel';
import { useGetBannedUsers } from '@/hooks/queries/useGetBannedUsers';
import { useGetAllConversations } from '@/hooks/queries/useGetAllConversations';
import { useGetConversation } from '@/hooks/queries/useGetConversation';
import { useGetConversationMessages } from '@/hooks/queries/useGetConversationMessages';
import { useGetServerMembers } from '@/hooks/queries/useGetServerMembers';
import { useOnlineUserIds } from '@/hooks/queries/useOnlineUserIds';
import { getAuthUserRequest } from '@/requests/userRequest';
import { getAllServersRequest, getAllChannelsOfAServerRequest, getServerMembersRequest } from '@/requests/serverRequest';
import { getAllMessagesOfAChannelRequest } from '@/requests/channelRequest';
import { getBannedUsersRequest } from '@/requests/banRequest';
import { getAllConversationsRequest, getConversationByIdRequest, getConversationMessagesRequest } from '@/requests/conversationRequest';

describe('useAuthUser', () => {
  it('fetches authenticated user', async () => {
    const { result } = renderHookWithClient(() => useAuthUser());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAuthUserRequest).toHaveBeenCalled();
    expect(result.current.data).toEqual({ id: '1', username: 'testuser' });
  });
});

describe('useGetAllServers', () => {
  it('fetches all servers', async () => {
    const { result } = renderHookWithClient(() => useGetAllServers());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAllServersRequest).toHaveBeenCalled();
    expect(result.current.data).toEqual([{ id: 1, name: 'Server 1' }]);
  });
});

describe('useGetAllChannelsOfAServer', () => {
  it('fetches channels for a server', async () => {
    const { result } = renderHookWithClient(() => useGetAllChannelsOfAServer('1'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAllChannelsOfAServerRequest).toHaveBeenCalledWith('1');
  });
});

describe('useGetAllMessagesOfAChannel', () => {
  it('fetches messages for a channel', async () => {
    const { result } = renderHookWithClient(() => useGetAllMessagesOfAChannel('1'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAllMessagesOfAChannelRequest).toHaveBeenCalledWith('1');
  });
});

describe('useGetBannedUsers', () => {
  it('fetches banned users for a server', async () => {
    const { result } = renderHookWithClient(() => useGetBannedUsers(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getBannedUsersRequest).toHaveBeenCalledWith(1);
  });

  it('does not fetch when serverId is falsy', () => {
    const { result } = renderHookWithClient(() => useGetBannedUsers(0));
    expect(result.current.isFetching).toBe(false);
  });
});

describe('useGetAllConversations', () => {
  it('fetches all conversations', async () => {
    const { result } = renderHookWithClient(() => useGetAllConversations());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAllConversationsRequest).toHaveBeenCalled();
  });
});

describe('useGetConversation', () => {
  it('fetches a conversation by id', async () => {
    const { result } = renderHookWithClient(() => useGetConversation('1'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getConversationByIdRequest).toHaveBeenCalledWith(1);
  });

  it('does not fetch when conversationId is undefined', () => {
    const { result } = renderHookWithClient(() => useGetConversation(undefined));
    expect(result.current.isFetching).toBe(false);
  });
});

describe('useGetConversationMessages', () => {
  it('fetches conversation messages', async () => {
    const { result } = renderHookWithClient(() => useGetConversationMessages('1'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getConversationMessagesRequest).toHaveBeenCalledWith(1, 1, 50);
  });

  it('does not fetch when conversationId is undefined', () => {
    const { result } = renderHookWithClient(() => useGetConversationMessages(undefined));
    expect(result.current.isFetching).toBe(false);
  });
});

describe('useGetServerMembers', () => {
  it('fetches server members', async () => {
    const { result } = renderHookWithClient(() => useGetServerMembers(1, { page: 1 }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getServerMembersRequest).toHaveBeenCalledWith(1, { page: 1 });
  });

  it('does not fetch when serverId is falsy', () => {
    const { result } = renderHookWithClient(() => useGetServerMembers(0));
    expect(result.current.isFetching).toBe(false);
  });
});

describe('useOnlineUserIds', () => {
  it('returns empty array by default', async () => {
    const { result } = renderHookWithClient(() => useOnlineUserIds());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
