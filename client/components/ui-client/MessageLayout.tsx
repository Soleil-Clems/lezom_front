"use client"
import MessageScreenComponent from './MessageScreenComponent'
import Message from '@/components/ui-client/messageComponent'
import Loading from "@/components/ui-client/Loading";
import { useSocketMessages } from "@/hooks/websocket/useSocketMessages";

export default function MessageLayout({ channelId }: { channelId: string }) {
    const { messages, isLoading, typingUsers } = useSocketMessages(channelId);

    if (isLoading) return <Loading />;

    return (
        <div className='flex flex-col w-full h-full overflow-hidden bg-[#313338]'>
            <div className="flex-1 overflow-y-auto">
                {/* On passe typingUsers au composant d'affichage */}
                <MessageScreenComponent
                    messages={messages}
                    typingUsers={typingUsers}
                />
            </div>
            <div className="shrink-0">
                <Message channelId={channelId} />
            </div>
        </div>
    );
}