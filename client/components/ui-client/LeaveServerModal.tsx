"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type LeaveServerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    serverName: string;
    isPending: boolean;
};

export function LeaveServerModal({
    isOpen,
    onClose,
    onConfirm,
    serverName,
    isPending,
}: LeaveServerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#313338] border-none text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-rose-400">Quitter le serveur</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Voulez-vous vraiment quitter le serveur{" "}
                        <span className="text-white font-medium">{serverName}</span> ?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isPending}
                        className="text-zinc-400 hover:text-white"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="bg-rose-500 hover:bg-rose-600 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Départ...
                            </>
                        ) : (
                            "Quitter"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
