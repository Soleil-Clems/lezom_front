"use client";

import { useState } from "react";
import { Pencil, Trash2, SmilePlus } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export interface MessageActionsProps {
    canEdit: boolean;
    canDelete: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onReact?: (emoji: string) => void;
}

export default function MessageActions({
    canEdit,
    canDelete,
    onEdit,
    onDelete,
    onReact,
}: MessageActionsProps) {
    const [open, setOpen] = useState(false);

    if (!canEdit && !canDelete && !onReact) return null;

    return (
        <div className="flex items-center gap-0.5 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-0.5">
            {onReact && (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-yellow-400 transition-colors">
                            <SmilePlus className="size-3.5" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-auto p-1.5 bg-zinc-800 border-zinc-700">
                        <div className="flex gap-1">
                            {QUICK_EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={(e) => { e.stopPropagation(); onReact(emoji); setOpen(false); }}
                                    className="text-lg p-1 rounded hover:bg-zinc-700 transition-colors"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
            {canEdit && (
                <button
                    onClick={onEdit}
                    className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                    <Pencil className="size-3.5" />
                </button>
            )}
            {canDelete && (
                <button
                    onClick={onDelete}
                    className="p-1.5 rounded hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                >
                    <Trash2 className="size-3.5" />
                </button>
            )}
        </div>
    );
}
