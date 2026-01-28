
type ChannelSidebarProps = {
  serverName?: string; 
}

export function ChannelSidebar({ serverName }: ChannelSidebarProps) {
  return (
    <div className="w-full md:w-60 h-full bg-[#2B2D31] flex flex-col shrink-0 border-r border-black/20">
      <div className="h-12 px-4 flex items-center shadow-sm border-b border-black/20 font-bold text-white shrink-0">
        {serverName || "Channels"} 
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-zinc-400 hover:bg-zinc-700/50 p-2 rounded cursor-pointer transition-colors">
          # général
        </div>
      </div>
    </div>
  )
}