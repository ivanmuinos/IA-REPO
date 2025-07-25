"use client"

import { Bell, Search, Settings, User, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNavSheet } from "@/components/mobile-nav-sheet"
import { ConnectionIndicator } from "@/components/ui/loading-states"
import Image from "next/image"

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <MobileNavSheet />
            <div className="flex items-center gap-3">
              <Image
                src="https://i.postimg.cc/HLqVXFP1/Guardline-ISO.png"
                alt="Guardline Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="font-semibold text-lg">Onboarding Platform</h1>
                <p className="text-xs text-muted-foreground">Gestiona tus flujos de verificación</p>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda central */}
          <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar flujos, personas o configuración..."
                className="pl-10 h-10 focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Búsqueda global"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-4">
            {/* Indicador de conexión */}
            <ConnectionIndicator connected={true} lastSync="Hace 2 min" />
            
            {/* Ayuda */}
            <Button variant="ghost" size="icon" aria-label="Centro de ayuda">
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* Notificaciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notificaciones
                  <Badge variant="secondary" className="text-xs">
                    3 nuevas
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-2 p-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="font-medium text-sm">Flujo pendiente de revisión</span>
                    <Badge variant="outline" className="ml-auto text-xs">Urgente</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El flujo "KYC Empresas" tiene 5 personas esperando aprobación manual
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-6 text-xs">
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 text-xs">
                        Marcar
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium text-sm">Integración completada</span>
                  </div>
                  <p className="text-xs text-muted-foreground">El conector con Supabase se configuró correctamente</p>
                  <span className="text-xs text-muted-foreground">Hace 1 día</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center p-2">
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver todas las notificaciones
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Toggle de tema */}
            <ThemeToggle />

            {/* Menú de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menú de usuario">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Juan Pérez</p>
                    <p className="text-xs text-muted-foreground">juan.perez@empresa.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
