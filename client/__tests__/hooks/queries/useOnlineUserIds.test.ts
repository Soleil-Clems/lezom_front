import { describe, it, expect } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useOnlineUserIds } from '@/hooks/queries/useOnlineUserIds';

describe('useOnlineUserIds', () => {
  it('expose data et status', async () => {
    const { result } = renderHookWithQuery(() => useOnlineUserIds());
    expect(result.current).toHaveProperty('data');
    await waitFor(() => expect(result.current.status).toBe('success'));
  });

  it('retourne un tableau vide par défaut', async () => {
    const { result } = renderHookWithQuery(() => useOnlineUserIds());
    await waitFor(() => expect(result.current.data).toEqual([]));
  });
});
