"use client";

import React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 hover:bg-zinc-700"
                >
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-zinc-800 border-zinc-700"
            >
                {canEdit && (
                    <DropdownMenuItem
                        onClick={onEdit}
                        className="cursor-pointer text-zinc-200 focus:bg-indigo-600 focus:text-white"
                    >
                        <Pencil className="size-4" />
                        Modifier
                    </DropdownMenuItem>
                )}
                {canDelete && (
                    <DropdownMenuItem
                        onClick={onDelete}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        <Trash2 className="size-4" />
                        Supprimer
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
