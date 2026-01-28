"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Plus, User } from "lucide-react" 

interface ServerSidebarProps {
  children: React.ReactNode;
}

export function ServerSidebar({ children }: ServerSidebarProps) {
  return (
    <Sidebar 
      collapsible="offcanvas" 
      className="w-[280px] md:w-20 border-r-0 bg-[#1E1F22]"
    > 
      <SidebarHeader className="flex items-center justify-center py-4">
        <span className="text-[10px] font-bold tracking-tight text-muted-foreground md:block hidden">
          SERVEURS
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="flex flex-col items-start md:items-center gap-3 px-3">
          {children}

          <button className="group flex items-center gap-3 w-full outline-none">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[24px] bg-[#313338] text-green-500 transition-all duration-200 group-hover:rounded-[16px] group-hover:bg-green-500 group-hover:text-white">
              <Plus size={25} />
            </div>
            <span className="block md:hidden font-bold text-zinc-400 group-hover:text-white">
              Ajouter un serveur
            </span>
          </button>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="py-4 px-3 md:px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 w-full md:w-12 p-0 hover:bg-transparent">
              <a href="/profil" className="group flex items-center gap-3 w-full md:justify-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition-all duration-200 group-hover:rounded-[16px]">
                  <User size={24} />
                </div>
                <span className="block md:hidden font-bold text-zinc-400 group-hover:text-white">
                  Mon Profil
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}