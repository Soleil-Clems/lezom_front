'use client';

import { forgotPasswordRequest } from '@/requests/authRequest';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
