"use client";

import { useState } from "react";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemberCard } from "@/components/ui-client/memberCard";
import { useGetServerMembers } from "@/hooks/queries/useGetServerMembers";
import { useUpdateMemberRole } from "@/hooks/mutations/updateServerSettings";
import { useBanUser } from "@/hooks/mutations/useBanManagement";
import { useTransferOwnership } from "@/hooks/mutations/useTransferOwnership";

type MemberRole = "server_member" | "server_admin" | "server_owner";

type ServerMembersListProps = {
    serverId: string | number;
    currentUserId: number;
    currentUserRole?: string;
    onOpenBanModal: (member: { id: number; username: string }) => void;
};

export function ServerMembersList({
    serverId,
    currentUserId,
    currentUserRole,
    onOpenBanModal
}: ServerMembersListProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const limit = 20;

    const { data, isLoading } = useGetServerMembers(serverId, { page, limit, search });
    const banUser = useBanUser();
    const updateMemberRole = useUpdateMemberRole();
    const transferOwnership = useTransferOwnership();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleRoleChange = (memberId: number, newRole: MemberRole) => {
        if (newRole === "server_owner") {
            transferOwnership.mutate({ serverId, newOwnerId: memberId });
        } else {
            updateMemberRole.mutate({ serverId, memberId, role: newRole });
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
        );
    }

    const rawMembers = data?.data || [];
    const meta = data?.meta;

    const members = [...rawMembers].sort((a, b) => {
        if (a.role === b.role) {
            const aIsCurrentUser = a.members?.id === currentUserId;
            const bIsCurrentUser = b.members?.id === currentUserId;
            if (aIsCurrentUser) return -1;
            if (bIsCurrentUser) return 1;
        }
        return 0;
    });

    return (
        <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        type="text"
                        placeholder="Rechercher un membre..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-9 bg-[#1E1F22] border-white/10 text-white placeholder:text-zinc-500"
                    />
                </div>
                <Button type="submit" variant="secondary" size="sm">
                    Rechercher
                </Button>
            </form>

            {members.length === 0 ? (
                <div className="text-center text-zinc-500 text-sm py-4">
                    {search ? "Aucun membre trouvé" : "Aucun membre sur ce serveur"}
                </div>
            ) : (
                <div className="space-y-3">
                    {members.map((membership) => {
                        const isCurrentUser = membership.members?.id === currentUserId;
                        return (
                            <MemberCard
                                key={membership.id}
                                member={{
                                    id: membership.members?.id,
                                    username: membership.members?.username,
                                    role: membership.role,
                                }}
                                currentUserRole={currentUserRole}
                                isCurrentUser={isCurrentUser}
                                onBan={() => onOpenBanModal({
                                    id: membership.members?.id,
                                    username: membership.members?.username
                                })}
                                onRoleChange={(newRole) => handleRoleChange(membership.members?.id, newRole)}
                                isPending={banUser.isPending}
                                isRoleChangePending={updateMemberRole.isPending || transferOwnership.isPending}
                            />
                        );
                    })}
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-zinc-500">
                        {meta.total} membre{meta.total > 1 ? "s" : ""} - Page {meta.page}/{meta.totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={!meta.hasPreviousPage}
                            className="border-white/10 text-zinc-400 hover:text-white disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!meta.hasNextPage}
                            className="border-white/10 text-zinc-400 hover:text-white disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
