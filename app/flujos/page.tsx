import { Suspense } from "react"
import { Plus, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FlowList } from "@/components/flow-list"
import { PageHeader } from "@/components/page-header"
import { clientFlowService } from "@/lib/flow-service"

function FlowsPageSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-6">
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
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Gestión de flujos"
        description="Crea, edita y administra los flujos de onboarding para diferentes tipos de usuarios y procesos de verificación"
      >
        <div className="flex gap-3">
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
      </PageHeader>

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
