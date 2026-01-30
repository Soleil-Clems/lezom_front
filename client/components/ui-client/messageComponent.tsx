"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Send, UserPlus } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

export default function Message() {
    return (
        
    <div className="w-full bottom-0 px-4 pb-4">
        <SidebarMenuButton asChild className="h-12 w-full md:w-12 p-0 hover:bg-transparent fixed top-4 right-4">
                <a href="/users" className="group flex items-center gap-3 w-full md:justify-center">
                  <div className="flex h-6 w-8 shrink-0 items-center justify-center text-white transition-all duration-200 hover:rounded-[16px]">
                    <UserPlus size={24} />
                  </div>
                </a>
                </SidebarMenuButton>
        <div className="flex items-end gap-2 rounded-2xl bg-[#1E1F22] p-2 shadow-lg">
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
