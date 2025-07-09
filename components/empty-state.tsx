"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center text-center py-12 px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">{description}</p>
        {(action || secondaryAction) && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {action && (
              <Button onClick={action.onClick} size="sm">
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick} size="sm">
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
