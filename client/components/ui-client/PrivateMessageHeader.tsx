"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userType } from "@/schemas/user.dto";

interface PrivateMessageHeaderProps {
    otherUser: userType | null;
}

export default function PrivateMessageHeader({ otherUser }: PrivateMessageHeaderProps) {
    if (!otherUser) return null;

    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700 bg-[#313338]">
            <Link href="/" className="md:hidden">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5 text-zinc-400" />
                </Button>
            </Link>

            <span className="font-semibold text-white">
                {otherUser.username}
            </span>
        </div>
    );
}
