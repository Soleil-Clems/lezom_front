"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { MessageSquare, Plus, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { serversType } from "@/schemas/server.dto";
import { ServerItem } from "@/components/ui-client/serverItem";
import Error from "@/components/ui-client/Error";
import Loading from "@/components/ui-client/Loading";
import { useSocketServers } from "@/hooks/websocket/useSocketServers";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ModalServerContent } from "./modalserver";

export function ServerSidebar() {
  const { servers, loading, error } = useSocketServers();

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <TooltipProvider>
      <Sidebar collapsible="offcanvas" className="w-[280px] md:w-20 border-r-0 bg-[#1E1F22]">
        <SidebarHeader className="flex items-center justify-center py-4">
          <span className="text-[10px] font-bold tracking-tight text-muted-foreground hidden md:block uppercase">
            Serveurs
          </span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="flex flex-col items-start md:items-center gap-3 px-3">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href="/messages" className="group flex items-center gap-3 w-full outline-none">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[24px] bg-[#313338] text-indigo-400 transition-all duration-200 hover:rounded-[16px] hover:bg-indigo-500 hover:text-white">
                    <MessageSquare size={25} />
                  </div>
                  <span className="block md:hidden font-bold text-zinc-400 hover:text-white">
                    Messages privés
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden md:block">
                <p>Messages privés</p>
              </TooltipContent>
            </Tooltip>

            <Separator className="w-8 bg-zinc-600" />

            {servers.map((server: serversType, index: number) => (
              <ServerItem
                key={`${server.id}-${index}`}
                id={server.id}
                name={server.name}
                image={""}
              />
            ))}

            <Dialog>
              <Tooltip delayDuration={0}>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <button className="group flex items-center gap-3 w-full outline-none">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[24px] bg-[#313338] text-green-500 transition-all duration-200 hover:rounded-[16px] hover:bg-green-500 hover:text-white">
                        <Plus size={25} />
                      </div>
                      <span className="block md:hidden font-bold text-zinc-400 hover:text-white">
                        Ajouter un serveur
                      </span>
                    </button>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent side="right" className="hidden md:block">
                  <p>Ajouter un serveur</p>
                </TooltipContent>
              </Tooltip>
              <ModalServerContent />
            </Dialog>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="py-4 px-3 md:px-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-12 w-full md:w-12 p-0 hover:bg-transparent">
                <a href="/profil" className="group flex items-center gap-3 w-full md:justify-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition-all duration-200 hover:rounded-[16px]">
                    <User size={24} />
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}