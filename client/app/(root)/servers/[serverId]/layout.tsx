import { ChannelSidebar } from "@/components/ui-client/chanelsidebar";

export default function ServerLayout({ children, params }: { children: React.ReactNode, params: { serverId: string } }) {
 
    type Props = {
  serverId: string       
  
}
 
 
    return (
    <div className="flex h-full w-full overflow-hidden">
      <aside className="hidden md:flex w-60 shrink-0 border-r border-black/20">
        <ChannelSidebar serverId={params.serverId} />
      </aside>
      
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  )
}