"use client"
import Link from "next/link";
import { Hash, Volume2 } from "lucide-react"; // Import des icônes Discord-style
import { MOCK_CHANNELS } from "@/lib/mock-data";

type ChannelSidebarProps = {
  serverId?: string; 
  channelId?: string;
}

export function ChannelSidebar({ serverId, channelId }: ChannelSidebarProps) {
  // 1. Si pas de serverId, on affiche le message vide
  
  if (!serverId) {
    return (
      <div className="w-60 h-full bg-[#2B2D31] flex flex-col items-center justify-center p-4 text-zinc-500 text-center">
        <p>Sélectionnez un serveur pour voir les salons</p>
      </div>
    );
  }

  // 2. On récupère la liste des salons pour ce serveur spécifique
  const channels = MOCK_CHANNELS[serverId] || [];
  

  return (
    <div className="w-full md:w-60 h-full bg-[#2B2D31] flex flex-col shrink-0 border-r border-black/20">
      {/* Header : On pourrait aussi chercher le nom du serveur ici */}
      <div className="h-12 px-4 flex items-center shadow-sm border-b border-black/20 font-bold text-white shrink-0">
        Salons
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-[2px]">
        {channels.map((channel) => {
          // Déterminer si le salon est celui actuellement sélectionné
          const isActive = channel.id === channelId;

          return (
            <Link 
              key={channel.id}
              href={`/servers/${serverId}/${channel.id}`}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors group
                ${isActive 
                  ? "bg-zinc-700/60 text-white" 
                  : "text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200"}
              `}
            >
              {/* Icône dynamique selon le type de salon */}
              {channel.type === "text" ? (
                <Hash className="w-5 h-5 text-zinc-500 shrink-0" />
              ) : (
                <Volume2 className="w-5 h-5 text-zinc-500 shrink-0" />
              )}

              <span className="truncate font-medium">
                {channel.name}
              </span>
            </Link>
          );
        })}

        {channels.length === 0 && (
          <p className="text-xs text-zinc-500 text-center mt-4">Aucun salon trouvé</p>
        )}
      </div>
    </div>
  )
}