import { Suspense } from "react"
import { BarChart3, Users, FileText, TrendingUp, Clock, CheckCircle, AlertTriangle, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/stat-card"
import { PageHeader } from "@/components/page-header"

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}

function DashboardContent() {
  const stats = [
    {
      title: "Personas verificadas",
      value: "2,847",
      description: "↗️ +12% vs mes anterior",
      icon: Users,
      trend: "up",
      color: "text-green-600",
    },
    {
      title: "Flujos activos",
      value: "8",
      description: "4 en producción",
      icon: FileText,
      trend: "stable",
      color: "text-blue-600",
    },
    {
      title: "Tasa de éxito",
      value: "94.2%",
      description: "↗️ +2.1% vs mes anterior",
      icon: TrendingUp,
      trend: "up",
      color: "text-green-600",
    },
    {
      title: "Tiempo promedio",
      value: "3.2 min",
      description: "↘️ -0.8 min vs mes anterior",
      icon: Clock,
      trend: "down",
      color: "text-orange-600",
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "verification_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "manual_review":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "verification_failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActivityText = (type: string) => {
    switch (type) {
      case "verification_completed":
        return "completó la verificación"
      case "manual_review":
        return "requiere revisión manual"
      case "verification_failed":
        return "falló en la verificación"
      default:
        return "realizó una acción"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="success" className="text-xs">
            Exitoso
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="text-xs">
            Pendiente
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive" className="text-xs">
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Panel principal"
        description="Monitorea el rendimiento de tus flujos de verificación y gestiona las operaciones diarias"
      >
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver reporte completo
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Crear nuevo flujo
          </Button>
        </div>
      </PageHeader>

      {/* Métricas principales */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Actividad reciente */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Actividad reciente</CardTitle>
                <CardDescription>Últimas acciones realizadas en tus flujos</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver todo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{activity.user}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getActivityText(activity.type)} en <span className="font-medium">{activity.flow}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rendimiento de flujos */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Rendimiento de flujos</CardTitle>
                <CardDescription>Tasa de éxito por flujo en los últimos 30 días</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver métricas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">KYC Básico</span>
                  <span className="text-muted-foreground">96.2%</span>
                </div>
                <Progress value={96.2} className="h-2" />
                <p className="text-xs text-muted-foreground">1,847 verificaciones completadas</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">KYC Express</span>
                  <span className="text-muted-foreground">98.1%</span>
                </div>
                <Progress value={98.1} className="h-2" />
                <p className="text-xs text-muted-foreground">623 verificaciones completadas</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">KYC Empresas</span>
                  <span className="text-muted-foreground">89.4%</span>
                </div>
                <Progress value={89.4} className="h-2" />
                <p className="text-xs text-muted-foreground">234 verificaciones completadas</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">KYC Premium</span>
                  <span className="text-muted-foreground">92.7%</span>
                </div>
                <Progress value={92.7} className="h-2" />
                <p className="text-xs text-muted-foreground">143 verificaciones completadas</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Promedio general</span>
                <span className="font-bold text-green-600">94.2%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Excelente rendimiento en todos los flujos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y notificaciones */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Alertas importantes</CardTitle>
          <CardDescription>Elementos que requieren tu atención inmediata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-amber-900 dark:text-amber-100">5 revisiones pendientes</p>
                <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">
                  Hay personas esperando aprobación manual en el flujo KYC Empresas
                </p>
                <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-amber-700 dark:text-amber-200">
                  Revisar ahora →
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-blue-900 dark:text-blue-100">Pico de actividad detectado</p>
                <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
                  +150% más verificaciones que el promedio en las últimas 2 horas
                </p>
                <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-blue-700 dark:text-blue-200">
                  Ver métricas →
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-green-900 dark:text-green-100">
                  Sistema funcionando óptimamente
                </p>
                <p className="text-xs text-green-700 dark:text-green-200 mt-1">
                  Todos los servicios operan sin interrupciones
                </p>
                <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-green-700 dark:text-green-200">
                  Ver estado →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
