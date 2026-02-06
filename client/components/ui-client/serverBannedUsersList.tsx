"use client";

import { useState } from "react";
import { BannedUserCard } from "@/components/ui-client/bannedUserCard";
import { DeleteConfirmModal } from "@/components/ui-client/DeleteConfirmModal";
import { useGetBannedUsers } from "@/hooks/queries/useGetBannedUsers";
import { useUnbanUser } from "@/hooks/mutations/useBanManagement";
import { BanType } from "@/schemas/ban.dto";

type ServerBannedUsersListProps = {
    serverId: string | number;
};

export function ServerBannedUsersList({ serverId }: ServerBannedUsersListProps) {
    const { data: bannedUsers, isLoading } = useGetBannedUsers(serverId);
    const unbanUser = useUnbanUser();
    const [unbanTarget, setUnbanTarget] = useState<BanType | null>(null);

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
                    isPending={unbanUser.isPending}
                    onOpenUnbanModal={(ban) => setUnbanTarget(ban)}
                />
            ))}

            <DeleteConfirmModal
                isOpen={!!unbanTarget}
                onClose={() => setUnbanTarget(null)}
                onConfirm={() => {
                    if (unbanTarget) {
                        unbanUser.mutate(
                            { serverId, userId: unbanTarget.user.id },
                            { onSuccess: () => setUnbanTarget(null) }
                        );
                    }
                }}
                title="Débannir un utilisateur"
                message="Voulez-vous vraiment débannir"
                itemName={unbanTarget?.user.username ?? ""}
                isPending={unbanUser.isPending}
                confirmLabel="Débannir"
                pendingLabel="Débannissement..."
            />
        </div>
    );
}
