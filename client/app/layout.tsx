import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider"
import "./globals.css";
import {Toaster} from "@/components/ui/sonner"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Lezom RTC",
    description: "Application de communication en temps réel",
    icons: {
        icon: "/lezom.svg",
        shortcut: "/lezom.svg",
        apple: "lezom.svg"
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-own-dark`}
        >
            <ReactQueryProvider>
                {children}
            </ReactQueryProvider>
            <Toaster position="top-center"/>
        </body>
        </html>
    );
}