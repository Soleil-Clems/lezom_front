"use client"

import { useOnlineUserIds } from "@/hooks/queries/useOnlineUserIds"

export function OnlineFriendItem({ member }: { member: any }) {
  const { data: onlineUserIds = [] } = useOnlineUserIds();
  const isOnline = onlineUserIds.includes(member?.id);

  // Récupération sécurisée du username
  const name = member?.username || "Inconnu";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group transition-all">
      {/* Avatar avec initiales */}
      <div className="relative shrink-0">
        <div className="h-8 w-8 rounded-full bg-[#313338] flex items-center justify-center text-[10px] font-bold text-white uppercase group-hover:bg-indigo-500 transition-colors">
          {initials}
        </div>
        {/* Pastille de statut */}
        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-[3px] border-[#2B2D31]
          ${isOnline ? 'bg-green-500' : 'bg-zinc-500'}`}
        />
      </div>

      {/* Affichage du username */}
      <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 truncate">
        {name}
      </span>
    </div>
  )
}