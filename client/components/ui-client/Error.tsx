"use client";

import React from 'react'
import { useTranslations } from "next-intl";

export default function Error() {
    const t = useTranslations("common");

    return (
        <div className="min-h-screen bg-own-dark flex items-center justify-center p-6">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md bg-purple-discord">
                <p className="text-white font-medium ">{t("error")}</p>
            </div>
        </div>
    )
}