"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeMap: Record<string, string> = {
  flujos: "Flujos",
  personas: "Personas",
  juridico: "Jurídico",
  metricas: "Métricas",
  conectores: "Conectores",
  configuracion: "Configuración",
  nuevo: "Nuevo",
  editor: "Editor",
  "api-webhooks": "API & Webhooks",
  "parametros-generales": "Parámetros Generales",
  notificaciones: "Notificaciones",
  seguridad: "Seguridad",
  "usuarios-roles": "Usuarios y Roles",
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  
  // Generar breadcrumbs basado en la ruta actual
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [
      {
        label: "Inicio",
        href: "/",
        icon: <Home className="h-4 w-4" />,
      },
    ]

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      
      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <Breadcrumb className="px-6 py-1.5 border-b">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href || index} className="flex items-center">
            <BreadcrumbItem>
              {breadcrumb.href ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={breadcrumb.href}
                    className={cn(
                      "flex items-center gap-1 hover:text-foreground transition-colors",
                      index === 0 && "text-muted-foreground"
                    )}
                  >
                    {breadcrumb.icon}
                    <span className="hidden sm:inline">{breadcrumb.label}</span>
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1">
                  {breadcrumb.icon}
                  <span className="hidden sm:inline">{breadcrumb.label}</span>
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 