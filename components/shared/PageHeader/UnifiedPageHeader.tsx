import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideIcon } from "lucide-react"

export interface StatusConfig {
  value: string | number
  label?: string
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
  icon?: LucideIcon
}

export interface ActionConfig {
  label: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
}

export interface TabConfig {
  id: string
  label: string
  disabled?: boolean
}

interface UnifiedPageHeaderProps {
  title: string
  subtitle?: string
  status?: StatusConfig
  primaryActions: ActionConfig[]
  tabs?: TabConfig[]
  onTabChange?: (value: string) => void
  activeTab?: string
}

export const UnifiedPageHeader: React.FC<UnifiedPageHeaderProps> = ({
  title,
  subtitle,
  status,
  primaryActions,
  tabs,
  onTabChange,
  activeTab
}) => {
  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Status badge */}
          {status && (
            <div className="flex items-center gap-2">
              {status.icon && <status.icon className="h-4 w-4" />}
              <Badge variant={status.variant || "default"}>
                {status.label ? `${status.label}: ${status.value}` : status.value}
              </Badge>
            </div>
          )}
          
          {/* Primary actions */}
          <div className="flex items-center gap-2">
            {primaryActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={action.disabled}
                className="flex items-center gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab navigation - Removed to avoid duplication */}
    </div>
  )
} 