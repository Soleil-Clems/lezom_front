"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchUsers } from "@/hooks/queries/useSearchUsers";
import { useSendFriendRequest } from "@/hooks/mutations/useSendFriendRequest";
import { useGetFriends } from "@/hooks/queries/useGetFriends";
import { friendUserType } from "@/schemas/friend.dto";

export default function FriendSearchBar() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: results, isLoading } = useSearchUsers(query);
    const { data: friends } = useGetFriends();
    const { mutate: sendRequest, isPending } = useSendFriendRequest();

    const friendIds = new Set((friends as friendUserType[] ?? []).map((f) => f.id));

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative px-3 py-2">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Trouver ou démarrer une conversation"
                className="w-full bg-zinc-900 text-sm text-zinc-300 placeholder-zinc-500 rounded-md px-3 py-1.5 outline-none border border-zinc-700 focus:border-zinc-500 transition-colors"
            />

            {open && query.trim().length >= 2 && (
                <div className="absolute left-3 right-3 top-full mt-1 z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                    {isLoading && (
                        <p className="text-xs text-zinc-400 px-3 py-2">Recherche...</p>
                    )}
                    {!isLoading && (!results || results.length === 0) && (
                        <p className="text-xs text-zinc-400 px-3 py-2">Aucun résultat</p>
                    )}
                    {!isLoading && results?.map((user: friendUserType) => {
                        const isAlreadyFriend = friendIds.has(user.id);
                        return (
                            <div
                                key={user.id}
                                className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-zinc-700 transition-colors"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="h-7 w-7 shrink-0 rounded-full bg-zinc-600 flex items-center justify-center text-[11px] font-semibold text-white uppercase">
                                        {user.username.substring(0, 2)}
                                    </div>
                                    <span className="text-sm text-zinc-200 truncate">{user.username}</span>
                                </div>
                                {isAlreadyFriend ? (
                                    <span className="text-xs text-zinc-500 shrink-0">Ami</span>
                                ) : (
                                    <button
                                        onClick={() => {
                                            sendRequest(user.id);
                                            setOpen(false);
                                            setQuery("");
                                        }}
                                        disabled={isPending}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0 disabled:opacity-50"
                                    >
                                        + Ajouter
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
