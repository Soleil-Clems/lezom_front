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
import { MessageSquare, UserMinus } from "lucide-react";

type Filter = "online" | "all" | "pending";

export default function FriendList({ filter = "all" }: { filter?: Filter }) {
    const router = useRouter();

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

    /* ── Onglet En attente ── */
    if (filter === "pending") {
        return (
            <div className="px-4 py-3">
                <p className="px-1 pb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    Demandes en attente — {pendingList.length}
                </p>
                {pendingList.length === 0 && (
                    <p className="text-sm text-zinc-500 px-1">Aucune demande en attente</p>
                )}
                {pendingList.map((req: friendRequestType) => (
                    <div
                        key={req.id}
                        className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-zinc-700/50 border-t border-zinc-700/40"
                    >
                        <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-600 flex items-center justify-center text-sm font-semibold text-white uppercase">
                            {req.sender.username.substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-200 truncate">{req.sender.username}</p>
                            <p className="text-xs text-zinc-500">Demande d&apos;ami reçue</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => acceptRequest(req.id)}
                                className="p-1.5 rounded-full bg-zinc-700 hover:bg-green-600 text-zinc-300 hover:text-white transition-colors"
                                title="Accepter"
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => declineRequest(req.id)}
                                className="p-1.5 rounded-full bg-zinc-700 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors"
                                title="Refuser"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    /* ── Onglet En ligne / Tous ── */
    return (
        <div className="px-4 py-3">
            {filter === "online" && onlineFriends.length === 0 && (
                <p className="text-sm text-zinc-500 px-1">Aucun ami en ligne</p>
            )}
            {filter === "all" && friendsList.length === 0 && (
                <p className="text-sm text-zinc-500 px-1">Aucun ami pour l&apos;instant</p>
            )}

            {filter === "online" ? (
                <>
                    {onlineFriends.length > 0 && (
                        <p className="px-1 pb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            En ligne — {onlineFriends.length}
                        </p>
                    )}
                    {onlineFriends.map((friend) => (
                        <FriendItem
                            key={friend.id}
                            friend={friend}
                            isOnline={true}
                            onMessage={() => handleOpenConversation(friend.id)}
                            onRemove={() => removeFriend(friend.id)}
                        />
                    ))}
                </>
            ) : (
                <>
                    {onlineFriends.length > 0 && (
                        <>
                            <p className="px-1 pb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
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
                        </>
                    )}
                    {offlineFriends.length > 0 && (
                        <>
                            <p className="px-1 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
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
                        </>
                    )}
                </>
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
    return (
        <div className="group flex items-center gap-3 px-3 py-3 rounded-md hover:bg-zinc-700/50 border-t border-zinc-700/40 transition-colors">
            <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-zinc-600 flex items-center justify-center text-sm font-semibold text-white uppercase">
                    {friend.username.substring(0, 2)}
                </div>
                <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#313338] ${
                        isOnline ? "bg-green-500" : "bg-zinc-500"
                    }`}
                />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{friend.username}</p>
                <p className="text-xs text-zinc-500">{isOnline ? "En ligne" : "Hors ligne"}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={onMessage}
                    className="p-1.5 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white transition-colors"
                    title="Envoyer un message"
                >
                    <MessageSquare className="w-4 h-4" />
                </button>
                <button
                    onClick={onRemove}
                    className="p-1.5 rounded-full bg-zinc-700 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors"
                    title="Supprimer l'ami"
                >
                    <UserMinus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
