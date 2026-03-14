"use client";

import { Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import FriendList from "@/components/ui-client/FriendList";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader,
    SheetClose,
} from "@/components/ui/sheet";

function FriendsSidebarContent({ showClose = false }: { showClose?: boolean }) {
    const t = useTranslations("friends");

    return (
        <div className="flex flex-col h-full bg-[#2B2D31] text-zinc-300 w-full overflow-hidden border-l border-black/10">
            <div className="h-12 border-b border-black/20 flex items-center justify-between px-4 shrink-0">
                <span className="opacity-70 text-[11px] uppercase tracking-widest font-bold">{t("activeNow")}</span>
                {showClose && (
                    <SheetClose className="p-1 hover:bg-white/10 rounded-md transition outline-none">
                        <X className="w-5 h-5 text-zinc-400" />
                    </SheetClose>
                )}
            </div>

            <div className="flex-1 overflow-y-auto discord-scrollbar">
                <FriendList filter="all" />
            </div>
        </div>
    );
}

export function FriendsSidebar() {
    const t = useTranslations("friends");

    return (
        <>
            <Sidebar side="right" collapsible="none" className="hidden xl:flex w-60 border-l border-black/20 shrink-0">
                <SidebarContent className="bg-[#2B2D31]">
                    <FriendsSidebarContent />
                </SidebarContent>
            </Sidebar>

            <div className="xl:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="fixed top-3 right-4 z-40 p-2 text-zinc-400 hover:text-white bg-[#313338]/80 backdrop-blur-sm rounded-full border border-white/5 shadow-xl">
                            <Users className="w-5 h-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 w-[280px] bg-[#2B2D31] border-none [&>button]:hidden">
                        <SheetHeader className="sr-only">
                            <SheetTitle>{t("activeNow")}</SheetTitle>
                        </SheetHeader>
                        <FriendsSidebarContent showClose={true} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
