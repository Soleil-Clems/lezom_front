"use client";

import { useState, useRef } from "react";
import { Mail, Shield, Calendar, Pencil, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { useEditProfilPicture } from "@/hooks/mutations/useEditProfilPicture";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";
import useAuthStore from "@/store/authStore";
import { EditProfileInfoForm } from "@/components/ui-client/EditProfileInfoForm";

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useAuthUser();
  const { logout } = useAuthStore();
  const editPictureMutation = useEditProfilPicture(user?.id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <Loading />;
  if (isError || !user) return <Error />;

  const joinedDate = new Date(user.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      editPictureMutation.mutate(file, {
        onSuccess: (data) => {
          console.log("Image de profil mise à jour avec succès !", data);
        }

      });
    }
  };

  return (
      <div className="flex-1 bg-own-dark h-full overflow-y-auto">
        <div className="h-32 w-full bg-indigo-600 relative">
          <div className="absolute -bottom-12 left-8 group">
            <div className="relative p-1 bg-[#313338] rounded-full">
              <Avatar className="h-24 w-24 border-4 border-[#313338]">
                {/* Correction ici : vérification de l'existence de l'URL */}
                <AvatarImage
                    src={user.img ? user.img : ""}
                    className="object-cover"
                />
                <AvatarFallback className="bg-zinc-700 text-white text-xl">
                  {user.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <button
                  onClick={handleImageClick}
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
            </div>
          </div>
        </div>

        <div className="mt-16 px-8 pb-8 space-y-6">
          <section>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {user.username}
                    <span className="text-zinc-400 font-normal text-lg">
                    #{user.id.toString().padStart(4, '0')}
                  </span>

                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                  </h1>

                  <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 mt-1">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="bg-[#313338] border-zinc-700 text-white">
              <DialogHeader>
                <DialogTitle>Modifier votre profil</DialogTitle>
              </DialogHeader>


              <EditProfileInfoForm user={user} onSuccess={()=>setIsEditOpen(false)} />

            </DialogContent>
          </Dialog>

          <hr className="border-zinc-700" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-[#2B2D31] border-none text-zinc-300">
                <CardHeader className="text-white font-semibold">À propos de moi</CardHeader>
                <CardContent>
                  <p>{user.description || "Cet utilisateur n'a pas encore de bio."}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#2B2D31] border-none text-zinc-300">
                <CardHeader className="text-white font-semibold">Activité récente</CardHeader>
                <CardContent className="text-sm italic text-zinc-500">
                  Dernière connexion le {new Date(user.lastSeen).toLocaleDateString()}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-[#2B2D31] border-none text-zinc-300">
                <CardHeader className="text-white font-semibold">Informations</CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-zinc-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-zinc-500" />
                    <span>Membre depuis {joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-zinc-400" />
                    <span className="text-indigo-400 font-medium capitalize">Badge {user.role}</span>
                  </div>

                  <div className="pt-4 w-54">
                    <Button
                        className="w-full hover:bg-red-500  bg-grey-purple text-white border border-black-200"
                        onClick={() => logout()}
                    >
                      Se déconnecter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}