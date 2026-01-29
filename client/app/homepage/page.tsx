import { ServerSidebar } from "@/components/ui-client/serversidebar"
import { ChannelSidebar } from "@/components/ui-client/chanelsidebar" 
import { ServerItem } from "@/components/ui-client/serverItem"
import { MOCK_SERVERS } from "@/lib/mock-data"
import MessageLayout from "@/components/ui-client/MessageLayout"

export default function HomePage() {
  
  
  
  return (
    <>
      {/* <main className="flex flex-col  h-full overflow-y-auto"> */}
      <ServerSidebar>
        {MOCK_SERVERS.map((server) => (
          <ServerItem 
            key={server.id} 
            id={server.id} 
            name={server.name} 
            image={server.image} 
          />
        ))}
      </ServerSidebar>
      <ChannelSidebar/>
      <MessageLayout/>
      
      {/* </main> */}
    </>
  )

  
}