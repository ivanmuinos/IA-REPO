"use client"

import { Button } from "@/components/ui/button"
import { Filter, Download, AlertCircle } from "lucide-react"
import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonasList } from "@/components/personas-list"
import { ApprovalQueueModal } from "@/components/approval-queue-modal"
import { useToast } from "@/hooks/use-toast"

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-96" />
      
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  )
}

function PersonasPageContent() {
  const [approvalQueueOpen, setApprovalQueueOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de personas</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Filtros avanzados", description: "Funcionalidad en desarrollo" })}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros avanzados
          </Button>
          <Button variant="outline" size="sm" onClick={() => setApprovalQueueOpen(true)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Cola de aprobación
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Exportar datos", description: "Funcionalidad en desarrollo" })}>
            <Download className="h-4 w-4 mr-2" />
            Exportar datos
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        Monitorea y gestiona los procesos de verificación de identidad de todos los usuarios en tus flujos de onboarding
      </p>

      <PersonasList />
      <ApprovalQueueModal open={approvalQueueOpen} onOpenChange={setApprovalQueueOpen} type="person" />
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
