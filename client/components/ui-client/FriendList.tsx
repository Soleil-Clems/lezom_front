'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useGetFriends } from '@/hooks/queries/useGetFriends';
import { useGetPendingRequests } from '@/hooks/queries/useGetPendingRequests';
import { useOnlineUserIds } from '@/hooks/queries/useOnlineUserIds';
import { useAcceptFriendRequest } from '@/hooks/mutations/useAcceptFriendRequest';
import { useDeclineFriendRequest } from '@/hooks/mutations/useDeclineFriendRequest';
import { useRemoveFriend } from '@/hooks/mutations/useRemoveFriend';
import { useCreateConversation } from '@/hooks/mutations/useCreateConversation';
import { friendUserType } from '@/schemas/friend.dto';
import { MessageSquare, UserMinus } from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui-client/DeleteConfirmModal';

type Filter = 'online' | 'all' | 'pending';

export default function FriendList({ filter = 'all' }: { filter?: Filter }) {
  const router = useRouter();
  const t = useTranslations('friends');

  const { data: friends = [] } = useGetFriends();
  const { data: pendingRequests = [] } = useGetPendingRequests();
  const { data: onlineIds } = useOnlineUserIds();

  const { mutate: acceptRequest } = useAcceptFriendRequest();
  const { mutate: declineRequest } = useDeclineFriendRequest();
  const { mutate: removeFriend, isPending: isRemoving } = useRemoveFriend();
  const { mutate: createConversation } = useCreateConversation();

  const [friendToRemove, setFriendToRemove] = useState<friendUserType | null>(null);

  const handleOpenConversation = (userId: number) => {
    createConversation(
      { userId },
      {
        onSuccess: (data: { id: number }) => {
          router.push(`/conversation/${data.id}`);
        },
      },
    );
  };

  const handleConfirmRemove = () => {
    if (friendToRemove) {
      removeFriend(friendToRemove.id, {
        onSettled: () => setFriendToRemove(null),
      });
    }
  };

  /* ── Onglet En attente ── */
  if (filter === 'pending') {
    return (
      <div className="px-4 py-3">
        <p className="px-1 pb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
          {t('pendingRequests', { count: pendingRequests.length })}
        </p>
        {pendingRequests.length === 0 && (
          <p className="text-sm text-zinc-500 px-1">{t('noPendingRequests')}</p>
        )}
        {pendingRequests.map((req) => (
          <div
            key={req.id}
            className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-zinc-700/50 border-t border-zinc-700/40"
          >
            <UserAvatar username={req.sender.username} img={req.sender.img} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{req.sender.username}</p>
              <p className="text-xs text-zinc-500">{t('friendRequestReceived')}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => acceptRequest(req.id)}
                className="p-1.5 rounded-full bg-zinc-700 hover:bg-green-600 text-zinc-300 hover:text-white transition-colors"
                title={t('accept')}
              >
                ✓
              </button>
              <button
                onClick={() => declineRequest(req.id)}
                className="p-1.5 rounded-full bg-zinc-700 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors"
                title={t('decline')}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Onglet En ligne / Tous ── */
  const onlineSet = new Set(onlineIds ?? []);
  const onlineFriends = friends.filter((f) => onlineSet.has(f.id));
  const offlineFriends = friends.filter((f) => !onlineSet.has(f.id));

  const renderSection = (list: friendUserType[], label: string, isOnline: boolean) => {
    if (list.length === 0) return null;
    return (
      <>
        <p className="px-1 pb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
          {label}
        </p>
        {list.map((friend) => (
          <FriendItem
            key={friend.id}
            friend={friend}
            isOnline={isOnline}
            onViewProfile={() => router.push(`/profil/${friend.id}`)}
            onMessage={() => handleOpenConversation(friend.id)}
            onRemove={() => setFriendToRemove(friend)}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <div className="px-4 py-3">
        {filter === 'online' && onlineFriends.length === 0 && (
          <p className="text-sm text-zinc-500 px-1">{t('noFriendsOnline')}</p>
        )}
        {filter === 'all' && friends.length === 0 && (
          <p className="text-sm text-zinc-500 px-1">{t('noFriendsYet')}</p>
        )}

        {renderSection(onlineFriends, t('onlineCount', { count: onlineFriends.length }), true)}
        {filter === 'all' &&
          renderSection(offlineFriends, t('offlineCount', { count: offlineFriends.length }), false)}
      </div>

      <DeleteConfirmModal
        isOpen={!!friendToRemove}
        onClose={() => setFriendToRemove(null)}
        onConfirm={handleConfirmRemove}
        title={t('removeFriendTitle')}
        message={t('removeFriendConfirm')}
        itemName={friendToRemove?.username ?? ''}
        isPending={isRemoving}
      />
    </>
  );
}

function UserAvatar({
  username,
  img,
  size = 'h-9 w-9',
}: {
  username: string;
  img?: string;
  size?: string;
}) {
  return img ? (
    <img src={img} alt={username} className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <div
      className={`${size} shrink-0 rounded-full bg-zinc-600 flex items-center justify-center text-sm font-semibold text-white uppercase`}
    >
      {username.substring(0, 2)}
    </div>
  );
}

function FriendItem({
  friend,
  isOnline,
  onViewProfile,
  onMessage,
  onRemove,
}: {
  friend: friendUserType;
  isOnline: boolean;
  onViewProfile: () => void;
  onMessage: () => void;
  onRemove: () => void;
}) {
  const to = useTranslations('online');
  const tf = useTranslations('friends');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onViewProfile}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewProfile();
        }
      }}
      className="group flex w-full items-center gap-3 px-3 py-3 rounded-md hover:bg-zinc-700/50 border-t border-zinc-700/40 transition-colors text-left"
    >
      <div className="relative shrink-0">
        <UserAvatar username={friend.username} img={friend.img} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#313338] ${
            isOnline ? 'bg-green-500' : 'bg-zinc-500'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">{friend.username}</p>
        <p className="text-xs text-zinc-500">{isOnline ? to('online') : to('offline')}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMessage();
          }}
          className="p-1.5 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white transition-colors"
          title={tf('sendMessage')}
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1.5 rounded-full bg-zinc-700 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors"
          title={tf('removeFriend')}
        >
          <UserMinus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
