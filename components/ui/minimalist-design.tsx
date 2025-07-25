import React from "react"
import { cn } from "@/lib/utils"

// Contenedor con espacios en blanco generosos
export function SpaciousContainer({
  children,
  className,
  padding = "default",
}: {
  children: React.ReactNode
  className?: string
  padding?: "small" | "default" | "large"
}) {
  const paddingClasses = {
    small: "p-4",
    default: "p-6",
    large: "p-8",
  }

  return (
    <div className={cn("space-y-6", paddingClasses[padding], className)}>
      {children}
    </div>
  )
}

// Información secundaria en segundo plano
export function SecondaryInfo({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("text-sm text-muted-foreground opacity-75", className)}>
      {children}
    </div>
  )
}

// Jerarquía visual clara con títulos
export function VisualHierarchy({
  title,
  subtitle,
  children,
  level = 1,
  className,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
  level?: 1 | 2 | 3
  className?: string
}) {
  const titleClasses = {
    1: "text-2xl font-bold tracking-tight",
    2: "text-xl font-semibold",
    3: "text-lg font-medium",
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h2 className={titleClasses[level]}>{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground">{subtitle}</p>
      )}
      {children && (
        <div className="pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Separador visual sutil
export function SubtleDivider({
  className,
  orientation = "horizontal",
}: {
  className?: string
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
    />
  )
}

// Card minimalista sin bordes innecesarios
export function MinimalCard({
  children,
  className,
  padding = "default",
}: {
  children: React.ReactNode
  className?: string
  padding?: "small" | "default" | "large"
}) {
  const paddingClasses = {
    small: "p-3",
    default: "p-4",
    large: "p-6",
  }

  return (
    <div className={cn("bg-background rounded-lg", paddingClasses[padding], className)}>
      {children}
    </div>
  )
}

// Lista limpia sin bullets
export function CleanList({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul className={cn("space-y-1", className)}>
      {items.map((item, index) => (
        <li key={index} className="text-sm text-muted-foreground">
          {item}
        </li>
      ))}
    </ul>
  )
}

// Botón minimalista
export function MinimalButton({
  children,
  variant = "ghost",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "subtle"
}) {
  const variantClasses = {
    ghost: "hover:bg-muted/50",
    subtle: "text-muted-foreground hover:text-foreground",
  }

  return (
    <button
      className={cn(
        "px-3 py-2 rounded-md text-sm transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Grupo de elementos con espaciado consistente
export function ElementGroup({
  children,
  spacing = "default",
  className,
}: {
  children: React.ReactNode
  spacing?: "tight" | "default" | "loose"
  className?: string
}) {
  const spacingClasses = {
    tight: "space-y-2",
    default: "space-y-4",
    loose: "space-y-6",
  }

  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  )
}

// Indicador de estado sutil
export function SubtleStatus({
  status,
  className,
}: {
  status: "success" | "warning" | "error" | "info"
  className?: string
}) {
  const statusConfig = {
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
  }

  return (
    <div className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs", statusConfig[status], className)}>
      <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", {
        "bg-green-500": status === "success",
        "bg-yellow-500": status === "warning",
        "bg-red-500": status === "error",
        "bg-blue-500": status === "info",
      })} />
      {status}
    </div>
  )
}

// Layout con grid minimalista
export function MinimalGrid({
  children,
  columns = 1,
  gap = "default",
  className,
}: {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: "small" | "default" | "large"
  className?: string
}) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  const gapClasses = {
    small: "gap-3",
    default: "gap-4",
    large: "gap-6",
  }

  return (
    <div className={cn("grid", columnClasses[columns], gapClasses[gap], className)}>
      {children}
    </div>
  )
}

// Texto con tipografía limpia
export function CleanText({
  children,
  size = "default",
  weight = "normal",
  className,
}: {
  children: React.ReactNode
  size?: "small" | "default" | "large"
  weight?: "light" | "normal" | "medium" | "semibold"
  className?: string
}) {
  const sizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  }

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  }

  return (
    <p className={cn(sizeClasses[size], weightClasses[weight], "leading-relaxed", className)}>
      {children}
    </p>
  )
} 