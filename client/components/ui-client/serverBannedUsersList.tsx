"use client";

import { BannedUserCard } from "@/components/ui-client/bannedUserCard";
import { useGetBannedUsers } from "@/hooks/queries/useGetBannedUsers";
import { useUnbanUser } from "@/hooks/mutations/useBanManagement";
import { BanType } from "@/schemas/ban.dto";

type ServerBannedUsersListProps = {
    serverId: string | number;
};

export function ServerBannedUsersList({ serverId }: ServerBannedUsersListProps) {
    const { data: bannedUsers, isLoading } = useGetBannedUsers(serverId);
    const unbanUser = useUnbanUser();

    if (isLoading) {
        return <div className="p-4 text-xs text-zinc-500 italic">Chargement...</div>;
    }

    const bans: BanType[] = Array.isArray(bannedUsers) ? bannedUsers : [];

    if (bans.length === 0) {
        return (
            <div className="p-4 text-center text-zinc-500 text-sm">
                Aucun utilisateur banni
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            {bans.map((ban: BanType) => (
                <BannedUserCard
                    key={ban.id}
                    ban={ban}
                    onUnban={() => unbanUser.mutate({ serverId, userId: ban.user.id })}
                    isPending={unbanUser.isPending}
                />
            ))}
        </div>
    );
}
