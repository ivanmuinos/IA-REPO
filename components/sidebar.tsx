"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  Plug,
  Home,
  ChevronLeft,
  ChevronRight,
  Plus,
  Activity,
  Briefcase,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  className?: string
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  badge?: string
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: "Panel principal",
    href: "/",
    icon: Home,
    description: "Resumen y métricas generales",
  },
  {
    name: "Flujos",
    href: "/flujos",
    icon: FileText,
    description: "Gestiona tus flujos de onboarding",
    badge: "4",
  },
  {
    name: "Personas",
    href: "/personas",
    icon: Users,
    description: "Usuarios en proceso de verificación",
    badge: "12",
  },
  {
    name: "Jurídico",
    href: "/juridico",
    icon: Briefcase,
    description: "Empresas en proceso de verificación KYB",
    badge: "3",
  },
  {
    name: "Métricas",
    href: "/metricas",
    icon: BarChart3,
    description: "Analiza el rendimiento de tus flujos",
  },
  {
    name: "Conectores",
    href: "/conectores",
    icon: Plug,
    description: "Integraciones y APIs externas",
  },
  {
    name: "Configuración",
    href: "/configuracion",
    icon: Settings,
    description: "Ajustes generales del sistema",
  },
]

const QUICK_ACTIONS: Omit<NavigationItem, "badge">[] = [
  {
    name: "Crear flujo",
    href: "/flujos/nuevo",
    icon: Plus,
    description: "Diseña un nuevo flujo de verificación",
  },
  {
    name: "Ver actividad",
    href: "/metricas",
    icon: Activity,
    description: "Monitorea la actividad en tiempo real",
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

    const linkContent = (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
          isCollapsed && "justify-center px-2",
        )}
        aria-label={isCollapsed ? `${item.name}: ${item.description}` : undefined}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <Badge variant={isActive ? "secondary" : "outline"} className="h-5 text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    )

    return isCollapsed ? (
      <Tooltip key={item.name}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col gap-1">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.description}</span>
          {item.badge && (
            <Badge variant="outline" className="w-fit">
              {item.badge} pendientes
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    ) : (
      linkContent
    )
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Navegación</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
            aria-label={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-1">Principal</p>
            )}
            {NAVIGATION_ITEMS.map((item) => renderNavigationItem(item))}
          </div>

          {!isCollapsed && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-1">
                  Acciones rápidas
                </p>
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <action.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{action.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>

        {!isCollapsed && (
          <div className="border-t p-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium">Sistema operativo</span>
              </div>
              <p className="text-xs text-muted-foreground">Todos los servicios funcionan correctamente</p>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
