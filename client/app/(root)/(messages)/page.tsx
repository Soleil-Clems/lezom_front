"use client";

import { useState } from "react";
import FriendList from "@/components/ui-client/FriendList";
import AddFriendButton from "@/components/ui-client/AddFriendButton";
import { useGetPendingRequests } from "@/hooks/queries/useGetPendingRequests";
import { friendRequestType } from "@/schemas/friend.dto";

type Tab = "online" | "all" | "pending";

export default function MessagesPage() {
    const [tab, setTab] = useState<Tab>("online");
    const { data: pendingRequests } = useGetPendingRequests();
    const pendingCount = (pendingRequests as friendRequestType[] ?? []).length;

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="h-12 px-4 flex items-center gap-3 border-b border-zinc-700 shrink-0">
                <span className="font-semibold text-white border-r border-zinc-600 pr-4 shrink-0">Amis</span>

                <div className="flex items-center gap-1">
                    <TabButton label="En ligne" active={tab === "online"} onClick={() => setTab("online")} />
                    <TabButton label="Tous" active={tab === "all"} onClick={() => setTab("all")} />
                    <TabButton
                        label="En attente"
                        active={tab === "pending"}
                        onClick={() => setTab("pending")}
                        badge={pendingCount}
                    />
                </div>

                <div className="ml-auto">
                    <AddFriendButton />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto discord-scrollbar">
                <FriendList filter={tab} />
            </div>
        </div>
    );
}

function TabButton({
    label,
    active,
    onClick,
    badge,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    badge?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium transition-colors ${
                active
                    ? "bg-zinc-600/60 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/40"
            }`}
        >
            {label}
            {badge != null && badge > 0 && (
                <span className="bg-red-500 text-white rounded-full px-1.5 py-px text-[10px] leading-none">
                    {badge}
                </span>
            )}
        </button>
    );
}
