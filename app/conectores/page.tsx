import { Suspense } from "react"
import { Plus, Settings, CheckCircle, AlertCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"

function ConectoresPageSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    {
      id: "ufe",
      name: "UFE",
      description: "Unidad de Fiscalización y Control",
      status: "disconnected",
      icon: "🔍",
      lastSync: "Nunca",
    },
    {
      id: "anses",
      name: "ANSES",
      description: "Administración Nacional de la Seguridad Social",
      status: "disconnected",
      icon: "🛡️",
      lastSync: "Nunca",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Conectado</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "disconnected":
        return <Badge variant="secondary">Desconectado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Conectores e integraciones"
        description="Gestiona las conexiones con servicios externos para potenciar tus flujos de onboarding"
      >
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar conector
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {conectores.map((conector) => (
          <Card key={conector.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{conector.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{conector.name}</CardTitle>
                    <CardDescription className="text-sm">{conector.description}</CardDescription>
                  </div>
                </div>
                {getStatusIcon(conector.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                {getStatusBadge(conector.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Última sincronización:</span>
                <span className="text-sm text-muted-foreground">{conector.lastSync}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
                {conector.status === "connected" ? (
                  <Button variant="outline" size="sm" className="flex-1">
                    Desconectar
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1">
                    Conectar
                  </Button>
                )}
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
