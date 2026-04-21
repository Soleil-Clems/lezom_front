import { describe, it, expect } from 'vitest';
import { sendMessageSchema } from '@/schemas/message.dto';

describe('sendMessageSchema', () => {
  it('valide un message correct', () => {
    const result = sendMessageSchema.parse({ content: 'hello', type: 'text', channelId: 1 });
    expect(result.content).toBe('hello');
  });

  it('rejette un contenu vide', () => {
    expect(() => sendMessageSchema.parse({ content: '', type: 'text', channelId: 1 })).toThrow();
  });

  it('rejette un type invalide', () => {
    expect(() =>
      sendMessageSchema.parse({ content: 'hi', type: 'unknown', channelId: 1 }),
    ).toThrow();
  });

  it('accepte tous les types valides', () => {
    const types = ['img', 'text', 'file', 'pdf', 'system', 'gif', 'voice'];
    types.forEach((type) => {
      expect(() => sendMessageSchema.parse({ content: 'hi', type, channelId: 1 })).not.toThrow();
    });
  });
});
