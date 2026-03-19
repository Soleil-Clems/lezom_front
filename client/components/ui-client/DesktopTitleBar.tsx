"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useGetAllServers } from "@/hooks/queries/useGetAllServers";
import { serversType } from "@/schemas/server.dto";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LezomDesktop {
  isDesktop: boolean;
  platform: string;
}

const drag = { WebkitAppRegion: "drag" } as React.CSSProperties;
const noDrag = { WebkitAppRegion: "no-drag" } as React.CSSProperties;
const iconBtnClass = "p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors";

export default function DesktopTitleBar() {
  const [isDesktopMac, setIsDesktopMac] = useState(false);

  useEffect(() => {
    const desktop = (window as unknown as { lezomDesktop?: LezomDesktop }).lezomDesktop;
    if (desktop?.isDesktop && desktop.platform === "darwin") {
      setIsDesktopMac(true);
    }
  }, []);

  if (!isDesktopMac) return null;

  return <TitleBarContent />;
}

function TitleBarContent() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { data: servers } = useGetAllServers();

  const serverId = params?.serverId as string | undefined;
  const isInServer = pathname.startsWith("/servers/");
  const currentServer = isInServer && serverId && servers
    ? servers.find((s: serversType) => s.id.toString() === serverId)
    : null;

  const title = currentServer?.name ?? "Messages privés";

  return (
    <div
      className="h-[38px] w-full shrink-0 bg-[#1E1F22] flex items-center px-20 relative"
      style={drag}
    >
      <div className="flex items-center gap-1" style={noDrag}>
        <button onClick={() => router.back()} className={iconBtnClass}>
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => router.forward()} className={iconBtnClass}>
          <ChevronRight size={18} />
        </button>
      </div>

      <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-zinc-200 truncate max-w-[300px]">
        {title}
      </span>
    </div>
  );
}
