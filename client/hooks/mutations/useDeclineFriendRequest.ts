'use client';

import { declineFriendRequestRequest } from '@/requests/friendRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeclineFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => declineFriendRequestRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', 'pending'] });
      toast.success('Demande refusée');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du refus');
    },
  });
}
