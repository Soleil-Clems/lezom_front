import {SidebarProvider, SidebarInset, SidebarTrigger} from "@/components/ui/sidebar"
import {ServerSidebar} from "@/components/ui-client/serversidebar"
import SocketProvider from "@/providers/SocketProvider";

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode
}) {
    return (
        <SocketProvider>
            <main className="dark">
                <SidebarProvider>
                    <div className="flex h-screen w-full overflow-hidden bg-[#1E1F22]">

                        <ServerSidebar/>

                        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-[#313338]">
                            <header
                                className="flex h-12 shrink-0 items-center px-4 md:hidden border-b border-black/20 bg-[#313338]">
                                <SidebarTrigger/>
                                <span className="ml-4 font-bold text-sm text-white">Lezom</span>
                            </header>

                            <main className="flex-1 flex overflow-hidden">
                                {children}
                            </main>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </main>
        </SocketProvider>
    )
}