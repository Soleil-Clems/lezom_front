import { describe, it, expect } from 'vitest';
import { userUpdateSchema } from '@/schemas/user.dto';

describe('userUpdateSchema', () => {
  it('accepte un objet vide (tout optionnel)', () => {
    expect(() => userUpdateSchema.parse({})).not.toThrow();
  });

  it('accepte une mise à jour partielle', () => {
    const result = userUpdateSchema.parse({ username: 'newname' });
    expect(result.username).toBe('newname');
  });

  it('accepte toutes les propriétés', () => {
    const result = userUpdateSchema.parse({
      username: 'alex',
      firstname: 'Alexandre',
      lastname: 'Dupont',
      isActive: true,
      isTwoFactorEnabled: false,
    });
    expect(result.username).toBe('alex');
    expect(result.isActive).toBe(true);
  });
});
