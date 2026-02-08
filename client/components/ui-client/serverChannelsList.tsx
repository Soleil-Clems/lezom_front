"use client";

import { ManagementCard } from "@/components/ui-client/managementcard";
import { useGetAllChannelsOfAServer } from "@/hooks/queries/useGetAllChannelsOfAServer";
import { useUpdateChannel, useDeleteChannel } from "@/hooks/mutations/updateServerSettings";

type ServerChannelsListProps = {
    serverId: string | number;
    isOwner: boolean;
};

export function ServerChannelsList({ serverId, isOwner }: ServerChannelsListProps) {
    const { data: serverData, isLoading } = useGetAllChannelsOfAServer(String(serverId));
    const updateChannel = useUpdateChannel();
    const deleteChannel = useDeleteChannel();

    if (isLoading) {
        return <div className="p-4 text-xs text-zinc-500 italic">Chargement...</div>;
    }

    const channels = serverData?.[0]?.channels || [];

    if (channels.length === 0) {
        return (
            <div className="p-4 text-center text-zinc-500 text-sm">
                Aucun salon sur ce serveur
            </div>
        );
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
                    onSave={(newName: string) => updateChannel.mutate({ id: channel.id, name: newName })}
                    onDelete={() => deleteChannel.mutate(channel.id)}
                    isPending={updateChannel.isPending || deleteChannel.isPending}
                    isOwner={isOwner}
                />
            ))}
        </div>
    );
}
