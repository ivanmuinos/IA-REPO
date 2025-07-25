import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface InfoFieldProps {
  label: string
  value: string
  type?: "text" | "email" | "tel" | "date" | "url" | "number"
  className?: string
  readOnly?: boolean
  placeholder?: string
}

export function InfoField({ 
  label, 
  value, 
  type = "text", 
  className,
  readOnly = true,
  placeholder 
}: InfoFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        className={cn(
          "h-9 text-sm",
          readOnly && "bg-muted/50 cursor-default"
        )}
      />
    </div>
  )
}

// Variante para campos con badge (como tipo de documento)
interface InfoFieldWithBadgeProps extends Omit<InfoFieldProps, 'value'> {
  value: string
  badgeText?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

export function InfoFieldWithBadge({ 
  label, 
  value, 
  badgeText,
  badgeVariant = "outline",
  className,
  readOnly = true,
  placeholder 
}: InfoFieldWithBadgeProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            "h-9 text-sm flex-1",
            readOnly && "bg-muted/50 cursor-default"
          )}
        />
        {badgeText && (
          <div className="px-2 py-1 text-xs font-medium rounded-md border bg-background">
            {badgeText}
          </div>
        )}
      </div>
    </div>
  )
} 