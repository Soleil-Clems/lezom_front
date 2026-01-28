"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";

export default function Message() {
    return (
    <div className="w-full bottom-0 px-4 pb-4">
        <div className="flex items-end gap-2 rounded-2xl bg-[#1E1F22] p-2 shadow-lg">
        {/* Textarea + bouton + */}
        <div className="relative flex-1">
            <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute left-2 bottom-2 h-8 w-8 rounded-full"
            >
            <Plus className="h-5 w-5 text-gray-300" />
            </Button>

            <Textarea
            placeholder="Écris ton message..."
            className="min-h-[44px] resize-none border-0 bg-transparent pl-12 pr-4 text-gray-100 focus-visible:ring-0"
            />
        </div>

        <Button
            type="button"
            size="icon"
            className="h-10 w-10 rounded-xl bg-purple-discord text-white hover:bg-gray-400"
        >
            <Send className="h-5 w-5" />
        </Button>
        </div>
    </div>
    );
}
