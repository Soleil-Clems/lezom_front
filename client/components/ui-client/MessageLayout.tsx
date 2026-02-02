"use client"
import MessageScreenComponent from './MessageScreenComponent'
import Message from '@/components/ui-client/messageComponent'
import {useGetAllMessagesOfAChannel} from "@/hooks/queries/useGetAllMessagesOfAChannel";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";

export default function MessageLayout({channelId}: { channelId?: string }) {
    if (!channelId) {
        return
    }
    const {data: messages, isLoading, isError} = useGetAllMessagesOfAChannel(channelId);

    if (isLoading) {
        return <Loading/>;
    }

    if (isError) {
        return <Error/>;
    }


    return (
        <div className='flex flex-col w-full h-full overflow-hidden bg-[#313338]'>

            <div className="flex-1 overflow-y-auto">
                <MessageScreenComponent messages={messages}/>
            </div>

            <div className="shrink-0">
                <Message channelId={channelId}/>
            </div>

        </div>
    )
}