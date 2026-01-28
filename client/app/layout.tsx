import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ServerSidebar } from "@/components/ui-client/serversidebar"
import { ServerItem } from "@/components/ui-client/serverItem"
import { MOCK_SERVERS } from "@/lib/mock-data" 

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Lezom",
  description: "Application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
  return (
    <html lang="fr" className="dark"> 
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <ServerSidebar>
            {MOCK_SERVERS.map((server) => (
              <ServerItem 
                key={server.id}
                id={server.id}
                name={server.name}
                image={server.image}
              />
            ))}
          </ServerSidebar>

          <SidebarInset>
            <header className="flex h-12 items-center px-4 md:hidden border-b bg-[#313338]">
              <SidebarTrigger />
              <span className="ml-4 font-bold text-sm text-white">Lezom</span>
            </header>

            <main className="flex-1 flex overflow-hidden">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}