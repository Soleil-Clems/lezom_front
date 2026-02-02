import React from "react";
import {messageType} from "@/schemas/message.dto";
import {useAuthUser} from "@/hooks/queries/useAuthUser";
import Loading from "@/components/ui-client/Loading";
import Error from "@/components/ui-client/Error";

export default function MessageScreenComponent({messages}: {messages: messageType[]}) {
    const {data: user, isLoading, isError} = useAuthUser();

    if (isLoading) {
        return <Loading/>;
    }

    if (isError) {
        return <Error/>;
    }


    const formatDate = (dateString: Date | undefined) => {
        // @ts-ignore
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Hier';
        } else if (days < 7) {
            return date.toLocaleDateString('fr-FR', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        }
    };

    return (
        <div className="w-full p-4 space-y-4">
            {messages.map((message) => {
                const isMyMessage = message.author.id === user?.id;

                return (
                    <div
                        key={message.id}
                        className={`flex flex-col gap-1 ${isMyMessage ? 'items-end' : 'items-start'}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isMyMessage ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                {isMyMessage ? 'Moi' : `${message.author.firstname} ${message.author.lastname}`}
                            </span>
                            <span className="text-xs text-zinc-500">
                                {formatDate(message.createdAt)}
                            </span>
                        </div>
                        <div
                            className={`p-3 max-w-[80%] ${
                                isMyMessage
                                    ? 'bg-indigo-600 rounded-l-xl rounded-br-xl text-white'
                                    : 'bg-[#383a40] rounded-r-xl rounded-bl-xl text-zinc-200'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}