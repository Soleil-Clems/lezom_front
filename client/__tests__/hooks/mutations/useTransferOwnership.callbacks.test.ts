import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { transferOwnershipRequest } from '@/requests/transferOwnershipRequest';
import { toast } from 'sonner';

vi.mock('@/requests/transferOwnershipRequest', () => ({
  transferOwnershipRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import { useTransferOwnership } from '@/hooks/mutations/useTransferOwnership';

describe('useTransferOwnership callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(transferOwnershipRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useTransferOwnership());
    await act(async () => {
      await result.current.mutateAsync({ serverId: '1', newOwnerId: 2 });
    });
    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Propriété transférée avec succès'),
    );
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(transferOwnershipRequest).mockRejectedValue(new Error('Non autorisé'));
    const { result } = renderHookWithQuery(() => useTransferOwnership());
    await act(async () => {
      try {
        await result.current.mutateAsync({ serverId: '1', newOwnerId: 2 });
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});
