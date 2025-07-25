import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { InfoField } from "@/components/ui/info-field"
import { SidebarConfig } from "./DetailPageTemplate"
import { ActionConfig } from "@/components/shared/PageHeader/UnifiedPageHeader"
import { LucideIcon } from "lucide-react"

interface DetailSidebarProps {
  config: SidebarConfig
}

export const DetailSidebar: React.FC<DetailSidebarProps> = ({ config }) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      {config.quickActions && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>{config.quickActions.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {config.quickActions.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={action.disabled}
                className="w-full flex items-center gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary Information */}
      {config.summary && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>{config.summary.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {config.summary.data.map((item, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                {item.type === "progress" ? (
                  <div className="flex items-center gap-2">
                    <Progress value={Number(item.value)} className="h-2 flex-1" />
                    <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                      {item.value}%
                    </span>
                  </div>
                ) : item.type === "badge" ? (
                  <Badge variant={item.variant || "default"} className="font-medium">
                    {item.value}
                  </Badge>
                ) : (
                  <InfoField
                    label=""
                    value={item.value.toString()}
                    type={item.type || "text"}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Related Information */}
      {config.relatedInfo && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>{config.relatedInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <config.relatedInfo.component {...config.relatedInfo.props} />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 