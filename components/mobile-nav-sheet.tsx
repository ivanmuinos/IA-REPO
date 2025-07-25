"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Workflow, Users, Scale, BarChart3, Settings, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Flujos",
    href: "/flujos",
    icon: Workflow,
  },
  {
    name: "Personas",
    href: "/personas",
    icon: Users,
  },
  {
    name: "Jurídico",
    href: "/juridico",
    icon: Scale,
  },
  {
    name: "Métricas",
    href: "/metricas",
    icon: BarChart3,
  },
  {
    name: "Conectores",
    href: "/conectores",
    icon: Zap,
  },
  {
    name: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
]

export function MobileNavSheet() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>KYx Platform</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <Separator className="my-4" />
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Acceso Rápido</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/flujos/nuevo" onClick={() => setOpen(false)}>
                  Nuevo Flujo
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/personas" onClick={() => setOpen(false)}>
                  Ver Personas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 