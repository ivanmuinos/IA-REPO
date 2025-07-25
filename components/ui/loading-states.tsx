import React from "react"
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

// Estados de carga para botones
export function LoadingButton({
  children,
  loading,
  loadingText = "Cargando...",
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  loadingText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const buttonClasses = cn(
    "inline-flex items-center justify-center gap-2 transition-all rounded-md px-3 py-2 text-sm font-medium",
    "bg-primary text-primary-foreground hover:bg-primary/90",
    loading && "opacity-70 cursor-not-allowed",
    className
  )

  return (
    <button
      className={buttonClasses}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? loadingText : children}
    </button>
  )
}

// Indicador de estado del sistema
export function SystemStatusIndicator({
  status,
  message,
  className,
}: {
  status: "online" | "offline" | "warning" | "loading"
  message?: string
  className?: string
}) {
  const statusConfig = {
    online: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      text: "Sistema operativo",
    },
    offline: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      text: "Sistema desconectado",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      text: "Advertencia del sistema",
    },
    loading: {
      icon: Loader2,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      text: "Conectando...",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-md", config.bgColor, className)}>
      <Icon className={cn("h-4 w-4", config.color)} />
      <span className="text-sm font-medium">{message || config.text}</span>
    </div>
  )
}

// Barra de progreso simple para métricas
export function SimpleProgressBar({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <Progress value={value} className={cn("h-2", className)} />
  )
}

// Barra de progreso para verificaciones
export function ProgressBar({
  progress,
  status = "processing",
  label,
  className,
}: {
  progress: number
  status?: "processing" | "completed" | "error" | "paused"
  label?: string
  className?: string
}) {
  const statusConfig = {
    processing: {
      icon: Loader2,
      text: "Procesando...",
    },
    completed: {
      icon: CheckCircle,
      text: "Completado",
    },
    error: {
      icon: AlertCircle,
      text: "Error",
    },
    paused: {
      icon: Clock,
      text: "Pausado",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{label}</span>
          <div className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            <span className="text-muted-foreground">{config.text}</span>
          </div>
        </div>
      )}
      <Progress value={progress} className="w-full" />
      <div className="text-xs text-muted-foreground text-right">
        {progress}% completado
      </div>
    </div>
  )
}

// Indicador de conexión en tiempo real
export function ConnectionIndicator({
  connected,
  lastSync,
  className,
}: {
  connected: boolean
  lastSync?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-2 w-2 rounded-full", connected ? "bg-green-500" : "bg-red-500")} />
      <span className="text-xs text-muted-foreground">
        {connected ? "Conectado" : "Desconectado"}
        {lastSync && ` • Última sincronización: ${lastSync}`}
      </span>
    </div>
  )
}

// Feedback visual para acciones
export function ActionFeedback({
  type,
  message,
  onClose,
  className,
}: {
  type: "success" | "error" | "warning" | "info"
  message: string
  onClose?: () => void
  className?: string
}) {
  const config = {
    success: {
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 border-red-200",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200",
    },
    info: {
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 border-blue-200",
    },
  }

  const configType = config[type]
  const Icon = configType.icon

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-md border",
        configType.bgColor,
        className
      )}
    >
      <Icon className={cn("h-4 w-4", configType.color)} />
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      )}
    </div>
  )
} 