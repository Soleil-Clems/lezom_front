"use client"

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FriendProps {
  username: string;
  avatarUrl?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
}

const statusColors = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  dnd: "bg-red-500",
  offline: "bg-zinc-500"
}

export function OnlineFriendItem({ username, avatarUrl, status}: FriendProps) {
  return (
    <div className="group flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer transition-all">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback className="bg-indigo-500 text-white text-xs">
            {username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#313338] ${statusColors[status]}`} />
      </div>

      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 truncate">
          {username}
        </span>
        
      </div>
    </div>
  )
}