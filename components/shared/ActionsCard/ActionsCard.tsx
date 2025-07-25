import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

export interface ActionItem {
  label: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
}

interface ActionsCardProps {
  title?: string
  actions: ActionItem[]
}

export const ActionsCard: React.FC<ActionsCardProps> = ({
  title = "Acciones disponibles",
  actions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            onClick={action.onClick}
            disabled={action.disabled}
            className="w-full justify-start"
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
} 