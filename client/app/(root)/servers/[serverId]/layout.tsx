import { ChannelSidebar } from "@/components/ui-client/chanelsidebar"
import { OnlineFriendsList } from "@/components/ui-client/onlinefriendlist";
export default async function ServerLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ serverId: string, channelId?: string }> 
}) {
  const { serverId, channelId } = await params;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#313338]">
      
        <ChannelSidebar serverId={serverId} channelId={channelId} />

      <main className="flex-1 flex min-w-0 overflow-hidden">
        {children}
      </main>

    
      
    </div>
  )
}