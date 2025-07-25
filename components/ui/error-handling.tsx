import React from "react"
import { AlertCircle, X, RefreshCw, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Mensaje de error específico y claro
export function ErrorMessage({
  title,
  message,
  suggestion,
  onRetry,
  onDismiss,
  className,
}: {
  title: string
  message: string
  suggestion?: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50 p-4", className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-medium text-red-800">{title}</h4>
          <p className="text-sm text-red-700">{message}</p>
          {suggestion && (
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-red-600">{suggestion}</p>
            </div>
          )}
          <div className="flex items-center gap-2 pt-2">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-8 px-3 text-sm border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-8 px-3 text-sm text-red-600 hover:bg-red-100"
              >
                <X className="h-3 w-3 mr-1" />
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Error de validación en formularios
export function ValidationError({
  field,
  message,
  suggestion,
  className,
}: {
  field: string
  message: string
  suggestion?: string
  className?: string
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">{field}:</span>
        <span>{message}</span>
      </div>
      {suggestion && (
        <p className="text-xs text-red-500 ml-6">{suggestion}</p>
      )}
    </div>
  )
}

// Error de conexión
export function ConnectionError({
  onRetry,
  className,
}: {
  onRetry?: () => void
  className?: string
}) {
  return (
    <ErrorMessage
      title="Error de conexión"
      message="No se pudo conectar con el servidor. Verifica tu conexión a internet."
      suggestion="Si el problema persiste, contacta al soporte técnico."
      onRetry={onRetry}
      className={className}
    />
  )
}

// Error de permisos
export function PermissionError({
  requiredPermission,
  className,
}: {
  requiredPermission: string
  className?: string
}) {
  return (
    <ErrorMessage
      title="Permisos insuficientes"
      message={`No tienes permisos para realizar esta acción.`}
      suggestion={`Contacta a tu administrador para solicitar el permiso: ${requiredPermission}`}
      className={className}
    />
  )
}

// Error de datos no encontrados
export function NotFoundError({
  item,
  onRetry,
  className,
}: {
  item: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <ErrorMessage
      title={`${item} no encontrado`}
      message={`El ${item.toLowerCase()} que buscas no existe o ha sido eliminado.`}
      suggestion="Verifica que el identificador sea correcto o intenta buscar de nuevo."
      onRetry={onRetry}
      className={className}
    />
  )
}

// Error de servidor
export function ServerError({
  errorCode,
  onRetry,
  className,
}: {
  errorCode?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <ErrorMessage
      title="Error del servidor"
      message={`Ocurrió un error interno en el servidor${errorCode ? ` (${errorCode})` : ""}.`}
      suggestion="El equipo técnico ha sido notificado. Intenta nuevamente en unos minutos."
      onRetry={onRetry}
      className={className}
    />
  )
}

// Error de timeout
export function TimeoutError({
  action,
  onRetry,
  className,
}: {
  action: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <ErrorMessage
      title="Tiempo de espera agotado"
      message={`La ${action} tardó demasiado en completarse.`}
      suggestion="Verifica tu conexión a internet e intenta nuevamente."
      onRetry={onRetry}
      className={className}
    />
  )
}

// Hook para manejar errores
export function useErrorHandler() {
  const [error, setError] = React.useState<{
    type: "connection" | "permission" | "notFound" | "server" | "timeout" | "validation"
    title: string
    message: string
    suggestion?: string
    field?: string
    errorCode?: string
  } | null>(null)

  const handleError = React.useCallback((error: any) => {
    if (error.code === "NETWORK_ERROR") {
      setError({
        type: "connection",
        title: "Error de conexión",
        message: "No se pudo conectar con el servidor.",
        suggestion: "Verifica tu conexión a internet.",
      })
    } else if (error.code === "PERMISSION_DENIED") {
      setError({
        type: "permission",
        title: "Permisos insuficientes",
        message: "No tienes permisos para realizar esta acción.",
        suggestion: "Contacta a tu administrador.",
      })
    } else if (error.code === "NOT_FOUND") {
      setError({
        type: "notFound",
        title: "Recurso no encontrado",
        message: "El recurso que buscas no existe.",
        suggestion: "Verifica que el identificador sea correcto.",
      })
    } else if (error.code >= 500) {
      setError({
        type: "server",
        title: "Error del servidor",
        message: "Ocurrió un error interno en el servidor.",
        suggestion: "Intenta nuevamente en unos minutos.",
        errorCode: error.code?.toString(),
      })
    } else if (error.code === "TIMEOUT") {
      setError({
        type: "timeout",
        title: "Tiempo de espera agotado",
        message: "La operación tardó demasiado en completarse.",
        suggestion: "Verifica tu conexión e intenta nuevamente.",
      })
    } else {
      setError({
        type: "validation",
        title: "Error de validación",
        message: error.message || "Ocurrió un error inesperado.",
        field: error.field,
      })
    }
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    handleError,
    clearError,
  }
} 