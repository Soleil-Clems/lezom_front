"use client";

import { useState } from "react";
import { useGetFriends } from "@/hooks/queries/useGetFriends";
import { useSearchUsers } from "@/hooks/queries/useSearchUsers";
import { useSendFriendRequest } from "@/hooks/mutations/useSendFriendRequest";
import { friendUserType } from "@/schemas/friend.dto";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AddFriendButton() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { data: friends } = useGetFriends();
    const { data: results, isLoading } = useSearchUsers(query);
    const { mutate: sendRequest, isPending } = useSendFriendRequest();

    const friendIds = new Set((friends as friendUserType[] ?? []).map((f) => f.id));

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery(""); }}>
            <DialogTrigger asChild>
                <button className="w-20% mx-3 my-2 px-4 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-medium transition-colors">
                    Ajouter un ami
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#313338] border-zinc-700 text-zinc-200 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Ajouter un ami</DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher un utilisateur..."
                        autoFocus
                        className="w-full bg-zinc-900 text-sm text-zinc-300 placeholder-zinc-500 rounded-md px-3 py-2 outline-none border border-zinc-700 focus:border-zinc-500 transition-colors"
                    />
                    <div className="mt-3 flex flex-col gap-1 max-h-64 overflow-y-auto discord-scrollbar">
                        {query.trim().length < 2 && (
                            <p className="text-xs text-zinc-500 px-1">Tape au moins 2 caractères pour rechercher.</p>
                        )}
                        {query.trim().length >= 2 && isLoading && (
                            <p className="text-xs text-zinc-400 px-1">Recherche...</p>
                        )}
                        {query.trim().length >= 2 && !isLoading && (!results || results.length === 0) && (
                            <p className="text-xs text-zinc-400 px-1">Aucun résultat</p>
                        )}
                        {query.trim().length >= 2 && !isLoading && results?.map((user: friendUserType) => {
                            const isAlreadyFriend = friendIds.has(user.id);
                            return (
                                <div key={user.id} className="flex items-center justify-between gap-2 px-2 py-2 rounded-md hover:bg-zinc-700/50 transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-600 flex items-center justify-center text-[11px] font-semibold text-white uppercase">
                                            {user.username.substring(0, 2)}
                                        </div>
                                        <span className="text-sm text-zinc-200 truncate">{user.username}</span>
                                    </div>
                                    {isAlreadyFriend ? (
                                        <span className="text-xs text-zinc-500 shrink-0">Déjà ami</span>
                                    ) : (
                                        <button
                                            onClick={() => { sendRequest(user.id); setOpen(false); setQuery(""); }}
                                            disabled={isPending}
                                            className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0 disabled:opacity-50 px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors"
                                        >
                                            + Ajouter
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
