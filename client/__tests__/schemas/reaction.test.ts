import { describe, it, expect } from 'vitest';
import { reactionSchema } from '@/schemas/reaction.dto';

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

describe('reactionSchema', () => {
  it('valide une réaction avec id numérique', () => {
    const data = { id: 1, emoji: '👍', author: validUser };
    expect(() => reactionSchema.parse(data)).not.toThrow();
  });

  it('valide une réaction avec id string', () => {
    const data = { id: 'abc123', emoji: '❤️', author: validUser };
    expect(() => reactionSchema.parse(data)).not.toThrow();
  });

  it('rejette sans emoji', () => {
    expect(() => reactionSchema.parse({ id: 1, author: validUser })).toThrow();
  });

  it('rejette sans author', () => {
    expect(() => reactionSchema.parse({ id: 1, emoji: '👍' })).toThrow();
  });

  it('rejette sans id', () => {
    expect(() => reactionSchema.parse({ emoji: '👍', author: validUser })).toThrow();
  });
});
