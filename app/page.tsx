"use client"

import { Suspense, useState } from "react"
import { BarChart3, Users, FileText, TrendingUp, Clock, CheckCircle, AlertTriangle, Activity, Download, HelpCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { SystemStatusIndicator, ProgressBar, ActionFeedback, LoadingButton } from "@/components/ui/loading-states"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-96" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}

function DashboardContent() {
  const [exportLoading, setExportLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  
  const handleExport = () => {
    setExportLoading(true)
    // Simular proceso de exportación
    setTimeout(() => {
      setExportLoading(false)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }, 2000)
  }

  const stats = [
    {
      number: "2,847",
      label: "Personas verificadas",
      description: "+12% vs mes anterior",
      trend: { value: "+12%", isPositive: true },
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "8",
      label: "Flujos activos",
      description: "4 en producción",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      number: "94.2%",
      label: "Tasa de éxito",
      description: "+2.1% vs mes anterior",
      trend: { value: "+2.1%", isPositive: true },
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      number: "3.2 min",
      label: "Tiempo promedio",
      description: "-0.8 min vs mes anterior",
      trend: { value: "-0.8 min", isPositive: false },
      icon: <Clock className="h-6 w-6" />,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "verification_completed",
      user: "María González",
      flow: "KYC Básico",
      time: "Hace 5 minutos",
      status: "success",
    },
    {
      id: 2,
      type: "manual_review",
      user: "Carlos Rodríguez",
      flow: "KYC Empresas",
      time: "Hace 12 minutos",
      status: "pending",
    },
    {
      id: 3,
      type: "verification_failed",
      user: "Ana Martínez",
      flow: "KYC Básico",
      time: "Hace 18 minutos",
      status: "error",
    },
    {
      id: 4,
      type: "verification_completed",
      user: "Pedro Sánchez",
      flow: "KYC Express",
      time: "Hace 25 minutos",
      status: "success",
    },
  ]

  const getActivityText = (type: string) => {
    switch (type) {
      case "verification_completed":
        return "completó la verificación"
      case "manual_review":
        return "requiere revisión manual"
      case "verification_failed":
        return "falló la verificación"
      default:
        return "realizó una acción"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="success">Completado</Badge>
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <LoadingButton
              variant="outline"
              size="sm"
              loading={exportLoading}
              loadingText="Exportando..."
              onClick={handleExport}
              className="h-9 px-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </LoadingButton>
          </div>
        </div>
        <p className="text-muted-foreground">
          Resumen general del rendimiento de tus flujos de onboarding
        </p>

      {/* Feedback visual para acciones */}
      {showFeedback && (
        <ActionFeedback
          type="success"
          message="Datos exportados correctamente"
          onClose={() => setShowFeedback(false)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {stat.label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {index === 0 && "Total de personas que han completado exitosamente su proceso de verificación de identidad"}
                      {index === 1 && "Número de flujos de onboarding configurados y activos en el sistema"}
                      {index === 2 && "Porcentaje de verificaciones que se completan exitosamente sin requerir intervención manual"}
                      {index === 3 && "Tiempo promedio que toma completar un proceso de verificación desde inicio hasta fin"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.number}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.trend && (
                <div className={cn("mt-2 text-sm font-medium", stat.trend.isPositive ? "text-green-600" : "text-red-600")}>
                  {stat.trend.isPositive ? "↗" : "↘"} {stat.trend.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>
              Últimas verificaciones y acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getActivityText(activity.type)} en {activity.flow}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento del sistema</CardTitle>
            <CardDescription>
              Métricas de rendimiento y disponibilidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-muted-foreground">99.9%</span>
              </div>
              <Progress value={99.9} className="w-full" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tiempo de respuesta</span>
                <span className="text-sm text-muted-foreground">245ms</span>
              </div>
              <Progress value={85} className="w-full" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verificaciones/hora</span>
                <span className="text-sm text-muted-foreground">1,247</span>
              </div>
              <Progress value={92} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del sistema</CardTitle>
            <CardDescription>
              Estado actual del sistema y alertas pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SystemStatusIndicator status="online" message="Sistema operativo" />
              <SystemStatusIndicator status="warning" message="3 verificaciones pendientes de revisión" />
              <SystemStatusIndicator status="loading" message="Actualización automática en 2h" />
              
              {/* Progreso de verificaciones en tiempo real */}
              <div className="pt-2">
                <ProgressBar 
                  progress={75} 
                  status="processing" 
                  label="Verificaciones en proceso" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
