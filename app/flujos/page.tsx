import { Suspense } from "react"
import { Plus, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FlowList } from "@/components/flow-list"
import { clientFlowService } from "@/lib/flow-service"

function FlowsPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-96" />
      
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  )
}

async function FlowsPageContent() {
  const flows = await clientFlowService.getFlows()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de flujos</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/flujos/plantillas">
              <FileText className="h-4 w-4 mr-2" />
              Ver plantillas
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="/flujos/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Crear flujo
            </a>
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        Crea, edita y administra los flujos de onboarding para diferentes tipos de usuarios y procesos de verificación
      </p>

      <FlowList initialFlows={flows} />
    </div>
  )
}

export default function FlowsPage() {
  return (
    <Suspense fallback={<FlowsPageSkeleton />}>
      <FlowsPageContent />
    </Suspense>
  )
}
