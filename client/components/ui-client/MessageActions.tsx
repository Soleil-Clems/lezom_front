"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageActionsProps {
    canEdit: boolean;
    canDelete: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export default function MessageActions({
    canEdit,
    canDelete,
    onEdit,
    onDelete,
}: MessageActionsProps) {
    if (!canEdit && !canDelete) return null;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-0.5 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-0.5">
                {canEdit && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={onEdit}
                                className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                            >
                                <Pencil className="size-3.5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-zinc-900 text-xs">
                            Modifier
                        </TooltipContent>
                    </Tooltip>
                )}
                {canDelete && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={onDelete}
                                className="p-1.5 rounded hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-zinc-900 text-xs">
                            Supprimer
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );
}
