import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: "up" | "down" | "stable"
  color?: string
  variant?: "default" | "success" | "warning" | "destructive"
}

export function StatCard({ title, value, description, icon: Icon, trend, color, variant = "default" }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      case "stable":
        return "text-amber-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-200 bg-green-50/50"
      case "warning":
        return "border-amber-200 bg-amber-50/50"
      case "destructive":
        return "border-red-200 bg-red-50/50"
      default:
        return ""
    }
  }

  return (
    <Card className={`transition-all hover:shadow-md ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          {trend && (
            <Badge variant="outline" className={`text-xs ${getTrendColor()}`}>
              {trend === "up" && "↗"}
              {trend === "down" && "↘"}
              {trend === "stable" && "→"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
