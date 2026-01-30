// app/servers/[serverId]/page.tsx
import { ChannelSidebar } from "@/components/ui-client/chanelsidebar"
import { MOCK_SERVERS } from "@/lib/mock-data"
import { notFound } from "next/navigation"

// 1. On précise que params est une Promise
export default async function ServerChannelsPage({ 
  params 
}: { 
  params: Promise<{ serverId: string }> 
}) {
  
  // 2. On "déballe" les params avec await
  const { serverId } = await params;

  // 3. Maintenant on peut utiliser serverId normalement
  const server = MOCK_SERVERS.find(s => s.id === serverId);

  if (!server) {
    return notFound();
  }

  return (
    <div className="flex h-screen w-full bg-[#313338]">
      <div className="w-full md:w-60 h-full">
         <ChannelSidebar serverId={server.id} />
      </div>

      <main className="hidden md:flex flex-1 items-center justify-center text-zinc-500">
        Sélectionnez un salon pour commencer à discuter
      </main>
    </div>
  )
}