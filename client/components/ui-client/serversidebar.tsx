import { Sidebar, SidebarContent, SidebarGroup } from "../ui/sidebar"

type Props = {
  children: React.ReactNode
}

export function ServerSidebar({ children }: Props) {
  return (
    <Sidebar variant="sidebar" className="w-20">
      <SidebarContent>
        <SidebarGroup className="flex flex-col items-center gap-3">
          {children}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
