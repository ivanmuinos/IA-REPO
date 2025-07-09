"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { clientThemeService, type Theme } from "@/lib/theme-service"

interface ThemeContextType {
  theme: Theme | null
  loading: boolean
  error: Error | null
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  loading: false,
  error: null,
})

export function useFlowTheme() {
  return useContext(ThemeContext)
}

interface FlowThemeProviderProps {
  flowId: string
  children: ReactNode
}

export function FlowThemeProvider({ flowId, children }: FlowThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadTheme = async () => {
      if (!flowId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const flowTheme = await clientThemeService.getThemeByFlowId(flowId)
        setTheme(flowTheme)
      } catch (err) {
        console.error("Error loading theme:", err)
        setError(err instanceof Error ? err : new Error("Error desconocido al cargar el tema"))
      } finally {
        setLoading(false)
      }
    }

    loadTheme()
  }, [flowId])

  return <ThemeContext.Provider value={{ theme, loading, error }}>{children}</ThemeContext.Provider>
}

// Componente para aplicar el tema al flujo
export function FlowThemeApplier({ children }: { children: ReactNode }) {
  const { theme, loading } = useFlowTheme()

  if (loading || !theme) {
    return <>{children}</>
  }

  // Crear un estilo global basado en el tema
  const themeStyle = {
    "--flow-primary-color": theme.primary_color,
    "--flow-secondary-color": theme.secondary_color,
    "--flow-text-color": theme.text_color || "#333333",
    "--flow-bg-color": theme.bg_color,
    "--flow-font-family": theme.font_family || "Inter",
  } as React.CSSProperties

  return (
    <div style={themeStyle} className="flow-theme-container">
      {children}
    </div>
  )
}
