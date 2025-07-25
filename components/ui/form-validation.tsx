import React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"

// Campo requerido con asterisco
export function RequiredField({
  children,
  required = true,
  className,
}: {
  children: React.ReactNode
  required?: boolean
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {required && (
        <span className="absolute -top-1 -right-1 text-red-500 text-sm">*</span>
      )}
    </div>
  )
}

// Indicador de validación en tiempo real
export function ValidationIndicator({
  isValid,
  message,
  className,
}: {
  isValid: boolean | null // null = no validado, true = válido, false = inválido
  message?: string
  className?: string
}) {
  if (isValid === null) return null

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        isValid ? "text-green-600" : "text-red-600",
        className
      )}
    >
      {isValid ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <span>{message}</span>
    </div>
  )
}

// Input con validación en tiempo real
export function ValidatedInput({
  value,
  onChange,
  onValidation,
  rules,
  placeholder,
  className,
  required = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  onValidation?: (isValid: boolean, message?: string) => void
  rules?: Array<{
    test: (value: string) => boolean
    message: string
  }>
  required?: boolean
}) {
  const [isValid, setIsValid] = React.useState<boolean | null>(null)
  const [message, setMessage] = React.useState<string>("")

  const validate = React.useCallback(
    (value: string) => {
      if (!rules || rules.length === 0) {
        setIsValid(true)
        setMessage("")
        onValidation?.(true)
        return
      }

      for (const rule of rules) {
        if (!rule.test(value)) {
          setIsValid(false)
          setMessage(rule.message)
          onValidation?.(false, rule.message)
          return
        }
      }

      setIsValid(true)
      setMessage("")
      onValidation?.(true)
    },
    [rules, onValidation]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange?.(e)
    
    if (value.length > 0) {
      validate(value)
    } else if (required) {
      setIsValid(false)
      setMessage("Este campo es requerido")
      onValidation?.(false, "Este campo es requerido")
    } else {
      setIsValid(null)
      setMessage("")
      onValidation?.(true)
    }
  }

  return (
    <div className="space-y-1">
      <RequiredField required={required}>
        <input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2 border rounded-md transition-colors",
            isValid === false && "border-red-300 focus:border-red-500",
            isValid === true && "border-green-300 focus:border-green-500",
            className
          )}
          {...props}
        />
      </RequiredField>
      <ValidationIndicator isValid={isValid} message={message} />
    </div>
  )
}

// Reglas de validación predefinidas
export const validationRules = {
  email: [
    {
      test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Ingresa un email válido",
    },
  ],
  password: [
    {
      test: (value: string) => value.length >= 8,
      message: "La contraseña debe tener al menos 8 caracteres",
    },
    {
      test: (value: string) => /[A-Z]/.test(value),
      message: "La contraseña debe contener al menos una mayúscula",
    },
    {
      test: (value: string) => /[0-9]/.test(value),
      message: "La contraseña debe contener al menos un número",
    },
  ],
  phone: [
    {
      test: (value: string) => /^\+?[\d\s\-\(\)]+$/.test(value),
      message: "Ingresa un número de teléfono válido",
    },
  ],
  dni: [
    {
      test: (value: string) => /^\d{7,8}$/.test(value.replace(/\D/g, "")),
      message: "El DNI debe tener 7 u 8 dígitos",
    },
  ],
} 