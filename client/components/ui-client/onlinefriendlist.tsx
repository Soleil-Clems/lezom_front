"use client"

import React from 'react'
import { useGetAllServers } from '@/hooks/queries/useGetAllServers'
import { Loader2, Users, X } from 'lucide-react'
import { OnlineFriendItem } from './onlinefrienditem';
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
  SheetHeader, 
  SheetClose 
} from "@/components/ui/sheet"

const ListContent = ({ members, onlineMembers, offlineMembers, showClose = false }: any) => (
  <div className="flex flex-col h-full bg-[#2B2D31] text-zinc-300 w-full overflow-hidden">
    <div className="h-12 border-b border-black/20 flex items-center justify-between px-4 font-semibold text-sm shrink-0">
      <span>Membres — {members.length}</span>
      
      {showClose && (
        <SheetClose className="p-1 hover:bg-white/10 rounded-md transition outline-none">
          <X className="w-6 h-6 text-white" /> 
        </SheetClose>
      )}
    </div>
    
    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
       {onlineMembers.length > 0 && (
        <div className="mb-4">
          <p className="uppercase text-[11px] font-bold text-zinc-500 mb-2 px-2">En ligne — {onlineMembers.length}</p>
          {onlineMembers.map((m: any) => <OnlineFriendItem key={m.id} member={m} />)}
        </div>
      )}
      {offlineMembers.length > 0 && (
        <div>
          <p className="uppercase text-[11px] font-bold text-zinc-500 mb-2 px-2">Hors ligne — {offlineMembers.length}</p>
          <div className="opacity-60 grayscale-[0.2]">
            {offlineMembers.map((m: any) => <OnlineFriendItem key={m.id} member={m} />)}
          </div>
        </div>
      )}
    </div>
  </div>
)

export function OnlineFriendsList() {
  const { data: serversData, isLoading, isError } = useGetAllServers();

  if (isLoading || isError) return null;

  const servers = Array.isArray(serversData) ? serversData : serversData?.data || [];
  const allMembersMap = new Map();
  servers.forEach((server: any) => {
    (server.users || server.members || []).forEach((m: any) => allMembersMap.set(m.id, m));
  });

  const allMembers = Array.from(allMembersMap.values());
  const onlineMembers = allMembers.filter(m => m.status === 'online' || m.isOnline);
  const offlineMembers = allMembers.filter(m => m.status !== 'online' && !m.isOnline);

  return (
    <>
      <Sidebar side="right" collapsible="none" className="hidden xl:flex w-60 border-l border-sidebar-border shrink-0">
        <SidebarContent>
           <ListContent members={allMembers} onlineMembers={onlineMembers} offlineMembers={offlineMembers} />
        </SidebarContent>
      </Sidebar>

      <div className="xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed top-[10px] right-4 z-40 p-1 text-zinc-400 hover:text-white transition-colors outline-none">
              <Users className="w-6 h-6" />
            </button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="p-0 w-[280px] bg-[#2B2D31] border-none [&>button]:hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Liste des membres</SheetTitle>
            </SheetHeader>
            
            <ListContent 
              members={allMembers} 
              onlineMembers={onlineMembers} 
              offlineMembers={offlineMembers} 
              showClose={true} 
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}