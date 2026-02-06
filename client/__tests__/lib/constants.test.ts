import { describe, it, expect } from 'vitest';
import { gifApiKey, gifClientKey } from '@/lib/constants';

describe('constants', () => {
  it('exports gifApiKey as string', () => {
    expect(typeof gifApiKey).toBe('string');
  });

  it('exports gifClientKey as string', () => {
    expect(typeof gifClientKey).toBe('string');
  });
});
