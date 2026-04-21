'use client';
import { leaveServerRequest } from '@/requests/leaveServerRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LeaveServerParamsType } from '@/schemas/server.dto';

export function useLeaveServer() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ serverId, newOwnerId }: LeaveServerParamsType) =>
      leaveServerRequest(serverId, newOwnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allservers'] });
      queryClient.invalidateQueries({ queryKey: ['serverMembers'] });
      toast.success('Vous avez quitté le serveur');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la sortie du serveur');
    },
  });
}
