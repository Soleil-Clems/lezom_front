"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar"

interface ServerSidebarProps {
  children: React.ReactNode;
}

export function ServerSidebar({ children }: ServerSidebarProps) {
  return (
    <Sidebar variant="sidebar" className="w-20 border-r-0 bg-[#1E1F22]"> 
      <SidebarHeader className="flex justify-center py-4">
        <span className="text-[10px] font-bold tracking-tight text-muted-foreground">
          Serveurs
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="flex flex-col items-center gap-3">
          {children}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}