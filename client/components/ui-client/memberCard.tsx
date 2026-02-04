"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Loader2 } from "lucide-react";

type MemberCardProps = {
    member: {
        id: number;
        username: string;
        role?: string;
    };
    onBan: () => void;
    isPending: boolean;
};

export function MemberCard({ member, onBan, isPending }: MemberCardProps) {
    const isOwner = member.role === "server_owner";

    return (
        <Card className="bg-[#1E1F22] border-none">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        {isOwner ? (
                            <Shield className="w-5 h-5 text-amber-400" />
                        ) : (
                            <User className="w-5 h-5 text-indigo-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-white font-medium flex items-center gap-2">
                            {member.username}
                            {isOwner && (
                                <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                    Propriétaire
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                {!isOwner && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBan}
                        disabled={isPending}
                        className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Bannir"
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
