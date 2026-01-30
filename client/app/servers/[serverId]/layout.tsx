// app/servers/[serverId]/layout.tsx
import { ChannelSidebar } from "@/components/ui-client/chanelsidebar"


export default async function ServerLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ serverId: string, channelId?: string }> 
}) {
  // On déballe les params pour savoir si on est dans un salon
  const { serverId, channelId } = await params;

  return (
    <div className="flex h-full w-full">
      {/* CONDITION MOBILE : 
         Si channelId existe (ex: 'c2'), on met 'hidden' sur mobile.
         Sinon on met 'flex'. 
         'md:flex' force l'affichage sur Laptop quoi qu'il arrive.
      */}
      <aside className={`${channelId ? 'hidden' : 'flex'} md:flex shrink-0`}>
        <ChannelSidebar serverId={serverId} channelId={channelId} />
      </aside>

      <main className="flex-1 flex min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}