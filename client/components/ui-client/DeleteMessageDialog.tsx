"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DeleteMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function DeleteMessageDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
}: DeleteMessageDialogProps) {
    const t = useTranslations("messageDialog");
    const tc = useTranslations("common");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">
                        {t("deleteMessage")}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {t("deleteMessageConfirm")}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        {tc("cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? tc("deleting") : tc("delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
