import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
  variant?: "default" | "overlay" | "inline"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
}

export function LoadingSpinner({ 
  size = "md", 
  className, 
  text,
  variant = "default" 
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  )

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && (
            <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        {spinner}
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      {spinner}
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Componente para estados de carga de secciones
export function SectionLoading({ 
  title = "Cargando...",
  description = "Obteniendo información"
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-3">
        <LoadingSpinner size="sm" />
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Componente para estados de carga de páginas completas
export function PageLoading({ 
  title = "Cargando página",
  description = "Preparando la información para ti"
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Componente para estados de carga de tablas
export function TableLoading({ 
  rows = 5,
  columns = 4 
}: {
  rows?: number
  columns?: number
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted animate-pulse rounded flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 bg-muted animate-pulse rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
} 