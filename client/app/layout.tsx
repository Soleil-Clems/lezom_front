import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ServerSidebar } from "@/components/ui-client/serversidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <ServerSidebar {children} />

          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
