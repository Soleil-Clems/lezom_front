import { ChannelSidebar } from "@/components/ui-client/chanelsidebar"

export default async function ServerLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ serverId: string, channelId?: string }> 
}) {
  const { serverId, channelId } = await params;
  return (
    <div className="flex h-full w-full">
      
      <aside className={`${channelId ? 'hidden' : 'flex'} md:flex shrink-0`}>
        <ChannelSidebar serverId={serverId} channelId={channelId} />
      </aside>

      <main className="flex-1 flex min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}