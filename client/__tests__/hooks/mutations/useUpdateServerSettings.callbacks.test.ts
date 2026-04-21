import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import {
  updateServerNameRequest,
  deleteServerRequest,
  updateChannelNameRequest,
  deleteChannelRequest,
  updateMemberRoleRequest,
} from '@/requests/serverRequest';
import { toast } from 'sonner';

vi.mock('@/requests/serverRequest', () => ({
  serverRequest: vi.fn(),
  getAllServersRequest: vi.fn(),
  updateServerNameRequest: vi.fn(),
  deleteServerRequest: vi.fn(),
  updateChannelNameRequest: vi.fn(),
  deleteChannelRequest: vi.fn(),
  updateMemberRoleRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import {
  useUpdateServer,
  useDeleteServer,
  useUpdateChannel,
  useDeleteChannel,
  useUpdateMemberRole,
} from '@/hooks/mutations/updateServerSettings';

describe('useUpdateServer callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(updateServerNameRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useUpdateServer());
    await act(async () => {
      await result.current.mutateAsync({ id: '1', name: 'New Name' });
    });
    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Serveur mis à jour'),
    );
  });

  it('onError appelle toast.error', async () => {
    vi.mocked(updateServerNameRequest).mockRejectedValue(new Error('Erreur'));
    const { result } = renderHookWithQuery(() => useUpdateServer());
    await act(async () => {
      try {
        await result.current.mutateAsync({ id: '1', name: '' });
      } catch {}
    });
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled());
  });
});

describe('useDeleteServer callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(deleteServerRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useDeleteServer());
    await act(async () => {
      await result.current.mutateAsync('1');
    });
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Serveur supprimé'));
  });
});

describe('useUpdateChannel callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(updateChannelNameRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useUpdateChannel());
    await act(async () => {
      await result.current.mutateAsync({ id: '1', name: 'general' });
    });
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Salon mis à jour'));
  });
});

describe('useDeleteChannel callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(deleteChannelRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useDeleteChannel());
    await act(async () => {
      await result.current.mutateAsync('1');
    });
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Salon supprimé'));
  });
});

describe('useUpdateMemberRole callbacks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(updateMemberRoleRequest).mockResolvedValue({} as any);
    const { result } = renderHookWithQuery(() => useUpdateMemberRole());
    await act(async () => {
      await result.current.mutateAsync({ serverId: '1', memberId: 2, role: 'server_admin' });
    });
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Rôle mis à jour'));
  });
});
