"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserX } from "lucide-react";

type BanModalContentProps = {
    username: string;
    onConfirm: (reason?: string) => void;
    onCancel: () => void;
    isPending: boolean;
};

export function BanModalContent({
    username,
    onConfirm,
    onCancel,
    isPending,
}: BanModalContentProps) {
    const [reason, setReason] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(reason.trim() || undefined);
    };

    return (
        <DialogContent className="bg-[#313338] border-none text-white sm:max-w-md">
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-rose-400" />
                    <DialogTitle>Bannir un utilisateur</DialogTitle>
                </div>
                <DialogDescription className="text-zinc-400">
                    Vous êtes sur le point de bannir <span className="text-white font-medium">{username}</span>.
                    Cette action peut être annulée ultérieurement.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reason" className="text-zinc-400">
                        Raison (optionnel)
                    </Label>
                    <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Entrez une raison..."
                        className="bg-[#1e1f22] border-none text-zinc-300"
                        disabled={isPending}
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isPending}
                        className="text-zinc-400 hover:text-white"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-rose-500 hover:bg-rose-600 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Bannissement...
                            </>
                        ) : (
                            "Confirmer le bannissement"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
