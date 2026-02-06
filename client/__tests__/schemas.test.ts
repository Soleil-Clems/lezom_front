import { describe, it, expect } from 'vitest';
import { LoginSchema } from '@/schemas/auth.dto';
import { registerSchema } from '@/schemas/register.dto';
import { createServerSchema } from '@/schemas/create-server.dto';
import { createChannelSchema } from '@/schemas/create-channel.dto';
import { channelSchema } from '@/schemas/channel.dto';
import { serversSchema } from '@/schemas/server.dto';
import { userSchema, userUpdateSchema } from '@/schemas/user.dto';
import { messageSchema, sendMessageSchema } from '@/schemas/message.dto';
import { memberSchema, membershipSchema, getMembersResponseSchema } from '@/schemas/member.dto';
import { conversationSchema, privateMessageSchema, sendPrivateMessageSchema, createConversationSchema } from '@/schemas/conversation.dto';

// ---- LoginSchema ----
describe('LoginSchema', () => {
  it('validates a correct login', () => {
    const result = LoginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password (< 8 chars)', () => {
    const result = LoginSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    expect(LoginSchema.safeParse({}).success).toBe(false);
    expect(LoginSchema.safeParse({ email: 'a@b.com' }).success).toBe(false);
    expect(LoginSchema.safeParse({ password: 'password123' }).success).toBe(false);
  });
});

// ---- registerSchema ----
describe('registerSchema', () => {
  const validData = {
    username: 'john',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    birthdate: '1990-01-01',
  };

  it('validates correct registration data', () => {
    expect(registerSchema.safeParse(validData).success).toBe(true);
  });

  it('accepts Date for birthdate', () => {
    expect(registerSchema.safeParse({ ...validData, birthdate: new Date() }).success).toBe(true);
  });

  it('rejects short username (< 3 chars)', () => {
    expect(registerSchema.safeParse({ ...validData, username: 'ab' }).success).toBe(false);
  });

  it('rejects short firstname (< 3 chars)', () => {
    expect(registerSchema.safeParse({ ...validData, firstname: 'ab' }).success).toBe(false);
  });

  it('rejects short lastname (< 3 chars)', () => {
    expect(registerSchema.safeParse({ ...validData, lastname: 'ab' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(registerSchema.safeParse({ ...validData, email: 'invalid' }).success).toBe(false);
  });

  it('rejects short password (< 6 chars)', () => {
    expect(registerSchema.safeParse({ ...validData, password: '12345' }).success).toBe(false);
  });

  it('rejects missing fields', () => {
    expect(registerSchema.safeParse({}).success).toBe(false);
  });
});

// ---- createServerSchema ----
describe('createServerSchema', () => {
  it('validates a correct server name', () => {
    expect(createServerSchema.safeParse({ name: 'My Server' }).success).toBe(true);
  });

  it('rejects empty name', () => {
    expect(createServerSchema.safeParse({ name: '' }).success).toBe(false);
  });

  it('rejects missing name', () => {
    expect(createServerSchema.safeParse({}).success).toBe(false);
  });
});

// ---- createChannelSchema ----
describe('createChannelSchema', () => {
  it('validates a correct channel', () => {
    expect(createChannelSchema.safeParse({ name: 'general', type: 'text', serverId: 1 }).success).toBe(true);
  });

  it('validates call type', () => {
    expect(createChannelSchema.safeParse({ name: 'voice', type: 'call', serverId: 1 }).success).toBe(true);
  });

  it('rejects empty name', () => {
    expect(createChannelSchema.safeParse({ name: '', type: 'text', serverId: 1 }).success).toBe(false);
  });

  it('rejects invalid type', () => {
    expect(createChannelSchema.safeParse({ name: 'test', type: 'video', serverId: 1 }).success).toBe(false);
  });

  it('rejects missing serverId', () => {
    expect(createChannelSchema.safeParse({ name: 'test', type: 'text' }).success).toBe(false);
  });
});

// ---- channelSchema ----
describe('channelSchema', () => {
  it('validates a correct channel', () => {
    expect(channelSchema.safeParse({ id: 1, name: 'general', type: 'text' }).success).toBe(true);
  });

  it('validates with call type', () => {
    expect(channelSchema.safeParse({ id: 2, name: 'voice', type: 'call' }).success).toBe(true);
  });

  it('rejects invalid type', () => {
    expect(channelSchema.safeParse({ id: 1, name: 'test', type: 'video' }).success).toBe(false);
  });

  it('rejects missing id', () => {
    expect(channelSchema.safeParse({ name: 'test', type: 'text' }).success).toBe(false);
  });
});

// ---- serversSchema ----
describe('serversSchema', () => {
  it('validates a correct server', () => {
    expect(serversSchema.safeParse({ id: 1, name: 'Server 1' }).success).toBe(true);
  });

  it('validates with optional image', () => {
    expect(serversSchema.safeParse({ id: 1, name: 'Server', image: 'https://example.com/img.png' }).success).toBe(true);
  });

  it('rejects missing name', () => {
    expect(serversSchema.safeParse({ id: 1 }).success).toBe(false);
  });
});

// ---- userSchema ----
describe('userSchema', () => {
  const validUser = {
    id: '1',
    username: 'john',
    firstname: 'John',
    lastname: 'Doe',
    description: 'Hello',
    email: 'john@example.com',
    isActive: true,
    role: 'user',
    lastSeen: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('validates a correct user', () => {
    expect(userSchema.safeParse(validUser).success).toBe(true);
  });

  it('rejects missing fields', () => {
    expect(userSchema.safeParse({}).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(userSchema.safeParse({ ...validUser, email: 'invalid' }).success).toBe(false);
  });
});

// ---- userUpdateSchema ----
describe('userUpdateSchema', () => {
  it('validates a correct update', () => {
    expect(userUpdateSchema.safeParse({
      username: 'john',
      firstname: 'John',
      lastname: 'Doe',
      isActive: true,
    }).success).toBe(true);
  });

  it('rejects missing fields', () => {
    expect(userUpdateSchema.safeParse({}).success).toBe(false);
  });
});

// ---- messageSchema ----
describe('messageSchema', () => {
  const validAuthor = {
    id: '1',
    username: 'john',
    firstname: 'John',
    lastname: 'Doe',
    description: 'Hello',
    email: 'john@example.com',
    isActive: true,
    role: 'user',
    lastSeen: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('validates a correct message with number id', () => {
    expect(messageSchema.safeParse({
      id: 1,
      content: 'Hello world',
      type: 'text',
      author: validAuthor,
    }).success).toBe(true);
  });

  it('validates a correct message with string id', () => {
    expect(messageSchema.safeParse({
      id: 'abc',
      content: 'Hello world',
      type: 'text',
      author: validAuthor,
    }).success).toBe(true);
  });

  it('validates all message types', () => {
    const types = ['img', 'text', 'file', 'pdf', 'system', 'gif', 'voice'];
    types.forEach(type => {
      expect(messageSchema.safeParse({
        id: 1,
        content: 'test',
        type,
        author: validAuthor,
      }).success).toBe(true);
    });
  });

  it('rejects invalid type', () => {
    expect(messageSchema.safeParse({
      id: 1,
      content: 'test',
      type: 'invalid',
      author: validAuthor,
    }).success).toBe(false);
  });
});

// ---- sendMessageSchema ----
describe('sendMessageSchema', () => {
  it('validates a correct send message', () => {
    expect(sendMessageSchema.safeParse({
      content: 'Hello',
      type: 'text',
      channelId: 1,
    }).success).toBe(true);
  });

  it('validates with string channelId', () => {
    expect(sendMessageSchema.safeParse({
      content: 'Hello',
      type: 'text',
      channelId: '1',
    }).success).toBe(true);
  });

  it('rejects empty content', () => {
    expect(sendMessageSchema.safeParse({
      content: '',
      type: 'text',
      channelId: 1,
    }).success).toBe(false);
  });
});

// ---- memberSchema / membershipSchema / getMembersResponseSchema ----
describe('memberSchema', () => {
  it('validates a correct member', () => {
    expect(memberSchema.safeParse({ id: 1, username: 'john' }).success).toBe(true);
  });

  it('rejects missing username', () => {
    expect(memberSchema.safeParse({ id: 1 }).success).toBe(false);
  });
});

describe('membershipSchema', () => {
  it('validates all roles', () => {
    const roles = ['server_owner', 'server_admin', 'server_moderator', 'server_member'];
    roles.forEach(role => {
      expect(membershipSchema.safeParse({
        id: 1,
        role,
        members: { id: 1, username: 'john' },
      }).success).toBe(true);
    });
  });

  it('rejects invalid role', () => {
    expect(membershipSchema.safeParse({
      id: 1,
      role: 'invalid_role',
      members: { id: 1, username: 'john' },
    }).success).toBe(false);
  });
});

describe('getMembersResponseSchema', () => {
  it('validates a correct response', () => {
    expect(getMembersResponseSchema.safeParse({
      data: [{ id: 1, role: 'server_member', members: { id: 1, username: 'john' } }],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }).success).toBe(true);
  });

  it('validates empty data array', () => {
    expect(getMembersResponseSchema.safeParse({
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }).success).toBe(true);
  });
});

// ---- conversationSchema ----
describe('conversationSchema', () => {
  const validUser = {
    id: '1',
    username: 'john',
    firstname: 'John',
    lastname: 'Doe',
    description: 'Hello',
    email: 'john@example.com',
    isActive: true,
    role: 'user',
    lastSeen: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('validates a correct conversation', () => {
    expect(conversationSchema.safeParse({
      id: 1,
      user1: validUser,
      user2: { ...validUser, id: '2', username: 'jane', email: 'jane@example.com' },
    }).success).toBe(true);
  });

  it('rejects missing user2', () => {
    expect(conversationSchema.safeParse({
      id: 1,
      user1: validUser,
    }).success).toBe(false);
  });
});

// ---- privateMessageSchema ----
describe('privateMessageSchema', () => {
  const validUser = {
    id: '1',
    username: 'john',
    firstname: 'John',
    lastname: 'Doe',
    description: 'Hello',
    email: 'john@example.com',
    isActive: true,
    role: 'user',
    lastSeen: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('validates a correct private message', () => {
    expect(privateMessageSchema.safeParse({
      id: 1,
      content: 'Hello',
      type: 'text',
      sender: validUser,
      conversation: 1,
    }).success).toBe(true);
  });

  it('rejects invalid type', () => {
    expect(privateMessageSchema.safeParse({
      id: 1,
      content: 'Hello',
      type: 'invalid',
      sender: validUser,
      conversation: 1,
    }).success).toBe(false);
  });
});

// ---- sendPrivateMessageSchema ----
describe('sendPrivateMessageSchema', () => {
  it('validates a correct send private message', () => {
    expect(sendPrivateMessageSchema.safeParse({
      content: 'Hello',
      type: 'text',
      conversationId: 1,
    }).success).toBe(true);
  });

  it('rejects empty content', () => {
    expect(sendPrivateMessageSchema.safeParse({
      content: '',
      type: 'text',
      conversationId: 1,
    }).success).toBe(false);
  });
});

// ---- createConversationSchema ----
describe('createConversationSchema', () => {
  it('validates a correct conversation creation', () => {
    expect(createConversationSchema.safeParse({ userId: 1 }).success).toBe(true);
  });

  it('rejects missing userId', () => {
    expect(createConversationSchema.safeParse({}).success).toBe(false);
  });

  it('rejects string userId', () => {
    expect(createConversationSchema.safeParse({ userId: 'abc' }).success).toBe(false);
  });
});
