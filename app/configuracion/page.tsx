import { Suspense } from "react"
import { Shield, Bell, Users, Webhook, Sliders } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ParametrosGenerales } from "@/components/configuracion/parametros-generales"
import { UsuariosRoles } from "@/components/configuracion/usuarios-roles"
import { Seguridad } from "@/components/configuracion/seguridad"
import { Notificaciones } from "@/components/configuracion/notificaciones"
import { ApiWebhooks } from "@/components/configuracion/api-webhooks"

function ConfiguracionPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-64" />
      </div>
      <Skeleton className="h-4 w-96" />
      
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

function ConfiguracionPageContent() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuración del sistema</h2>
      </div>
      <p className="text-muted-foreground">
        Gestiona los ajustes generales, usuarios, seguridad y integraciones de tu plataforma de onboarding
      </p>

      <Tabs defaultValue="general" className="space-y-4">
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

        <TabsContent value="general" className="space-y-4">
          <ParametrosGenerales />
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <UsuariosRoles />
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-4">
          <Seguridad />
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4">
          <Notificaciones />
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
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
