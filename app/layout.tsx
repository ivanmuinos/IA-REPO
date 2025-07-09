import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Onboarding Platform - Gestiona tus flujos de verificación",
  description: "Plataforma integral para crear, gestionar y optimizar flujos de onboarding y verificación de identidad",
  keywords: ["onboarding", "verificación", "KYC", "identidad", "flujos"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <TopBar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 overflow-hidden">
                <div className="h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">{children}</div>
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
