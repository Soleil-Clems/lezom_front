"use client";

import AddFriendButton from "@/components/ui-client/AddFriendButton";
import FriendList from "@/components/ui-client/FriendList";

export default function MessagesPage() {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="h-12 px-5 flex items-center border-b border-zinc-700 shrink-0">
                <h2 className="font-semibold text-white">Amis</h2>
            </div>

            <div className="shrink-0 border-b border-zinc-700">
                <AddFriendButton />
            </div>

            <div className="flex-1 overflow-y-auto">
                <FriendList />
            </div>
        </div>
    );
}
