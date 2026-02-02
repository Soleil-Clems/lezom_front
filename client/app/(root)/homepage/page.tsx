import { ChannelSidebar } from "@/components/ui-client/chanelsidebar";
import MessageLayout from "@/components/ui-client/MessageLayout";
import { OnlineFriendsList } from "@/components/ui-client/onlinefriendlist";
import { ServerSidebar } from "@/components/ui-client/serversidebar";

export default function HomePage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#313338]">
      <ServerSidebar />
      <ChannelSidebar />
      
      {/* On force une bordure rouge sur le main et bleue sur l'aside 
          pour voir qui prend quelle place 
      */}
      <main className="flex-1 flex min-w-0 border-4 border-red-500">
        
        <div className="flex-1">
           <MessageLayout />
        </div>

        <aside className="w-80 bg-[#2B2D31] border-4 border-blue-500 flex flex-col shrink-0">
          <div className="p-4 text-white">TEST ASIDE VISIBLE</div>
          <OnlineFriendsList />
        </aside>
        
      </main>
    </div>
  )
}