"use client"

import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Settings2, Server, Hash, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useAuthUser } from '@/hooks/queries/useAuthUser' 
import { useGetAllServers } from '@/hooks/queries/useGetAllServers' 
import { useGetAllChannelsOfAServer } from '@/hooks/queries/useGetAllChannelsOfAServer'
import { 
  updateServerNameRequest, 
  deleteServerRequest, 
  updateChannelNameRequest, 
  deleteChannelRequest 
} from "@/requests/serverRequest"

import { ManagementCard } from "@/components/ui-client/managementcard" 

/**
 * COMPOSANT : Liste des salons
 * Ajusté pour boucler sur serverData[0].channels
 */
function ServerChannelsList({ serverId, updateMutation, deleteMutation }: any) {
  const { data: serverData, isLoading } = useGetAllChannelsOfAServer(serverId);

  if (isLoading) return <div className="p-4 text-xs text-zinc-500 italic">Chargement des salons...</div>;

  // --- LA CORRECTION EST ICI ---
  // Ton log montre que la donnée est dans serverData[0].channels
  const channels = serverData?.[0]?.channels || [];

  if (channels.length === 0) {
    return <p className="text-zinc-500 text-[11px] italic p-6">Aucun salon trouvé pour ce serveur.</p>;
  }

  return (
    <div className="space-y-3 p-4">
      {channels.map((channel: any) => (
        <ManagementCard 
          key={channel.id}
          id={channel.id}
          label="Nom du salon"
          initialValue={channel.name} 
          type="channel"
          showId={false} // On masque l'ID pour le front
          onSave={(newName: string) => updateMutation.mutate({ id: channel.id, name: newName, type: 'channel' })}
          onDelete={() => deleteMutation.mutate({ id: channel.id, type: 'channel' })}
          isPending={updateMutation.isPending || deleteMutation.isPending}
        />
      ))}
    </div>
  );
}

/**
 * PAGE PRINCIPALE
 */
export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: authLoading } = useAuthUser();
  const { data: allServersData, isLoading: serversLoading } = useGetAllServers();

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, type }: { id: string | number, name: string, type: 'server' | 'channel' }) => {
      return type === 'server' ? await updateServerNameRequest(id, name) : await updateChannelNameRequest(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allservers"] });
      queryClient.invalidateQueries({ queryKey: ["server"] }); // Invalide les listes de salons
      alert("Enregistré !");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string | number, type: 'server' | 'channel' }) => {
      return type === 'server' ? await deleteServerRequest(id) : await deleteChannelRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allservers"] });
      queryClient.invalidateQueries({ queryKey: ["server"] });
      alert("Supprimé !");
    }
  });

  if (authLoading || serversLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#313338]">
      <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
    </div>
  );

  const myServers = Array.isArray(allServersData) ? allServersData : (allServersData as any)?.data || [];

  return (
    <div className="flex-1 bg-[#313338] h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-zinc-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
          </div>
          <Button variant="ghost" onClick={() => router.back()} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </header>

        <Tabs defaultValue="servers">
          <TabsList className="bg-[#1E1F22] mb-6 border-none p-1">
            <TabsTrigger value="servers" className="px-10">Serveurs</TabsTrigger>
            <TabsTrigger value="channels" className="px-10">Salons</TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-4 outline-none">
            {myServers.map((server: any) => (
              <ManagementCard 
                key={server.id}
                id={server.id}
                label="Nom du serveur"
                initialValue={server.name}
                type="server"
                showId={false}
                onSave={(newName: string) => updateMutation.mutate({ id: server.id, name: newName, type: 'server' })}
                onDelete={() => deleteMutation.mutate({ id: server.id, type: 'server' })}
                isPending={updateMutation.isPending || deleteMutation.isPending}
              />
            ))}
          </TabsContent>

          <TabsContent value="channels" className="space-y-8 outline-none">
            {myServers.map((server: any) => (
              <div key={server.id} className="bg-[#2B2D31] rounded-xl border border-white/5 overflow-hidden shadow-sm">
                <div className="bg-[#1E1F22] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                   <Server size={14} className="text-indigo-400" />
                   <span className="text-xs font-bold uppercase text-zinc-300 tracking-wider">
                     {server.name}
                   </span>
                </div>
                
                <ServerChannelsList 
                  serverId={server.id} 
                  updateMutation={updateMutation} 
                  deleteMutation={deleteMutation} 
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}