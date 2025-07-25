import React from "react"
import { UnifiedPageHeader, StatusConfig, ActionConfig, TabConfig } from "@/components/shared/PageHeader/UnifiedPageHeader"
import { DetailSidebar } from "./DetailSidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface SectionConfig {
  id: string
  title: string
  component: React.ComponentType<any>
  props?: Record<string, any>
}

export interface SidebarConfig {
  quickActions?: {
    title: string
    actions: ActionConfig[]
  }
  summary?: {
    title: string
    data: Array<{
      label: string
      value: string | number
      type?: "text" | "email" | "tel" | "progress" | "badge"
      variant?: "default" | "secondary" | "destructive" | "outline" | "success"
    }>
  }
  relatedInfo?: {
    title: string
    component: React.ComponentType<any>
    props?: Record<string, any>
  }
}

interface DetailPageTemplateProps {
  title: string
  subtitle?: string
  status?: StatusConfig
  primaryActions: ActionConfig[]
  tabs?: TabConfig[]
  sections: SectionConfig[]
  sidebarConfig: SidebarConfig
  activeTab?: string
  onTabChange?: (value: string) => void
}

export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  title,
  subtitle,
  status,
  primaryActions,
  tabs,
  sections,
  sidebarConfig,
  activeTab,
  onTabChange
}) => {
  const hasTabs = tabs && tabs.length > 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      {/* Unified Page Header */}
      <UnifiedPageHeader
        title={title}
        subtitle={subtitle}
        status={status}
        primaryActions={primaryActions}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          {hasTabs ? (
            <div className="space-y-8">
              <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 mb-8">
                  {tabs?.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      disabled={tab.disabled}
                      className="flex items-center gap-2"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabs?.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="space-y-8 mt-0">
                    {sections
                      .filter(section => section.id.startsWith(tab.id))
                      .map((section) => (
                        <section.component key={section.id} {...section.props} />
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ) : (
            /* Sequential sections without tabs */
            <div className="space-y-8">
              {sections.map((section) => (
                <section.component key={section.id} {...section.props} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <DetailSidebar config={sidebarConfig} />
        </div>
      </div>
    </div>
  )
} 