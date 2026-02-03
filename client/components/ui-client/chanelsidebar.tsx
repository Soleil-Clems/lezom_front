"use client"
import Link from "next/link";
import {Hash, UserPlus, Volume2} from "lucide-react";
import {MOCK_CHANNELS} from "@/lib/mock-data";
import {SidebarMenuButton} from "../ui/sidebar";
import Error from "@/components/ui-client/Error";
import Loading from "@/components/ui-client/Loading";
import {useGetAllChannelsOfAServer} from "@/hooks/queries/useGetAllChannelsOfAServer";
import {channelType} from "@/schemas/channel.dto";
import {ServerSettingsDropdown} from "./dropdownMenu";


type ChannelSidebarProps = {
    serverId?: string;
    channelId?: string;
}

export function ChannelSidebar({serverId, channelId}: ChannelSidebarProps) {

    if (!serverId) {
        return (
            <div
                className="w-60 h-full bg-[#2B2D31] flex flex-col items-center justify-center p-4 text-zinc-500 text-center">
                <p>Sélectionnez un serveur pour voir les salons</p>
            </div>
        );
    }

    const {data, isLoading, isError} = useGetAllChannelsOfAServer(serverId);
/*    console.log(data);*/
    if (isLoading) {
        return <Loading/>
    }
    if (isError) {
        return <Error/>
    }

    const channels: channelType[] = data[0].channels || [];

    return (
        <div className="w-full md:w-60 h-full bg-[#2B2D31] flex flex-col shrink-0 border-r border-black/20">
            <div
                className="h-12 px-4 flex items-center justify-between shadow-sm border-b border-black/20 font-bold text-white shrink-0">
                Salons
                <div className="flex items-center">
                    <ServerSettingsDropdown/>
                </div>
            </div>


            <div className="flex-1 overflow-y-auto p-2 space-y-[2px]">
                {channels.map((channel) => {
                    const isActive = channel.id.toString() === channelId;

                    return (
                        <Link
                            key={channel.id}
                            href={`/servers/${serverId}/${channel.id}`}
                            className={`
                flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors group
                ${isActive
                                ? "bg-zinc-700/60 text-white rounded-md"
                                : "text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200 rounded-md"}
      `}

                        >
                            {channel.type === "text" ? (
                                <Hash className={`w-5 h-5 shrink-0 ${isActive ? "text-zinc-200" : "text-zinc-500"}`}/>
                            ) : (
                                <Volume2
                                    className={`w-5 h-5 shrink-0 ${isActive ? "text-zinc-200" : "text-zinc-500"}`}/>
                            )}

                            <span className={`truncate font-medium ${isActive ? "text-white" : ""}`}>
        {channel.name}
      </span>
                        </Link>
                    );
                })}

                {channels.length === 0 && (
                    <p className="text-xs text-zinc-500 text-center mt-4">Aucun salon trouvé</p>
                )}
            </div>
        </div>
    )
}