import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InfoFieldProps {
  label: string
  value: string | number
  type?: "text" | "email" | "tel" | "date" | "textarea"
  readonly?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
  className?: string
}

export const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  type = "text",
  readonly = true,
  disabled = false,
  onChange,
  className = ""
}) => {
  const inputProps = {
    value: String(value),
    readOnly: readonly,
    disabled: disabled,
    onChange: onChange ? (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value) : undefined,
    className: readonly ? "bg-muted" : ""
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      {type === "textarea" ? (
        <Textarea
          {...inputProps}
          rows={3}
          className={`resize-none ${inputProps.className}`}
        />
      ) : (
        <Input
          {...inputProps}
          type={type}
        />
      )}
    </div>
  )
}

interface InfoGridProps {
  children: React.ReactNode
  className?: string
}

export const InfoGrid: React.FC<InfoGridProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  )
} 