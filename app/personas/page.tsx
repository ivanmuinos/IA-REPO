"use client"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Filter, Download, AlertCircle } from "lucide-react"
import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonasList } from "@/components/personas-list"
import { ApprovalQueueModal } from "@/components/approval-queue-modal"

// Datos de ejemplo
const personas = [
  {
    id: 1,
    nombre: "Juan Pérez González",
    documento: "12345678A",
    flujo: "KYC Básico",
    fecha: "15/05/2023 14:32",
    estado: "completado",
  },
  {
    id: 2,
    nombre: "María López Martínez",
    documento: "87654321B",
    flujo: "KYC Premium",
    fecha: "15/05/2023 16:45",
    estado: "en-progreso",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez García",
    documento: "11223344C",
    flujo: "KYC Básico",
    fecha: "14/05/2023 10:15",
    estado: "revision",
  },
  {
    id: 4,
    nombre: "Ana Martínez Fernández",
    documento: "55667788D",
    flujo: "KYB Empresas",
    fecha: "14/05/2023 09:30",
    estado: "completado",
  },
  {
    id: 5,
    nombre: "Pedro Sánchez López",
    documento: "99887766E",
    flujo: "KYC Premium",
    fecha: "13/05/2023 17:20",
    estado: "abandonado",
  },
]

function PersonasPageSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  )
}

function PersonasPageContent() {
  const [approvalQueueOpen, setApprovalQueueOpen] = useState(false)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Gestión de personas"
        description="Monitorea y gestiona los procesos de verificación de identidad de todos los usuarios en tus flujos de onboarding"
      >
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros avanzados
          </Button>
          <Button variant="outline" size="sm" onClick={() => setApprovalQueueOpen(true)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Cola de aprobación
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar datos
          </Button>
        </div>
      </PageHeader>

      <PersonasList personas={personas} />
      <ApprovalQueueModal open={approvalQueueOpen} onOpenChange={setApprovalQueueOpen} type="personas" />
    </div>
  )
}

export default function PersonasPage() {
  return (
    <Suspense fallback={<PersonasPageSkeleton />}>
      <PersonasPageContent />
    </Suspense>
  )
}
