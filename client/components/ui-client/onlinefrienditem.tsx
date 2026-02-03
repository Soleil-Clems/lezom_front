import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function OnlineFriendItem({ username, avatarUrl, status }: any) {
  const isOffline = status === 'offline';

  return (
    <div className={`flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group transition-colors ${isOffline ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-zinc-700 text-[10px] text-white">
            {username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Le point de statut */}
        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-[3px] border-[#2B2D31] 
          ${status === 'online' ? 'bg-green-500' : 
            status === 'dnd' ? 'bg-red-500' : 
            status === 'idle' ? 'bg-yellow-500' : 'bg-zinc-500'}`} 
        />
      </div>

      <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 truncate">
        {username}
      </span>
    </div>
  )
}