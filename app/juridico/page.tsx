"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { JuridicoList } from "@/components/juridico-list"
import { ApprovalQueueModal } from "@/components/approval-queue-modal"

export default function JuridicoPage() {
  const [approvalQueueOpen, setApprovalQueueOpen] = useState(false)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Gestión jurídica"
        description="Monitorea y gestiona los procesos de verificación de identidad de empresas (KYB) en tus flujos de onboarding."
      >
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setApprovalQueueOpen(true)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Cola de aprobación
          </Button>
          <Button variant="default" size="sm" onClick={() => console.log("Agregar empresa")}>
            + Agregar nueva empresa
          </Button>
        </div>
      </PageHeader>

      <JuridicoList />

      <ApprovalQueueModal open={approvalQueueOpen} onOpenChange={setApprovalQueueOpen} type="juridico" />
    </div>
  )
}
