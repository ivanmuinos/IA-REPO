import { Suspense } from "react"
import { Shield, Bell, Users, Webhook, Sliders } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"
import { ParametrosGenerales } from "@/components/configuracion/parametros-generales"
import { UsuariosRoles } from "@/components/configuracion/usuarios-roles"
import { Seguridad } from "@/components/configuracion/seguridad"
import { Notificaciones } from "@/components/configuracion/notificaciones"
import { ApiWebhooks } from "@/components/configuracion/api-webhooks"

function ConfiguracionPageSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

function ConfiguracionPageContent() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Configuración del sistema"
        description="Gestiona los ajustes generales, usuarios, seguridad y integraciones de tu plataforma de onboarding"
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <ParametrosGenerales />
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <UsuariosRoles />
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <Seguridad />
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-6">
          <Notificaciones />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiWebhooks />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ConfiguracionPage() {
  return (
    <Suspense fallback={<ConfiguracionPageSkeleton />}>
      <ConfiguracionPageContent />
    </Suspense>
  )
}
