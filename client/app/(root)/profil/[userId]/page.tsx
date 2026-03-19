"use client";

import { useParams } from "next/navigation";

import { ProfileView } from "@/components/ui-client/ProfileView";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { useGetFriends } from "@/hooks/queries/useGetFriends";
import { useUserById } from "@/hooks/queries/useUserById";

export default function UserProfilePage() {
  const params = useParams<{ userId: string }>();
  const userId = Number(params.userId);

  const { data: authUser } = useAuthUser();
  const { data: friends = [] } = useGetFriends();
  const { data: user, isLoading, isError, error } = useUserById(userId);
  const friend = friends.find((item) => item.id === userId);

  const fallbackUser = friend
    ? {
        id: friend.id,
        username: friend.username,
        firstname: friend.firstname,
        lastname: friend.lastname,
        img: friend.img,
        lastSeen: friend.lastSeen,
        description: "",
      }
    : undefined;

  const resolvedUser = user ?? fallbackUser;

  return (
    <ProfileView
      user={resolvedUser}
      isLoading={isLoading && !resolvedUser}
      isError={isError && !resolvedUser}
      isOwnProfile={authUser?.id === resolvedUser?.id}
      errorMessage={!resolvedUser && error instanceof Error ? error.message : undefined}
    />
  );
}
