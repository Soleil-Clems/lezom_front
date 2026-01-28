import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ServerSidebar } from "@/components/ui-client/serversidebar"
import { ServerItem } from "@/components/ui-client/serverItem"

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
            <ServerItem name="RTC" />
            <ServerItem name="DEV" />
            <ServerItem name="DESIGN" />
          </ServerSidebar>

          <SidebarInset>
            
            <header className="flex h-12 items-center px-4 md:hidden border-b">
              <SidebarTrigger />
              <span className="ml-4 font-bold text-sm">Lezom</span>
            </header>

            
            <main className="flex-1 p-4">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}