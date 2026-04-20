import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ServerSidebar } from "@/components/ui-client/serversidebar";
import SocketProvider from "@/providers/SocketProvider";
import AuthGuard from "@/components/ui-client/AuthGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <AuthGuard>
        <main className="dark flex-1 min-h-0">
          <SidebarProvider className="min-h-0 h-full">
            <div className="flex h-full w-full overflow-hidden bg-[#1E1F22]">
              <ServerSidebar />

              <SidebarInset className="flex-1 flex flex-col min-w-0 bg-[#313338]">
                <header className="flex h-12 shrink-0 items-center px-4 md:hidden border-b border-black/20 bg-[#313338]">
                  <SidebarTrigger />
                  <span className="ml-4 font-bold text-sm text-white">Lezom</span>
                </header>

                <main className="flex-1 flex overflow-hidden">{children}</main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </main>
      </AuthGuard>
    </SocketProvider>
  );
}
