import { ChannelSidebar } from "@/components/ui-client/chanelsidebar";
import MessageLayout from "@/components/ui-client/MessageLayout";
import { ServerItem } from "@/components/ui-client/serverItem";
import { ServerSidebar } from "@/components/ui-client/serversidebar";
import { MOCK_SERVERS } from "@/lib/mock-data";

// app/homepage/page.tsx
export default function HomePage() {
  return (
    // Le parent DOIT être flex pour aligner les colonnes
    <div className="flex h-screen w-full overflow-hidden">
      
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

      {/* On peut maintenant l'appeler sans serverId car on l'a rendu optionnel */}
      <ChannelSidebar />
      
      {/* Zone de chat vide ou message de bienvenue */}
      <div className="flex-1">
        <MessageLayout />
      </div>
      
    </div>
  )
}