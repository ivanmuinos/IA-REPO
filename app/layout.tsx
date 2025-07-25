import type React from "react"
import type { Metadata } from "next"
import { Inter, Source_Serif_4 } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { StagewiseToolbar } from "@stagewise/toolbar-next"
import ReactPlugin from "@stagewise-plugins/react"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"],
  variable: "--font-serif"
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

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
      <body className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <div className="layout-full-height bg-background">
            <TopBar />
            <div className="main-container">
              <Sidebar />
              <main className="main-content">
                <BreadcrumbNav />
                <div className="main-content-scroll">{children}</div>
              </main>
            </div>
          </div>
          <Toaster />
          {process.env.NODE_ENV === 'development' && (
            <StagewiseToolbar
              config={{
                plugins: [ReactPlugin]
              }}
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
