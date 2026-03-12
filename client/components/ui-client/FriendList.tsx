"use client";

import { useRouter } from "next/navigation";
import { useGetFriends } from "@/hooks/queries/useGetFriends";
import { useGetPendingRequests } from "@/hooks/queries/useGetPendingRequests";
import { useOnlineUserIds } from "@/hooks/queries/useOnlineUserIds";
import { useAcceptFriendRequest } from "@/hooks/mutations/useAcceptFriendRequest";
import { useDeclineFriendRequest } from "@/hooks/mutations/useDeclineFriendRequest";
import { useRemoveFriend } from "@/hooks/mutations/useRemoveFriend";
import { useCreateConversation } from "@/hooks/mutations/useCreateConversation";
import { friendUserType, friendRequestType } from "@/schemas/friend.dto";
import { useState } from "react";

export default function FriendList() {
    const router = useRouter();
    const [showPending, setShowPending] = useState(false);

    const { data: friends } = useGetFriends();
    const { data: pendingRequests } = useGetPendingRequests();
    const { data: onlineIds } = useOnlineUserIds();

    const { mutate: acceptRequest } = useAcceptFriendRequest();
    const { mutate: declineRequest } = useDeclineFriendRequest();
    const { mutate: removeFriend } = useRemoveFriend();
    const { mutate: createConversation } = useCreateConversation();

    const friendsList = (friends as friendUserType[]) ?? [];
    const pendingList = (pendingRequests as friendRequestType[]) ?? [];
    const onlineSet = new Set(onlineIds ?? []);

    const onlineFriends = friendsList.filter((f) => onlineSet.has(f.id));
    const offlineFriends = friendsList.filter((f) => !onlineSet.has(f.id));

    const handleOpenConversation = (userId: number) => {
        createConversation(
            { userId },
            {
                onSuccess: (data: any) => {
                    router.push(`/conversation/${data.id}`);
                },
            }
        );
    };

    return (
        <div className="px-3 py-2">
            {/* Titre section */}
            <p className="px-1 pb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                Liste d&apos;amis
            </p>

            {/* Demandes en attente */}
            <div className="mb-1">
                <button
                    onClick={() => setShowPending((v) => !v)}
                    className="w-full flex items-center justify-between px-1 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wide hover:text-zinc-300 transition-colors"
                >
                    <span>Demandes d&apos;ami en attente</span>
                    {pendingList.length > 0 && (
                        <span className="bg-indigo-500 text-white rounded-full px-1.5 text-[10px]">
                            {pendingList.length}
                        </span>
                    )}
                </button>

                {showPending && pendingList.length === 0 && (
                    <p className="text-xs text-zinc-600 px-2 py-1">Aucune demande en attente</p>
                )}

                {showPending && pendingList.map((req: friendRequestType) => (
                    <div key={req.id} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-zinc-700/50">
                        <div className="h-7 w-7 shrink-0 rounded-full bg-zinc-600 flex items-center justify-center text-[11px] font-semibold text-white uppercase">
                            {req.sender.username.substring(0, 2)}
                        </div>
                        <span className="text-sm text-zinc-300 flex-1 truncate">{req.sender.username}</span>
                        <button
                            onClick={() => acceptRequest(req.id)}
                            className="text-xs text-green-400 hover:text-green-300"
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => declineRequest(req.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Amis en ligne */}
            {onlineFriends.length > 0 && (
                <div className="mb-1">
                    <p className="px-1 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        En ligne — {onlineFriends.length}
                    </p>
                    {onlineFriends.map((friend) => (
                        <FriendItem
                            key={friend.id}
                            friend={friend}
                            isOnline={true}
                            onMessage={() => handleOpenConversation(friend.id)}
                            onRemove={() => removeFriend(friend.id)}
                        />
                    ))}
                </div>
            )}

            {/* Amis hors ligne */}
            {offlineFriends.length > 0 && (
                <div>
                    <p className="px-1 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        Hors ligne — {offlineFriends.length}
                    </p>
                    {offlineFriends.map((friend) => (
                        <FriendItem
                            key={friend.id}
                            friend={friend}
                            isOnline={false}
                            onMessage={() => handleOpenConversation(friend.id)}
                            onRemove={() => removeFriend(friend.id)}
                        />
                    ))}
                </div>
            )}

            {friendsList.length === 0 && (
                <p className="text-xs text-zinc-600 px-2 py-1">Aucun ami pour l&apos;instant</p>
            )}
        </div>
    );
}

function FriendItem({
    friend,
    isOnline,
    onMessage,
    onRemove,
}: {
    friend: friendUserType;
    isOnline: boolean;
    onMessage: () => void;
    onRemove: () => void;
}) {
    const [showActions, setShowActions] = useState(false);

    return (
        <div
            className="group relative flex items-center gap-2 px-2 py-2 rounded-md hover:bg-zinc-700/50 cursor-pointer transition-colors"
            onClick={onMessage}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="relative shrink-0">
                <div className="h-7 w-7 rounded-full bg-zinc-600 flex items-center justify-center text-[11px] font-semibold text-white uppercase">
                    {friend.username.substring(0, 2)}
                </div>
                <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-800 ${
                        isOnline ? "bg-green-500" : "bg-zinc-500"
                    }`}
                />
            </div>
            <span className="text-sm text-zinc-300 flex-1 truncate">{friend.username}</span>

            {showActions && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-1"
                    title="Supprimer"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
