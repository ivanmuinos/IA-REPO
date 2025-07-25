"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export function BreadcrumbNav({ items = [], showHome = true, className = "" }: BreadcrumbNavProps) {
  const pathname = usePathname()
  
  // Generar breadcrumbs automáticamente si no se proporcionan
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Mapear segmentos a labels más legibles
      const label = getSegmentLabel(segment, index, segments)
      
      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : currentPath,
      })
    })
    
    return breadcrumbs
  }
  
  const getSegmentLabel = (segment: string, index: number, segments: string[]): string => {
    // Mapeo de segmentos comunes
    const labelMap: Record<string, string> = {
      'personas': 'Personas',
      'juridico': 'Jurídico',
      'flujos': 'Flujos',
      'configuracion': 'Configuración',
      'metricas': 'Métricas',
      'conectores': 'Conectores',
      'editor': 'Editor',
      'nuevo': 'Nuevo',
    }
    
    // Si es un ID (número), usar el contexto del segmento anterior
    if (/^\d+$/.test(segment)) {
      const previousSegment = segments[index - 1]
      if (previousSegment === 'personas') {
        return 'Detalle de Persona'
      }
      if (previousSegment === 'juridico') {
        return 'Detalle de Empresa'
      }
      if (previousSegment === 'flujos') {
        return 'Detalle de Flujo'
      }
      return 'Detalle'
    }
    
    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs()
  
  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {showHome && (
        <>
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
        </>
      )}
      
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center hover:text-foreground transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4 mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center text-foreground font-medium">
              {item.icon && <item.icon className="h-4 w-4 mr-1" />}
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="h-4 w-4 ml-1" />
          )}
        </div>
      ))}
    </nav>
  )
} 