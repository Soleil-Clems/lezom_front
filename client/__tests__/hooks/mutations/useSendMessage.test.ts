import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';

let socket: any;
vi.mock('@/lib/socket', () => ({
  socketManager: {
    getSocket: () => socket,
  },
}));

const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: { error: (...a: any[]) => toastError(...a), success: vi.fn() },
}));

import { useSendMessage } from '@/hooks/mutations/useSendMessage';

describe('useSendMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {});

  it('reject si pas de socket connecté', async () => {
    socket = null;
    const { result } = renderHookWithQuery(() => useSendMessage());
    let caught: Error | undefined;
    await act(async () => {
      try {
        await result.current.mutateAsync({ content: 'hi' } as any);
      } catch (e) {
        caught = e as Error;
      }
    });
    expect(caught?.message).toMatch(/déconnecté/);
  });

  it('resolve avec la réponse serveur', async () => {
    socket = {
      connected: true,
      emit: (event: string, _data: any, cb: any) => {
        cb({ id: 1, content: 'hi' });
      },
    };
    const { result } = renderHookWithQuery(() => useSendMessage());
    await act(async () => {
      const r = await result.current.mutateAsync({ content: 'hi' } as any);
      expect(r).toEqual({ id: 1, content: 'hi' });
    });
  });

  it('reject si le serveur retourne une erreur', async () => {
    socket = {
      connected: true,
      emit: (_e: string, _d: any, cb: any) => cb({ error: 'fail' }),
    };
    const { result } = renderHookWithQuery(() => useSendMessage());
    await act(async () => {
      await expect(result.current.mutateAsync({ content: 'hi' } as any)).rejects.toThrow('fail');
    });
    await waitFor(() => expect(toastError).toHaveBeenCalledWith('fail'));
  });
});
