"use client"

import React from 'react'
import { useGetAllServers } from '@/hooks/queries/useGetAllServers'
import { Loader2 } from 'lucide-react'
import { OnlineFriendItem } from './onlinefrienditem';

export function OnlineFriendsList() {
  const { data: serversData, isLoading, isError } = useGetAllServers();

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="animate-spin text-zinc-500 w-6 h-6" />
    </div>
  );

  if (isError) return <div className="p-4 text-xs text-rose-500 text-center">Erreur de chargement</div>;

  const servers = Array.isArray(serversData) ? serversData : serversData?.data || [];
  
  const allMembersMap = new Map();

  servers.forEach((server: any) => {
    const members = server.users || server.members || []; 
    members.forEach((member: any) => {
      if (!allMembersMap.has(member.id)) {
        allMembersMap.set(member.id, member);
      }
    });
  });

  const allMembers = Array.from(allMembersMap.values());

  return (
    <div className="flex flex-col h-full bg-[#2B2D31]">
      <div className="p-4 border-b border-black/20 shrink-0">
        <h2 className="text-white font-bold text-[11px] uppercase tracking-widest opacity-60">
          Membres — {allMembers.length}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
        {allMembers.length > 0 ? (
          allMembers.map((member: any) => (
            <OnlineFriendItem 
              key={member.id}
              username={member.username}
              avatarUrl={member.avatarUrl}
              status={member.status || 'offline'} 
            />
          ))
        ) : (
          <p className="text-zinc-500 text-[11px] italic text-center mt-10">
            Aucun membre trouvé.
          </p>
        )}
      </div>
    </div>
  )
}