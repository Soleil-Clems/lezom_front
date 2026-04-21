'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { banUserRequest, unbanUserRequest } from '@/requests/banRequest';
import { useTranslations } from 'next-intl';

export function useBanUser() {
  const queryClient = useQueryClient();
  const t = useTranslations('ban');
  return useMutation({
    mutationFn: ({
      serverId,
      userId,
      reason,
      durationHours,
    }: {
      serverId: string | number;
      userId: number;
      reason?: string;
      durationHours?: number;
    }) => banUserRequest(serverId, userId, reason, durationHours),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['server-bans', variables.serverId] });
      queryClient.invalidateQueries({ queryKey: ['serverMembers'] });
      queryClient.invalidateQueries({ queryKey: ['allservers'] });
      toast.success(t('banSuccess'));
    },
    onError: (error: any) => toast.error(error.message || t('banError')),
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  const t = useTranslations('ban');
  return useMutation({
    mutationFn: ({ serverId, userId }: { serverId: string | number; userId: number }) =>
      unbanUserRequest(serverId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['server-bans', variables.serverId] });
      queryClient.invalidateQueries({ queryKey: ['allservers'] });
      toast.success(t('unbanSuccess'));
    },
    onError: (error: any) => toast.error(error.message || t('unbanError')),
  });
}
