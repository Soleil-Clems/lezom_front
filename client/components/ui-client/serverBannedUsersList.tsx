'use client';

import { useState } from 'react';
import { BannedUserCard } from '@/components/ui-client/bannedUserCard';
import { DeleteConfirmModal } from '@/components/ui-client/DeleteConfirmModal';
import { useGetBannedUsers } from '@/hooks/queries/useGetBannedUsers';
import { useUnbanUser } from '@/hooks/mutations/useBanManagement';
import { BanType } from '@/schemas/ban.dto';
import { useTranslations } from 'next-intl';

type ServerBannedUsersListProps = {
  serverId: string | number;
};

export function ServerBannedUsersList({ serverId }: ServerBannedUsersListProps) {
  const { data: bannedUsers, isLoading } = useGetBannedUsers(serverId);
  const unbanUser = useUnbanUser();
  const [unbanTarget, setUnbanTarget] = useState<BanType | null>(null);
  const t = useTranslations('settings');
  const tb = useTranslations('ban');
  const tc = useTranslations('common');

  if (isLoading) {
    return <div className="p-4 text-xs text-zinc-500 italic">{tc('loading')}</div>;
  }

  const bans: BanType[] = Array.isArray(bannedUsers) ? bannedUsers : [];

  if (bans.length === 0) {
    return <div className="p-4 text-center text-zinc-500 text-sm">{t('noBannedUsers')}</div>;
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
              { onSuccess: () => setUnbanTarget(null) },
            );
          }
        }}
        title={tb('unbanUser')}
        message={tb('unbanConfirm')}
        itemName={unbanTarget?.user.username ?? ''}
        isPending={unbanUser.isPending}
        confirmLabel={tb('unban')}
        pendingLabel={tb('unbanning')}
      />
    </div>
  );
}
