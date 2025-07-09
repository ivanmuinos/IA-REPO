"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { clientFlowService } from "@/lib/flow-service"
import { useRouter } from "next/navigation"

interface FlowDeleteDialogProps {
  flowId: string
  flowName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FlowDeleteDialog({ flowId, flowName, open, onOpenChange }: FlowDeleteDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await clientFlowService.deleteFlow(flowId)
      toast({
        title: "Flujo eliminado",
        description: `El flujo "${flowName}" ha sido eliminado correctamente.`,
      })
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error al eliminar el flujo:", error)
      toast({
        title: "Error al eliminar",
        description: "Ha ocurrido un error al eliminar el flujo. Inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de que quieres eliminar este flujo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el flujo <strong>{flowName}</strong> y todos
            sus pasos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
