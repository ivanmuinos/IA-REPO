import React from 'react'
import { cn } from '@/lib/utils'

// Tipos de cards
type CardType = 'default' | 'problem' | 'feature' | 'metric' | 'testimonial' | 'country'

// Props base para todas las cards
interface BaseCardProps {
  type?: CardType
  className?: string
  children: React.ReactNode
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'destructive'
  }
  icon?: React.ReactNode
  onClick?: () => void
}

// Props específicas para metric cards
interface MetricCardProps {
  number: string | number
  label: string
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
}

// Props específicas para testimonial cards
interface TestimonialCardProps {
  quote: string
  author: {
    name: string
    role: string
    company?: string
  }
  className?: string
}

// Props específicas para country cards
interface CountryCardProps {
  flag: string
  name: string
  regulator: string
  className?: string
}

// Props específicas para problem cards
interface ProblemCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
}

// Props específicas para feature cards
interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'destructive'
  }
  className?: string
}

// Componente principal de Card
export function Card({ className, children, badge, icon, onClick, ...props }: BaseCardProps) {
  const baseClasses = cn(
    "flex flex-col p-8 rounded-xl relative transition-all duration-300 ease-in-out h-full min-h-[280px]",
    "bg-card border border-border shadow-sm",
    "hover:transform hover:-translate-y-1 hover:shadow-lg",
    onClick && "cursor-pointer",
    className
  )

  const badgeClasses = cn(
    "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
    {
      'bg-primary text-primary-foreground': badge?.variant === 'default' || !badge?.variant,
      'bg-green-500 text-white': badge?.variant === 'success',
      'bg-yellow-500 text-white': badge?.variant === 'warning',
      'bg-destructive text-destructive-foreground': badge?.variant === 'destructive',
    }
  )

  const iconClasses = cn(
    "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
    "bg-primary/10 text-primary"
  )

  return (
    <div className={baseClasses} onClick={onClick}>
      {badge && (
        <div className={badgeClasses}>
          {badge.text}
        </div>
      )}
      
      {icon && (
        <div className={iconClasses}>
          {icon}
        </div>
      )}
      
      {children}
    </div>
  )
}

// Componente CardHeader
export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("card-header", "flex items-start justify-between mb-6", className)}>
      {children}
    </div>
  )
}

// Componente CardBody
export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex-1 flex flex-col", className)}>
      {children}
    </div>
  )
}

// Componente CardTitle
export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn("text-xl font-semibold leading-tight mb-3", className)}>
      {children}
    </h3>
  )
}

// Componente CardDescription
export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("flex-1 text-sm leading-relaxed mb-4 text-muted-foreground", className)}>
      {children}
    </p>
  )
}

// Componente CardFooter
export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mt-auto pt-4", className)}>
      {children}
    </div>
  )
}

// Componente MetricCard específico
export function MetricCard({ number, label, description, trend, icon, className, ...props }: MetricCardProps) {
  return (
    <Card className={cn("min-h-[160px] p-6", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon && (
          <div className="text-muted-foreground h-4 w-4 flex items-center justify-center">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardBody className="space-y-1">
        <div className="text-2xl font-bold">{number}</div>
        <div className="flex items-center justify-between">
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
          {trend && (
            <div className={cn("text-xs font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
              {trend.isPositive ? "↗" : "↘"} {trend.value}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

// Componente TestimonialCard específico
export function TestimonialCard({ quote, author, className, ...props }: TestimonialCardProps) {
  return (
    <Card className={cn("min-h-[250px]", className)} {...props}>
      <CardBody>
        <div className="text-lg leading-relaxed italic mb-6 flex-1">
          "{quote}"
        </div>
        <div className="mt-auto">
          <div className="font-semibold mb-1">
            {author.name}
          </div>
          <div className="text-sm text-muted-foreground">
            {author.role}
            {author.company && ` at ${author.company}`}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// Componente CountryCard específico
export function CountryCard({ flag, name, regulator, className, ...props }: CountryCardProps) {
  return (
    <Card className={cn("min-h-[160px] text-center p-6", className)} {...props}>
      <CardBody>
        <div className="text-4xl mb-4">
          {flag}
        </div>
        <div className="font-semibold mb-2">
          {name}
        </div>
        <div className="text-sm text-muted-foreground">
          {regulator}
        </div>
      </CardBody>
    </Card>
  )
}

// Componente ProblemCard específico
export function ProblemCard({ title, description, icon, className, ...props }: ProblemCardProps) {
  return (
    <Card className={cn("min-h-[200px] text-center", className)} {...props}>
      {icon && (
        <div className="mx-auto mb-6">
          {icon}
        </div>
      )}
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardBody>
    </Card>
  )
}

// Componente FeatureCard específico
export function FeatureCard({ title, description, icon, badge, className, ...props }: FeatureCardProps) {
  return (
    <Card className={cn("min-h-[280px]", className)} badge={badge} {...props}>
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardBody>
    </Card>
  )
} 