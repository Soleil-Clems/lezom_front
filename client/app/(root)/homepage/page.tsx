import { ChannelSidebar } from "@/components/ui-client/chanelsidebar";
import MessageLayout from "@/components/ui-client/MessageLayout";
import { ServerItem } from "@/components/ui-client/serverItem";
import { ServerSidebar } from "@/components/ui-client/serversidebar";
import { MOCK_SERVERS } from "@/lib/mock-data";


export default function HomePage() {


  return (

    <div className="flex h-screen w-full overflow-hidden">
      <ChannelSidebar />
      <div className="flex-1">
        <MessageLayout />
      </div>
      
    </div>
  )
}