"use client"

import { useState } from "react"
import { AlertCircle, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { JuridicoList } from "@/components/juridico-list"
import { ApprovalQueueModal } from "@/components/approval-queue-modal"

export default function JuridicoPage() {
  const [approvalQueueOpen, setApprovalQueueOpen] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión jurídica</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setApprovalQueueOpen(true)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Cola de aprobación
          </Button>
          <Button variant="default" size="sm" onClick={() => {/* console.log("Agregar empresa") */}}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar nueva empresa
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        Monitorea y gestiona los procesos de verificación de identidad de empresas (KYB) en tus flujos de onboarding.
      </p>

      <JuridicoList />

      <ApprovalQueueModal open={approvalQueueOpen} onOpenChange={setApprovalQueueOpen} type="company" />
    </div>
  )
}
