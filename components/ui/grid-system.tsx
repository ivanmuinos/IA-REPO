import React from 'react'
import { cn } from '@/lib/utils'

// Tipos de grid
type GridType = '1' | '2' | '3' | '4' | 'auto' | 'problems' | 'features' | 'metrics' | 'testimonials' | 'countries'

// Props para el componente Grid
interface GridProps {
  type?: GridType
  className?: string
  children: React.ReactNode
  gap?: 'sm' | 'md' | 'lg'
}

// Componente Grid principal
export function Grid({ type = 'auto', className, children, gap = 'md' }: GridProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12'
  }

  const getGridClasses = (gridType: GridType) => {
    switch (gridType) {
      case '1': return 'grid-cols-1'
      case '2': return 'grid-cols-1 md:grid-cols-2'
      case '3': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case '4': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'auto': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'problems':
      case 'testimonials': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 'features': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'metrics':
      case 'countries': return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  const gridClasses = cn(
    "grid",
    gapClasses[gap],
    "items-stretch",
    getGridClasses(type),
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Props para el componente Section
interface SectionProps {
  className?: string
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

// Componente Section
export function Section({ className, children, padding = 'lg' }: SectionProps) {
  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20'
  }

  return (
    <section className={cn("section", paddingClasses[padding], className)}>
      {children}
    </section>
  )
}

// Props para el componente Container
interface ContainerProps {
  className?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

// Componente Container
export function Container({ className, children, maxWidth = 'lg' }: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn("container", "mx-auto px-6", maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  )
}

// Props para el componente SectionHeader
interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
  centered?: boolean
}

// Componente SectionHeader
export function SectionHeader({ title, subtitle, description, className, centered = true }: SectionHeaderProps) {
  return (
    <div className={cn(
      "section-header",
      "mb-16",
      centered && "text-center max-w-4xl mx-auto",
      className
    )}>
      {subtitle && (
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

// Componentes específicos por sección
export function ProblemsGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Grid type="problems" className={className}>
      {children}
    </Grid>
  )
}

export function FeaturesGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Grid type="features" className={className}>
      {children}
    </Grid>
  )
}

export function MetricsGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Grid type="metrics" className={className}>
      {children}
    </Grid>
  )
}

export function TestimonialsGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Grid type="testimonials" className={className}>
      {children}
    </Grid>
  )
}

export function CountriesGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Grid type="countries" className={className}>
      {children}
    </Grid>
  )
} 