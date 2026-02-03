"use client"

import React from 'react'
import { ChannelSidebar } from "@/components/ui-client/chanelsidebar";
import MessageLayout from "@/components/ui-client/MessageLayout";
import { OnlineFriendsList } from "@/components/ui-client/onlinefriendlist";
import { ServerSidebar } from "@/components/ui-client/serversidebar";

export default function HomePage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#313338]">
      <ServerSidebar />

      <ChannelSidebar />
      
      <main className="flex-1 flex min-w-0">
        
        <div className="flex-1 h-full overflow-hidden">
           <MessageLayout />
        </div>

        
        <aside className="hidden xl:flex w-60 bg-[#2B2D31] flex-col shrink-0 border-l border-black/20">
          <OnlineFriendsList />
        </aside>
        
      </main>
    </div>
  )
}