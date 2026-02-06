import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/customFetch', () => {
  const mockFetch = {
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockResolvedValue({}),
    put: vi.fn().mockResolvedValue({}),
    patch: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  };
  return { customfetch: mockFetch, default: mockFetch };
});

import customfetch from '@/lib/customFetch';
import { loginRequest, registerRequest } from '@/requests/authRequest';
import { getBannedUsersRequest, banUserRequest, unbanUserRequest } from '@/requests/banRequest';
import { channelRequest, getAllMessagesOfAChannelRequest } from '@/requests/channelRequest';
import {
  createConversationRequest,
  getAllConversationsRequest,
  getConversationByIdRequest,
  getConversationMessagesRequest,
  sendPrivateMessageRequest,
  updatePrivateMessageRequest,
  deletePrivateMessageRequest,
} from '@/requests/conversationRequest';
import { createInvitationRequest, joinServerByCodeRequest } from '@/requests/invitationRequest';
import { leaveServerRequest } from '@/requests/leaveServerRequest';
import { sendMessageRequest, updateChannelMessageRequest, deleteChannelMessageRequest } from '@/requests/messageRequest';
import {
  serverRequest,
  getAllServersRequest,
  getAllChannelsOfAServerRequest,
  updateServerNameRequest,
  deleteServerRequest,
  updateChannelNameRequest,
  deleteChannelRequest,
  updateMemberRoleRequest,
  getServerMembersRequest,
} from '@/requests/serverRequest';
import { transferOwnershipRequest } from '@/requests/transferOwnershipRequest';
import { getAuthUserRequest, updateUserRequest, updatePictureRequest } from '@/requests/userRequest';

beforeEach(() => vi.clearAllMocks());

describe('Auth Requests', () => {
  it('loginRequest calls POST auth/login', async () => {
    await loginRequest({ email: 'a@b.com', password: 'pass1234' });
    expect(customfetch.post).toHaveBeenCalledWith('auth/login', { email: 'a@b.com', password: 'pass1234' });
  });

  it('registerRequest calls POST users', async () => {
    const body = { username: 'john', firstname: 'John', lastname: 'Doe', email: 'j@d.com', password: 'pass123456', birthdate: '1990-01-01' };
    await registerRequest(body);
    expect(customfetch.post).toHaveBeenCalledWith('users', body);
  });

  it('loginRequest propagates errors', async () => {
    vi.mocked(customfetch.post).mockRejectedValueOnce(new Error('Invalid credentials'));
    await expect(loginRequest({ email: 'a@b.com', password: 'pass1234' })).rejects.toThrow('Invalid credentials');
  });
});

describe('Ban Requests', () => {
  it('getBannedUsersRequest calls GET', async () => {
    await getBannedUsersRequest(1);
    expect(customfetch.get).toHaveBeenCalledWith('servers/1/bans');
  });

  it('banUserRequest calls POST with body', async () => {
    await banUserRequest(1, 2, 'spam');
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/bans', { userId: 2, reason: 'spam' });
  });

  it('unbanUserRequest calls DELETE', async () => {
    await unbanUserRequest(1, 2);
    expect(customfetch.delete).toHaveBeenCalledWith('servers/1/bans/2');
  });
});

describe('Channel Requests', () => {
  it('channelRequest calls POST channels', async () => {
    await channelRequest({ name: 'general', type: 'text', serverId: 1 });
    expect(customfetch.post).toHaveBeenCalledWith('channels', { name: 'general', type: 'text', serverId: 1 });
  });

  it('getAllMessagesOfAChannelRequest calls GET', async () => {
    await getAllMessagesOfAChannelRequest(5);
    expect(customfetch.get).toHaveBeenCalledWith('messages/channel/5');
  });
});

describe('Conversation Requests', () => {
  it('createConversationRequest calls POST', async () => {
    await createConversationRequest({ userId: 2 });
    expect(customfetch.post).toHaveBeenCalledWith('conversations', { userId: 2 });
  });

  it('getAllConversationsRequest calls GET', async () => {
    await getAllConversationsRequest();
    expect(customfetch.get).toHaveBeenCalledWith('conversations');
  });

  it('getConversationByIdRequest calls GET with id', async () => {
    await getConversationByIdRequest(3);
    expect(customfetch.get).toHaveBeenCalledWith('conversations/3');
  });

  it('getConversationMessagesRequest calls GET with pagination', async () => {
    await getConversationMessagesRequest(3, 2, 25);
    expect(customfetch.get).toHaveBeenCalledWith('conversations/3/messages?page=2&limit=25');
  });

  it('getConversationMessagesRequest uses default pagination', async () => {
    await getConversationMessagesRequest(3);
    expect(customfetch.get).toHaveBeenCalledWith('conversations/3/messages?page=1&limit=50');
  });

  it('sendPrivateMessageRequest calls POST', async () => {
    await sendPrivateMessageRequest(1, { content: 'hello', type: 'text' });
    expect(customfetch.post).toHaveBeenCalledWith('conversations/1/messages', { content: 'hello', type: 'text' });
  });

  it('updatePrivateMessageRequest calls PATCH', async () => {
    await updatePrivateMessageRequest(5, { content: 'edited' });
    expect(customfetch.patch).toHaveBeenCalledWith('conversations/messages/5', { content: 'edited' });
  });

  it('deletePrivateMessageRequest calls DELETE', async () => {
    await deletePrivateMessageRequest(5);
    expect(customfetch.delete).toHaveBeenCalledWith('conversations/messages/5');
  });
});

describe('Invitation Requests', () => {
  it('createInvitationRequest calls POST', async () => {
    await createInvitationRequest(1, { maxUses: 10, expiresIn: 3600 });
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/invitations', { maxUses: 10, expiresIn: 3600 });
  });

  it('joinServerByCodeRequest calls POST', async () => {
    await joinServerByCodeRequest('ABC123');
    expect(customfetch.post).toHaveBeenCalledWith('servers/join/ABC123');
  });
});

describe('Leave Server Request', () => {
  it('leaveServerRequest calls POST without newOwnerId', async () => {
    await leaveServerRequest(1);
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/leave', {});
  });

  it('leaveServerRequest calls POST with newOwnerId', async () => {
    await leaveServerRequest(1, 5);
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/leave', { newOwnerId: 5 });
  });
});

describe('Message Requests', () => {
  it('sendMessageRequest calls POST messages', async () => {
    await sendMessageRequest({ content: 'hi', type: 'text', channelId: 1 });
    expect(customfetch.post).toHaveBeenCalledWith('messages', { content: 'hi', type: 'text', channelId: 1 });
  });

  it('updateChannelMessageRequest calls PATCH', async () => {
    await updateChannelMessageRequest(10, { content: 'edited' });
    expect(customfetch.patch).toHaveBeenCalledWith('messages/10', { content: 'edited' });
  });

  it('deleteChannelMessageRequest calls DELETE', async () => {
    await deleteChannelMessageRequest(10);
    expect(customfetch.delete).toHaveBeenCalledWith('messages/10');
  });
});

describe('Server Requests', () => {
  it('serverRequest calls POST servers', async () => {
    await serverRequest({ name: 'My Server' });
    expect(customfetch.post).toHaveBeenCalledWith('servers', { name: 'My Server' });
  });

  it('getAllServersRequest calls GET servers', async () => {
    await getAllServersRequest();
    expect(customfetch.get).toHaveBeenCalledWith('servers');
  });

  it('getAllChannelsOfAServerRequest calls GET', async () => {
    await getAllChannelsOfAServerRequest(1);
    expect(customfetch.get).toHaveBeenCalledWith('channels/server/1');
  });

  it('updateServerNameRequest calls PATCH', async () => {
    await updateServerNameRequest(1, 'New Name');
    expect(customfetch.patch).toHaveBeenCalledWith('servers/1', { name: 'New Name' });
  });

  it('deleteServerRequest calls DELETE', async () => {
    await deleteServerRequest(1);
    expect(customfetch.delete).toHaveBeenCalledWith('servers/1');
  });

  it('updateChannelNameRequest calls PATCH', async () => {
    await updateChannelNameRequest(5, 'renamed');
    expect(customfetch.patch).toHaveBeenCalledWith('channels/5', { name: 'renamed' });
  });

  it('deleteChannelRequest calls DELETE', async () => {
    await deleteChannelRequest(5);
    expect(customfetch.delete).toHaveBeenCalledWith('channels/5');
  });

  it('updateMemberRoleRequest calls PATCH', async () => {
    await updateMemberRoleRequest(1, 2, 'server_admin');
    expect(customfetch.patch).toHaveBeenCalledWith('servers/1/members/role', { memberId: 2, role: 'server_admin' });
  });

  it('getServerMembersRequest calls GET with params', async () => {
    await getServerMembersRequest(1, { page: 2, limit: 10, search: 'john' });
    expect(customfetch.get).toHaveBeenCalledWith('servers/1/members?page=2&limit=10&search=john');
  });

  it('getServerMembersRequest calls GET without params', async () => {
    await getServerMembersRequest(1);
    expect(customfetch.get).toHaveBeenCalledWith('servers/1/members');
  });
});

describe('Transfer Ownership Request', () => {
  it('transferOwnershipRequest calls POST', async () => {
    await transferOwnershipRequest(1, 5);
    expect(customfetch.post).toHaveBeenCalledWith('servers/1/transfer-ownership', { newOwnerId: 5 });
  });
});

describe('User Requests', () => {
  it('getAuthUserRequest calls GET auth/me', async () => {
    await getAuthUserRequest();
    expect(customfetch.get).toHaveBeenCalledWith('auth/me');
  });

  it('updateUserRequest calls PATCH', async () => {
    const body = { username: 'new', firstname: 'F', lastname: 'L', isActive: true };
    await updateUserRequest('1', body);
    expect(customfetch.patch).toHaveBeenCalledWith('users/1', body);
  });

  it('updatePictureRequest sends FormData', async () => {
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    await updatePictureRequest('1', file);
    expect(customfetch.patch).toHaveBeenCalledWith('users/picture/1', expect.any(FormData));
  });
});
