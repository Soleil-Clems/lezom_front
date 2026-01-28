import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ServerSidebar } from "@/components/ui-client/serversidebar"

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
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <ServerSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
