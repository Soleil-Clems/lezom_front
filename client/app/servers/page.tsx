// app/servers/[serverId]/page.tsx
import { ChannelSidebar } from "@/components/ui-client/chanelsidebar"
import { MOCK_SERVERS } from "@/lib/mock-data"

export default function ServerChannelsPage({ params }: { params: { serverId: string } }) {
  const server = MOCK_SERVERS.find(s => s.id === params.serverId);

  
  return (
    <div className="flex h-screen w-full bg-[#313338]">
      <div className="w-full md:w-60 h-full">
         <ChannelSidebar serverName={server?.name} />
      </div>

      <main className="hidden md:flex flex-1 items-center justify-center text-zinc-500">
        Sélectionnez un salon pour commencer à discuter
      </main>
    </div>
  )
}