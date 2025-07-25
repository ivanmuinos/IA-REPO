import { Suspense } from "react"
import { Plus, Settings, CheckCircle, AlertCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function ConectoresPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-96" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  )
}

function ConectoresPageContent() {
  const conectores = [
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Envío de emails",
      status: "connected",
      icon: "📧",
      lastSync: "Hace 1 hora",
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS y verificación telefónica",
      status: "error",
      icon: "📱",
      lastSync: "Error hace 30 min",
    },
    {
      id: "aws-s3",
      name: "AWS S3",
      description: "Almacenamiento de documentos",
      status: "connected",
      icon: "☁️",
      lastSync: "Hace 5 minutos",
    },
    {
      id: "webhook",
      name: "Webhook Personalizado",
      description: "Integración personalizada",
      status: "disconnected",
      icon: "🔗",
      lastSync: "Nunca",
    },
    {
      id: "ekata-mastercard",
      name: "Ekata Mastercard",
      description: "Validación de identidad y riesgo digital",
      status: "disconnected",
      icon: "💳",
      lastSync: "Nunca",
    },
    {
      id: "renaper",
      name: "RENAPER",
      description: "Registro Nacional de las Personas",
      status: "disconnected",
      icon: "🔌",
      lastSync: "Nunca",
    },
    {
      id: "uif",
      name: "UIF",
      description: "Unidad de Información Financiera",
      status: "disconnected",
      icon: "🔌",
      lastSync: "Nunca",
    },
    {
      id: "bcra",
      name: "BCRA",
      description: "Banco Central de la República Argentina",
      status: "disconnected",
      icon: "🏦",
      lastSync: "Nunca",
    },
    {
      id: "afip",
      name: "AFIP",
      description: "Administración Federal de Ingresos Públicos",
      status: "disconnected",
      icon: "🏛️",
      lastSync: "Nunca",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="success">Conectado</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "disconnected":
        return <Badge variant="secondary">Desconectado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Conectores</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar conector
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        Gestiona las integraciones y conectores externos para ampliar las capacidades de tu plataforma
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {conectores.map((conector) => (
          <Card key={conector.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{conector.icon}</span>
                  <div>
                    <CardTitle className="text-base">{conector.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {conector.description}
                    </CardDescription>
                  </div>
                </div>
                {getStatusIcon(conector.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Última sincronización: {conector.lastSync}
                </span>
                {getStatusBadge(conector.status)}
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Configurar
                </Button>
                <Button variant="outline" size="sm">
                  Probar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ConectoresPage() {
  return (
    <Suspense fallback={<ConectoresPageSkeleton />}>
      <ConectoresPageContent />
    </Suspense>
  )
}
