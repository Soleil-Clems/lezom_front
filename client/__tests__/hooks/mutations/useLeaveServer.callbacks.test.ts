import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { leaveServerRequest } from '@/requests/leaveServerRequest';
import { toast } from 'sonner';

vi.mock('@/requests/leaveServerRequest', () => ({
  leaveServerRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { useLeaveServer } from '@/hooks/mutations/useLeaveServer';

describe('useLeaveServer callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(leaveServerRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useLeaveServer());
    await act(async () => {
      await result.current.mutateAsync({ serverId: '1' });
    });
    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Vous avez quitté le serveur'),
    );
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(leaveServerRequest).mockRejectedValue(new Error('Interdit'));
    const { result } = renderHookWithQuery(() => useLeaveServer());
    await act(async () => {
      try {
        await result.current.mutateAsync({ serverId: '1' });
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});
