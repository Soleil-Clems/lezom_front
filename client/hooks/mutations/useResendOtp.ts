'use client';

import { resendOtpRequest } from '@/requests/authRequest';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtpRequest,
    onSuccess: () => {
      toast.success('Code renvoyé !');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
