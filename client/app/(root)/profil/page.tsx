'use client';

import { ProfileView } from '@/components/ui-client/ProfileView';
import { useAuthUser } from '@/hooks/queries/useAuthUser';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useAuthUser();

  return <ProfileView user={user} isLoading={isLoading} isError={isError} isOwnProfile />;
}
