import { describe, it, expect } from 'vitest';
import {
  conversationSchema,
  privateMessageSchema,
  sendPrivateMessageSchema,
  createConversationSchema,
} from '@/schemas/conversation.dto';

const validUser = {
  id: 1,
  username: 'alice',
  firstname: 'Alice',
  lastname: 'Smith',
  description: '',
  email: 'alice@example.com',
  isActive: true,
  isTwoFactorEnabled: false,
  role: 'user',
  lastSeen: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('conversationSchema', () => {
  it('valide un objet conversation minimal', () => {
    const data = { id: 1, user1: validUser, user2: { ...validUser, id: 2, username: 'bob' } };
    expect(() => conversationSchema.parse(data)).not.toThrow();
  });

  it('rejette sans id', () => {
    expect(() => conversationSchema.parse({ user1: validUser, user2: validUser })).toThrow();
  });

  it('accepte createdAt/updatedAt optionnels', () => {
    const data = {
      id: 1,
      user1: validUser,
      user2: { ...validUser, id: 2 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => conversationSchema.parse(data)).not.toThrow();
  });
});

describe('privateMessageSchema', () => {
  it('valide un message privé valide', () => {
    const data = {
      id: 1,
      content: 'hello',
      type: 'text',
      sender: validUser,
      conversation: 42,
    };
    expect(() => privateMessageSchema.parse(data)).not.toThrow();
  });

  it('rejette un type invalide', () => {
    const data = {
      id: 1,
      content: 'hello',
      type: 'invalid',
      sender: validUser,
      conversation: 42,
    };
    expect(() => privateMessageSchema.parse(data)).toThrow();
  });

  it('accepte reactions optionnel', () => {
    const data = {
      id: 1,
      content: 'hello',
      type: 'img',
      sender: validUser,
      conversation: 42,
      reactions: [],
    };
    expect(() => privateMessageSchema.parse(data)).not.toThrow();
  });
});

describe('sendPrivateMessageSchema', () => {
  it('valide les données minimales', () => {
    const data = { content: 'msg', type: 'text', conversationId: 1 };
    expect(() => sendPrivateMessageSchema.parse(data)).not.toThrow();
  });

  it('rejette content vide', () => {
    const data = { content: '', type: 'text', conversationId: 1 };
    expect(() => sendPrivateMessageSchema.parse(data)).toThrow();
  });

  it('rejette sans conversationId', () => {
    expect(() => sendPrivateMessageSchema.parse({ content: 'msg', type: 'text' })).toThrow();
  });
});

describe('createConversationSchema', () => {
  it('valide un userId valide', () => {
    expect(() => createConversationSchema.parse({ userId: 5 })).not.toThrow();
  });

  it('rejette sans userId', () => {
    expect(() => createConversationSchema.parse({})).toThrow();
  });

  it('rejette un userId non numérique', () => {
    expect(() => createConversationSchema.parse({ userId: 'abc' })).toThrow();
  });
});
