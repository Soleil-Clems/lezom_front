import { describe, it, expect } from 'vitest';
import { createChannelSchema } from '@/schemas/create-channel.dto';

describe('createChannelSchema', () => {
  it('valide les données minimales', () => {
    expect(() =>
      createChannelSchema.parse({ name: 'general', type: 'text', serverId: 1 }),
    ).not.toThrow();
  });

  it('valide type call', () => {
    expect(() =>
      createChannelSchema.parse({ name: 'voice', type: 'call', serverId: 2 }),
    ).not.toThrow();
  });

  it('rejette name vide', () => {
    expect(() => createChannelSchema.parse({ name: '', type: 'text', serverId: 1 })).toThrow();
  });

  it('rejette type invalide', () => {
    expect(() => createChannelSchema.parse({ name: 'test', type: 'video', serverId: 1 })).toThrow();
  });

  it('rejette sans serverId', () => {
    expect(() => createChannelSchema.parse({ name: 'test', type: 'text' })).toThrow();
  });
});
