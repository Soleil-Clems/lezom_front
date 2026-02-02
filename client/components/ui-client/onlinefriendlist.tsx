"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { OnlineFriendItem } from './onlinefrienditem'
import { Loader2, Users } from 'lucide-react'
// Importe ta requête API ici (ex: getAllFriendsRequest)

export function OnlineFriendsList() {
  // Remplace par ton vrai hook quand ton backend sera prêt
  const { data: friends, isLoading } = useQuery({
    queryKey: ['friends-online'],
    queryFn: async () => {
      // Simuler un appel API pour le moment
      return [
        { id: 1, username: "TheRipper", status: "online", activity: "Visual Studio Code" },
        { id: 2, username: "Lezom", status: "dnd", activity: "League of Legends" },
        { id: 3, username: "Stapine", status: "idle" },
      ]
    }
  })

  if (isLoading) return <Loader2 className="animate-spin text-zinc-500 m-4" />

  const onlineCount = friends?.filter(f => f.status !== 'offline').length || 0;

  return (
    <div className="w-60 bg-[#2B2D31] h-full flex flex-col border-l border-white/5">
      <div className="p-4 flex items-center gap-2 text-zinc-400">
        <Users size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">
          Amis en ligne — {onlineCount}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {friends?.map((friend: any) => (
          <OnlineFriendItem 
            key={friend.id}
            username={friend.username}
            status={friend.status}
          />
        ))}
      </div>
    </div>
  )
}