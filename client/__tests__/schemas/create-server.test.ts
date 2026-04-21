import { describe, it, expect } from 'vitest';
import { createServerSchema } from '@/schemas/create-server.dto';

describe('createServerSchema', () => {
  it('valide un nom valide', () => {
    expect(() => createServerSchema.parse({ name: 'Mon Serveur' })).not.toThrow();
  });

  it('rejette un nom vide', () => {
    expect(() => createServerSchema.parse({ name: '' })).toThrow();
  });

  it('rejette sans champ name', () => {
    expect(() => createServerSchema.parse({})).toThrow();
  });
});
