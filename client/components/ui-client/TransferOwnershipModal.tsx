"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Crown } from "lucide-react";
import { useGetServerMembers } from "@/hooks/queries/useGetServerMembers";
import { MembershipType } from "@/schemas/member.dto";

type TransferOwnershipModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newOwnerId: number) => void;
    onDeleteServer: () => void;
    serverId: string | number;
    serverName: string;
    currentUserId: number;
    isPending: boolean;
};

export function TransferOwnershipModal({
    isOpen,
    onClose,
    onConfirm,
    onDeleteServer,
    serverId,
    serverName,
    currentUserId,
    isPending,
}: TransferOwnershipModalProps) {
    const [search, setSearch] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

    const { data: membersData, isLoading } = useGetServerMembers(serverId, {
        search: search || undefined,
        limit: 50,
    });

    const members = membersData?.data || [];
    const filteredMembers = members.filter(
        (membership: MembershipType) => membership.members.id !== currentUserId
    );

    const isAlone = filteredMembers.length === 0 && search === "";

    const handleClose = () => {
        setSearch("");
        setSelectedMemberId(null);
        onClose();
    };

    const handleConfirm = () => {
        if (selectedMemberId) {
            onConfirm(selectedMemberId);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="bg-[#313338] border-none text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-rose-400">
                        {isAlone ? "Supprimer le serveur" : "Transférer la propriété et quitter"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {isAlone ? (
                            <>
                                Vous êtes le seul membre du serveur{" "}
                                <span className="text-white font-medium">{serverName}</span>.
                                <br />
                                Le serveur sera supprimé si vous le quittez.
                            </>
                        ) : (
                            <>
                                Vous êtes le propriétaire du serveur{" "}
                                <span className="text-white font-medium">{serverName}</span>.
                                <br />
                                Sélectionnez un nouveau propriétaire avant de quitter.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {!isAlone && (
                    <div className="py-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Rechercher un membre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-[#1e1f22] border-none text-white placeholder:text-zinc-500"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                                </div>
                            ) : filteredMembers.length === 0 ? (
                                <p className="text-center text-zinc-500 py-4">
                                    Aucun membre trouvé
                                </p>
                            ) : (
                                filteredMembers.map((membership: MembershipType) => (
                                    <button
                                        key={membership.id}
                                        type="button"
                                        onClick={() => setSelectedMemberId(membership.members.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                            selectedMemberId === membership.members.id
                                                ? "bg-[#5865f2] text-white"
                                                : "hover:bg-[#3f4147] text-zinc-300"
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-medium">
                                            {membership.members.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="flex-1 text-left truncate">
                                            {membership.members.username}
                                        </span>
                                        {selectedMemberId === membership.members.id && (
                                            <Crown className="w-4 h-4 text-yellow-400" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isPending}
                        className="text-zinc-400 hover:text-white"
                    >
                        Annuler
                    </Button>
                    {isAlone ? (
                        <Button
                            type="button"
                            onClick={onDeleteServer}
                            disabled={isPending}
                            className="bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                "Supprimer le serveur"
                            )}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isPending || !selectedMemberId}
                            className="bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Transfert...
                                </>
                            ) : (
                                "Transférer et quitter"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
