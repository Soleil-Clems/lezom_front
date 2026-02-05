"use client"

import { useParams } from 'next/navigation'
import MessageScreenComponent from './MessageScreenComponent'
import Message from '@/components/ui-client/messageComponent'
import Loading from "@/components/ui-client/Loading";
import { useSocketMessages } from "@/hooks/websocket/useSocketMessages";
import { OnlineFriendsList } from "@/components/ui-client/onlinefriendlist";

export default function MessageLayout({channelId}: { channelId: string }) {
    const params = useParams();
    const serverId = params.serverId as string;
    
    const {messages, isLoading, typingUsers} = useSocketMessages(channelId);

    if (isLoading) return <Loading/>;

    return (
        <div className='flex flex-row w-full h-full overflow-hidden bg-[#313338]'>
            <div className='flex flex-col flex-1 min-w-0 h-full relative'>
                <div className="flex-1 overflow-y-auto">
                    <MessageScreenComponent messages={messages} typingUsers={typingUsers} />
                </div>
                <div className="shrink-0">
                    <Message channelId={channelId} />
                </div>
            </div>

            <OnlineFriendsList serverId={serverId} />
        </div>
    );
}