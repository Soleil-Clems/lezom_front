'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Calendar,
  Camera,
  Mail,
  MessageSquare,
  Pencil,
  Shield,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Error from '@/components/ui-client/Error';
import { EditProfileInfoForm } from '@/components/ui-client/EditProfileInfoForm';
import { LanguageSwitcher } from '@/components/ui-client/LanguageSwitcher';
import Loading from '@/components/ui-client/Loading';
import { useCreateConversation } from '@/hooks/mutations/useCreateConversation';
import { useEditProfil } from '@/hooks/mutations/useEditProfil';
import { useEditProfilPicture } from '@/hooks/mutations/useEditProfilPicture';
import { useSendFriendRequest } from '@/hooks/mutations/useSendFriendRequest';
import { useGetFriends } from '@/hooks/queries/useGetFriends';
import type { userType } from '@/schemas/user.dto';
import useAuthStore from '@/store/authStore';

type ProfileUser = {
  id: number;
  username: string;
  firstname?: string;
  lastname?: string;
  description?: string;
  email?: string;
  isTwoFactorEnabled?: boolean;
  role?: string;
  img?: string;
  lastSeen?: Date | string;
  createdAt?: Date | string;
};

type ProfileViewProps = {
  user?: ProfileUser;
  isLoading: boolean;
  isError: boolean;
  isOwnProfile: boolean;
  errorMessage?: string;
};

export function ProfileView({
  user,
  isLoading,
  isError,
  isOwnProfile,
  errorMessage,
}: ProfileViewProps) {
  const t = useTranslations('profile');
  const ta = useTranslations('auth');
  const tf = useTranslations('friends');
  const tm = useTranslations('messages');
  const locale = useLocale();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { data: friends = [] } = useGetFriends();
  const createConversation = useCreateConversation();
  const sendFriendRequest = useSendFriendRequest();
  const editPictureMutation = useEditProfilPicture(user?.id);
  const editProfilMutation = useEditProfil(user?.id ?? 0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <Loading />;
  if (isError || !user) return <Error message={errorMessage} />;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      })
    : null;

  const isAlreadyFriend = friends.some((friend) => friend.id === user.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      editPictureMutation.mutate(file);
    }
  };

  const handleOpenConversation = async () => {
    try {
      const conversation = await createConversation.mutateAsync({ userId: user.id });
      router.push(`/conversation/${conversation.id}`);
    } catch {}
  };

  return (
    <div className="flex-1 bg-own-dark h-full overflow-y-auto">
      <div className="h-32 w-full bg-indigo-600 relative">
        <div className="absolute -bottom-12 left-8 group">
          <div className="relative p-1 bg-[#313338] rounded-full">
            <Avatar className="h-24 w-24 border-4 border-[#313338]">
              <AvatarImage src={user.img ?? ''} className="object-cover" />
              <AvatarFallback className="bg-zinc-700 text-white text-xl">
                {user.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={editPictureMutation.isPending}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {editPictureMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <Camera className="text-white w-6 h-6" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 px-8 pb-8 space-y-6">
        <section>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white flex flex-wrap items-center gap-2">
                  {user.username}
                  <span className="text-zinc-400 font-normal text-lg">
                    #{user.id.toString().padStart(4, '0')}
                  </span>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </h1>
                {user.role && (
                  <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 mt-2">
                    {user.role}
                  </Badge>
                )}
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleOpenConversation}
                  disabled={createConversation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <MessageSquare className="size-4" />
                  {tm('sendMessage')}
                </Button>
                {!isAlreadyFriend && (
                  <Button
                    variant="outline"
                    onClick={() => sendFriendRequest.mutate(user.id)}
                    disabled={sendFriendRequest.isPending}
                    className="border-zinc-600 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
                  >
                    <UserPlus className="size-4" />
                    {tf('addFriend')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {isOwnProfile && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="dark bg-[#313338] border-zinc-700 text-white">
              <DialogHeader>
                <DialogTitle>{t('editProfile')}</DialogTitle>
              </DialogHeader>
              <EditProfileInfoForm user={user as userType} onSuccess={() => setIsEditOpen(false)} />
            </DialogContent>
          </Dialog>
        )}

        <hr className="border-zinc-700" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-[#2B2D31] border-none text-zinc-300">
              <CardHeader className="text-white font-semibold">{t('aboutMe')}</CardHeader>
              <CardContent>
                <p>{user.description || t('noBio')}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2B2D31] border-none text-zinc-300">
              <CardHeader className="text-white font-semibold">{t('recentActivity')}</CardHeader>
              <CardContent className="text-sm italic text-zinc-500">
                {user.lastSeen
                  ? t('lastSeen', {
                      date: new Date(user.lastSeen).toLocaleDateString(locale),
                    })
                  : t('noBio')}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#2B2D31] border-none text-zinc-300">
              <CardHeader className="text-white font-semibold">{t('information')}</CardHeader>
              <CardContent className="space-y-4 text-sm">
                {isOwnProfile && user.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-zinc-500" />
                    <span>{user.email}</span>
                  </div>
                )}
                {joinedDate && (
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-zinc-500" />
                    <span>{t('memberSince', { date: joinedDate })}</span>
                  </div>
                )}
                {user.role && (
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-zinc-400" />
                    <span className="text-indigo-400 font-medium capitalize">
                      {t('badge', { role: user.role })}
                    </span>
                  </div>
                )}

                {isOwnProfile && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-zinc-500" />
                      <div>
                        <p className="text-sm">{t('twoFactorAuth')}</p>
                        <p className="text-xs text-zinc-500">{t('twoFactorDesc')}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        editProfilMutation.mutate({
                          isTwoFactorEnabled: !user.isTwoFactorEnabled,
                        })
                      }
                      disabled={editProfilMutation.isPending}
                      className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        user.isTwoFactorEnabled ? 'bg-indigo-500' : 'bg-zinc-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.isTwoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {isOwnProfile && (
                  <div className="pt-4 space-y-3">
                    <LanguageSwitcher />
                    <Button
                      className="w-full hover:bg-red-500 bg-grey-purple text-white border border-black-200"
                      onClick={() => logout()}
                    >
                      {ta('logout')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
