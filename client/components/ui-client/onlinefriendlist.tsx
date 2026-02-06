"use client"

import React from 'react'
import { useGetServerMembers } from "@/hooks/queries/useGetServerMembers"
import { useOnlineUserIds } from "@/hooks/queries/useOnlineUserIds"
import { Users, X } from 'lucide-react'
import { OnlineFriendItem } from './onlinefrienditem'
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetClose
} from "@/components/ui/sheet"

const ListContent = ({ memberships, online, offline, showClose = false }: any) => (
  <div className="flex flex-col h-full bg-[#2B2D31] text-zinc-300 w-full overflow-hidden border-l border-black/10">
    <div className="h-12 border-b border-black/20 flex items-center justify-between px-4 font-semibold text-sm shrink-0">
      <span className="opacity-70 text-[11px] uppercase tracking-widest font-bold">Membres — {memberships.length}</span>
      {showClose && (
        <SheetClose className="p-1 hover:bg-white/10 rounded-md transition outline-none">
          <X className="w-5 h-5 text-zinc-400" /> 
        </SheetClose>
      )}
    </div>
    
    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
       {online.length > 0 && (
        <div className="mb-6">
          <p className="uppercase text-[11px] font-bold text-zinc-500 mb-2 px-2">En ligne — {online.length}</p>
          <div className="flex flex-col gap-[2px]">
            {online.map((m: any) => (
              <OnlineFriendItem key={m.id} member={m.members} />
            ))}
          </div>
        </div>
      )}

      {offline.length > 0 && (
        <div>
          <p className="uppercase text-[11px] font-bold text-zinc-500 mb-2 px-2">Hors ligne — {offline.length}</p>
          <div className="flex flex-col gap-[2px] opacity-60 grayscale-[0.3]">
            {offline.map((m: any) => (
              <OnlineFriendItem key={m.id} member={m.members} status={false}/>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)

export function OnlineFriendsList({ serverId }: { serverId: string | number }) {
  const { data, isLoading } = useGetServerMembers(serverId, { limit: 100 });
  const { data: onlineUserIds = [] } = useOnlineUserIds();

  if (isLoading || !data) return null;

  const memberships = data.data || [];


    const online = memberships.filter(
        (m: any) =>
            m.members?.isActive === true &&
            onlineUserIds.includes(m.members?.id)
    );

    const offline = memberships.filter(
        (m: any) =>
            m.members?.isActive === false ||
            !onlineUserIds.includes(m.members?.id)
    );


    return (
    <>
      <Sidebar side="right" collapsible="none" className="hidden xl:flex w-60 border-l border-black/20 shrink-0">
        <SidebarContent className="bg-[#2B2D31]">
           <ListContent memberships={memberships} online={online} offline={offline} />
        </SidebarContent>
      </Sidebar>

      <div className="xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed top-3 right-4 z-40 p-2 text-zinc-400 hover:text-white bg-[#313338]/80 backdrop-blur-sm rounded-full border border-white/5 shadow-xl">
              <Users className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[280px] bg-[#2B2D31] border-none [&>button]:hidden">
            <SheetHeader className="sr-only"><SheetTitle>Liste des membres</SheetTitle></SheetHeader>
            <ListContent memberships={memberships} online={online} offline={offline} showClose={true} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}