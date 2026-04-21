'use client';
import { useQuery } from '@tanstack/react-query';
import { getInvitePreviewRequest } from '@/requests/invitationRequest';

export const useGetInvitePreview = (code: string) => {
  return useQuery({
    queryKey: ['invite-preview', code],
    queryFn: () => getInvitePreviewRequest(code),
    enabled: !!code,
    retry: false,
  });
};
