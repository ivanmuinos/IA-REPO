import React from "react"
import { ArrowLeft, X, RotateCcw, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Botón Cancelar para modales y formularios
export function CancelButton({
  children = "Cancelar",
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn("", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

// Botón Volver con breadcrumb
export function BackButton({
  children = "Volver",
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Button>
  )
}

// Botón Cerrar para modales
export function CloseButton({
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <X className="h-4 w-4" />
    </Button>
  )
}

// Funcionalidad Deshacer para acciones críticas
export function UndoAction({
  action,
  onUndo,
  timeLimit = 5000, // 5 segundos por defecto
  className,
}: {
  action: string
  onUndo: () => void
  timeLimit?: number
  className?: string
}) {
  const [showUndo, setShowUndo] = React.useState(true)
  const [timeLeft, setTimeLeft] = React.useState(timeLimit)

  React.useEffect(() => {
    if (!showUndo) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          setShowUndo(false)
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(timer)
  }, [showUndo])

  const handleUndo = () => {
    onUndo()
    setShowUndo(false)
  }

  if (!showUndo) return null

  const progress = (timeLeft / timeLimit) * 100

  return (
    <div className={cn("fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50", className)}>
      <div className="bg-background border rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">{action}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            className="h-7 px-2 text-xs"
          >
            <Undo2 className="h-3 w-3 mr-1" />
            Deshacer
          </Button>
        </div>
        <div className="w-full bg-muted rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Hook para manejar Escape key
export function useEscapeKey(onEscape: () => void) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onEscape])
}

// Componente para confirmar antes de salir
export function useBeforeUnload(message: string) {
  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = message
      return message
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [message])
}

// Botón de reinicio para formularios
export function ResetButton({
  children = "Reiniciar",
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <RotateCcw className="h-4 w-4" />
      {children}
    </Button>
  )
}

// Navegación con breadcrumbs mejorada
export function BreadcrumbNav({
  items,
  onNavigate,
  className,
}: {
  items: Array<{ id: string; label: string; href?: string }>
  onNavigate: (item: any) => void
  className?: string
}) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <span>/</span>}
          <button
            onClick={() => onNavigate(item)}
            className={cn(
              "hover:text-foreground transition-colors",
              index === items.length - 1 && "text-foreground font-medium"
            )}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  )
}

// Componente para mostrar progreso de navegación
export function NavigationProgress({
  currentStep,
  totalSteps,
  onStepClick,
  steps,
  className,
}: {
  currentStep: number
  totalSteps: number
  onStepClick: (step: number) => void
  steps: Array<{ id: number; label: string; completed?: boolean }>
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Paso {currentStep} de {totalSteps}</span>
        <span className="text-sm text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}% completado
        </span>
      </div>
      <div className="flex space-x-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm transition-colors",
              step.id === currentStep
                ? "bg-primary text-primary-foreground"
                : step.completed
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  )
} 