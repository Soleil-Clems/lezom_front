"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserX } from "lucide-react";
import { useTranslations } from "next-intl";

const BAN_DURATIONS = [
    { labelKey: "duration1h", value: 1 },
    { labelKey: "duration6h", value: 6 },
    { labelKey: "duration12h", value: 12 },
    { labelKey: "duration24h", value: 24 },
    { labelKey: "duration3d", value: 72 },
    { labelKey: "duration7d", value: 168 },
    { labelKey: "duration30d", value: 720 },
    { labelKey: "durationPermanent", value: "permanent" as const },
] as const;

type DurationValue = number | "permanent" | null;

type BanModalContentProps = {
    username: string;
    onConfirm: (reason?: string, durationHours?: number) => void;
    onCancel: () => void;
    isPending: boolean;
};

export function BanModalContent({
    username,
    onConfirm,
    onCancel,
    isPending,
}: BanModalContentProps) {
    const t = useTranslations("ban");
    const tc = useTranslations("common");
    const [reason, setReason] = useState("");
    const [selectedDuration, setSelectedDuration] = useState<DurationValue>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDuration === null) return;
        const durationHours = selectedDuration === "permanent" ? undefined : selectedDuration;
        onConfirm(reason.trim() || undefined, durationHours);
    };

    return (
        <DialogContent className="bg-[#313338] border-none text-white sm:max-w-md">
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-rose-400" />
                    <DialogTitle>{t("banUser")}</DialogTitle>
                </div>
                <DialogDescription className="text-zinc-400">
                    {t("banConfirmDesc", { username })}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-zinc-400">
                        {t("duration")}
                        <span className="text-rose-400 ml-1">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {BAN_DURATIONS.map((d) => (
                            <button
                                key={d.labelKey}
                                type="button"
                                disabled={isPending}
                                onClick={() => setSelectedDuration(d.value)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    selectedDuration === d.value
                                        ? "bg-rose-500 text-white"
                                        : "bg-[#1e1f22] text-zinc-400 hover:bg-zinc-700"
                                }`}
                            >
                                {t(d.labelKey)}
                            </button>
                        ))}
                    </div>
                    {selectedDuration === null && (
                        <p className="text-xs text-zinc-500">{t("durationRequired")}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reason" className="text-zinc-400">
                        {t("reason")}
                    </Label>
                    <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={t("reasonPlaceholder")}
                        className="bg-[#1e1f22] border-none text-zinc-300"
                        disabled={isPending}
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isPending}
                        className="text-zinc-400 hover:text-white"
                    >
                        {tc("cancel")}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending || selectedDuration === null}
                        className="bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t("banning")}
                            </>
                        ) : (
                            t("confirmBan")
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
