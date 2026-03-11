"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MessagesPage() {
    const t = useTranslations("messages");

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-zinc-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
                {t("yourPrivateMessages")}
            </h2>

            <p className="text-zinc-400 max-w-md">
                {t("selectConversation")}
            </p>
        </div>
    );
}
