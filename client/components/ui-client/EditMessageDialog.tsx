"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialContent: string;
    onSave: (content: string) => void;
    isLoading?: boolean;
}

export default function EditMessageDialog({
    open,
    onOpenChange,
    initialContent,
    onSave,
    isLoading = false,
}: EditMessageDialogProps) {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        if (open) {
            setContent(initialContent);
        }
    }, [open, initialContent]);

    const handleSave = () => {
        if (content.trim() && content !== initialContent) {
            onSave(content.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === "Escape") {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">
                        Modifier le message
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full min-h-[100px] p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Votre message..."
                        autoFocus
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                        Appuyez sur Entrée pour sauvegarder, Shift+Entrée pour une nouvelle ligne
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading || !content.trim() || content === initialContent}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
