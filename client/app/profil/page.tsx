import { User, Mail, Shield, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const user = {
    name: "Utilisateur",
    tag: "#0001",
    email: "contact@lezom.app",
    role: "Administrateur",
    joinedDate: "Janvier 2026",
    status: "En ligne",
    bio: "Développeur passionné par Next.js et Tailwind CSS. Je construis Lezom !",
  };

  return (
    <div className="flex-1 bg-[#313338] h-full overflow-y-auto">
      <div className="h-32 w-full bg-indigo-600 relative">
        <div className="absolute -bottom-12 left-8 p-1 bg-[#313338] rounded-full">
          <Avatar className="h-24 w-24 border-4 border-[#313338]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-16 px-8 pb-8 space-y-6">
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {user.name}
                <span className="text-zinc-400 font-normal">{user.tag}</span>
              </h1>
              <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 mt-1">
                {user.role}
              </Badge>
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
              Modifier le profil
            </Button>
          </div>
        </section>

        <hr className="border-zinc-700" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-[#2B2D31] border-none text-zinc-300">
              <CardHeader className="text-white font-semibold">À propos de moi</CardHeader>
              <CardContent>
                <p>{user.bio}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2B2D31] border-none text-zinc-300">
              <CardHeader className="text-white font-semibold">Activité récente</CardHeader>
              <CardContent className="text-sm italic text-zinc-500">
                Aucune activité récente à afficher.
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
                  <span>Membre depuis {user.joinedDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-zinc-400" />
                  <span className="text-indigo-400 font-medium">Badge Certifié</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}