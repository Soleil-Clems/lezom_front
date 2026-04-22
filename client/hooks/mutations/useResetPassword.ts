'use client';

import { resetPasswordRequest } from '@/requests/authRequest';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordRequest,
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
