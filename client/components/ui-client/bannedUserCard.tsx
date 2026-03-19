"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { UserX, Loader2 } from "lucide-react";
import { BanType } from "@/schemas/ban.dto";

type BannedUserCardProps = {
    ban: BanType;
    isPending: boolean;
    onOpenUnbanModal: (ban: BanType) => void;
};

export function BannedUserCard({ ban, isPending, onOpenUnbanModal }: BannedUserCardProps) {
    const t = useTranslations("ban");
    const locale = useLocale();

    const formattedDate = new Date(ban.bannedAt).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedExpiry = ban.expiresAt
        ? new Date(ban.expiresAt).toLocaleDateString(locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

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
                            {t("bannedBy", { username: ban.bannedBy?.username ?? "", date: formattedDate })}
                        </p>
                        {ban.reason && (
                            <p className="text-xs text-zinc-400 mt-1">
                                {t("reasonLabel", { reason: ban.reason })}
                            </p>
                        )}
                        {formattedExpiry ? (
                            <p className="text-xs text-amber-400 mt-1">
                                {t("expiresAt", { date: formattedExpiry })}
                            </p>
                        ) : (
                            <p className="text-xs text-rose-400 mt-1">
                                {t("permanent")}
                            </p>
                        )}
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenUnbanModal(ban)}
                    disabled={isPending}
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        t("unban")
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
