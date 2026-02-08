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

type DeleteConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName: string;
    isPending: boolean;
    confirmLabel?: string;
    pendingLabel?: string;
};

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    isPending,
    confirmLabel = "Supprimer",
    pendingLabel = "Suppression...",
}: DeleteConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#313338] border-none text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-rose-400">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {message} <span className="text-white font-medium">{itemName}</span> ?
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
                                {pendingLabel}
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
