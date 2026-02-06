"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Shield, Loader2, Sword, ChevronDown } from "lucide-react";

type MemberRole = "server_member" | "server_admin" | "server_owner";

type MemberCardProps = {
    member: {
        id: number;
        username: string;
        role?: string;
    };
    currentUserRole?: string;
    isCurrentUser?: boolean;
    onBan: () => void;
    onRoleChange?: (newRole: MemberRole) => void;
    isPending: boolean;
    isRoleChangePending?: boolean;
};

export function MemberCard({
    member,
    currentUserRole,
    isCurrentUser = false,
    onBan,
    onRoleChange,
    isPending,
    isRoleChangePending = false
}: MemberCardProps) {
    const isOwner = member.role === "server_owner";
    const isAdmin = member.role === "server_admin";

    const currentUserIsOwner = currentUserRole === "server_owner";
    const currentUserIsAdmin = currentUserRole === "server_admin";

    const canBan = !isCurrentUser && !isOwner && (currentUserIsOwner || currentUserIsAdmin);

    const canChangeRole = onRoleChange && !isCurrentUser && (
        (currentUserIsOwner && !isOwner) ||
        (currentUserIsAdmin && member.role === "server_member")
    );

    const getAvailableRoles = (): { value: MemberRole; label: string }[] => {
        if (currentUserIsOwner) {
            if (isAdmin) {
                return [
                    { value: "server_member", label: "Membre" },
                    { value: "server_owner", label: "Propriétaire" }
                ];
            } else {
                return [
                    { value: "server_admin", label: "Administrateur" },
                    { value: "server_owner", label: "Propriétaire" }
                ];
            }
        } else if (currentUserIsAdmin && member.role === "server_member") {
            return [{ value: "server_admin", label: "Administrateur" }];
        }
        return [];
    };

    const getRoleIcon = () => {
        if (isOwner) {
            return <Shield className="w-5 h-5 text-amber-400" />;
        } else if (isAdmin) {
            return <Sword className="w-5 h-5 text-emerald-400" />;
        }
        return <User className="w-5 h-5 text-indigo-400" />;
    };

    const getRoleBadge = () => {
        if (isOwner) {
            return (
                <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    Propriétaire
                </span>
            );
        } else if (isAdmin) {
            return (
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    Admin
                </span>
            );
        }
        return null;
    };

    return (
        <Card className="bg-[#1E1F22] border-none">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        {getRoleIcon()}
                    </div>
                    <div>
                        <p className="text-white font-medium flex items-center gap-2">
                            {member.username}
                            {isCurrentUser && (
                                <span className="text-xs text-zinc-500">(vous)</span>
                            )}
                            {getRoleBadge()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {canChangeRole && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isRoleChangePending}
                                    className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                                >
                                    {isRoleChangePending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Changer rôle
                                            <ChevronDown className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#1E1F22] border-white/10">
                                {getAvailableRoles().map((role) => (
                                    <DropdownMenuItem
                                        key={role.value}
                                        onClick={() => onRoleChange(role.value)}
                                        className="text-zinc-300 hover:text-white focus:text-white focus:bg-indigo-500/20"
                                    >
                                        {role.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {canBan && (
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
                </div>
            </CardContent>
        </Card>
    );
}
