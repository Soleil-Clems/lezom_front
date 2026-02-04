"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, Loader2 } from "lucide-react";
import { BanType } from "@/schemas/ban.dto";

type BannedUserCardProps = {
    ban: BanType;
    onUnban: () => void;
    isPending: boolean;
};

export function BannedUserCard({ ban, onUnban, isPending }: BannedUserCardProps) {
    const formattedDate = new Date(ban.bannedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <Card className="bg-[#1E1F22] border-none">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <UserX className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                        <p className="text-white font-medium">{ban.user.username}</p>
                        <p className="text-xs text-zinc-500">
                            Banni {ban.bannedBy ? `par ${ban.bannedBy.username}` : ""} le {formattedDate}
                        </p>
                        {ban.reason && (
                            <p className="text-xs text-zinc-400 mt-1">
                                Raison: {ban.reason}
                            </p>
                        )}
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (confirm(`Voulez-vous vraiment débannir ${ban.user.username} ?`)) {
                            onUnban();
                        }
                    }}
                    disabled={isPending}
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Débannir"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
