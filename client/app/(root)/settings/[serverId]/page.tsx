"use client"
import React from 'react'
import { useRouter } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Settings2, Server, Hash, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ManagementCard } from "@/components/ui-client/managementcard" 

import { useAuthUser } from '@/hooks/queries/useAuthUser' 
import { useGetAllServers } from '@/hooks/queries/useGetAllServers' 
import { useGetAllChannelsOfAServer } from '@/hooks/queries/useGetAllChannelsOfAServer'

import { useUpdateServer, useDeleteServer, useUpdateChannel, useDeleteChannel } from "@/hooks/mutations/updateServerSettings"

function ServerChannelsList({ serverId }: { serverId: string | number }) {
const { data: serverData, isLoading } = useGetAllChannelsOfAServer(String(serverId));  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();

  if (isLoading) return <div className="p-4 text-xs text-zinc-500 italic">Chargement...</div>;

  const channels = serverData?.[0]?.channels || [];

  return (
    <div className="space-y-3 p-4">
      {channels.map((channel: any) => (
        <ManagementCard 
          key={channel.id}
          id={channel.id}
          label="Nom du salon"
          initialValue={channel.name} 
          type="channel"
          onSave={(newName: string) => updateChannel.mutate({ id: channel.id, name: newName })}
          onDelete={() => deleteChannel.mutate(channel.id)}
          isPending={updateChannel.isPending || deleteChannel.isPending}
        />
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useAuthUser();
  const { data: allServersData, isLoading: serversLoading } = useGetAllServers();

  const updateServer = useUpdateServer();
  const deleteServer = useDeleteServer();

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
          <div className="flex items-center gap-3 text-white">
            <Settings2 className="w-8 h-8 text-zinc-400" />
            <h1 className="text-2xl font-bold">Paramètres</h1>
          </div>
          <Button variant="ghost" onClick={() => router.back()} className="text-zinc-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </header>

        <Tabs defaultValue="servers">
          <TabsList className="bg-[#1E1F22] mb-6">
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
                onSave={(newName: string) => updateServer.mutate({ id: server.id, name: newName })}
                onDelete={() => deleteServer.mutate(server.id)}
                isPending={updateServer.isPending || deleteServer.isPending}
              />
            ))}
          </TabsContent>

          <TabsContent value="channels" className="space-y-8 outline-none">
            {myServers.map((server: any) => (
              <div key={server.id} className="bg-[#2B2D31] rounded-xl border border-white/5 overflow-hidden">
                <div className="bg-[#1E1F22] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                   <Server size={14} className="text-indigo-400" />
                   <span className="text-xs font-bold uppercase text-zinc-300 tracking-wider">{server.name}</span>
                </div>
                <ServerChannelsList serverId={server.id} />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}