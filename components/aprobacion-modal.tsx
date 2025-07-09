"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AprobacionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (reason?: string) => void
  onReject?: (reason?: string) => void
  personaName?: string
}

export function AprobacionModal({
  open,
  onOpenChange,
  onApprove,
  onReject,
  personaName = "esta persona",
}: AprobacionModalProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!action) return

    setLoading(true)

    try {
      if (action === "approve" && onApprove) {
        await onApprove(reason)
      } else if (action === "reject" && onReject) {
        await onReject(reason)
      }

      // Reset form
      setAction(null)
      setReason("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error processing action:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAction(null)
    setReason("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Decisión de verificación
          </DialogTitle>
          <DialogDescription>
            Selecciona una acción para <strong>{personaName}</strong> y proporciona una justificación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Acción a realizar</Label>
            <RadioGroup value={action || ""} onValueChange={(value) => setAction(value as "approve" | "reject")}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50 transition-colors">
                <RadioGroupItem value="approve" id="approve" />
                <Label htmlFor="approve" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Aprobar verificación</p>
                    <p className="text-sm text-muted-foreground">La identidad ha sido verificada correctamente</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-red-50 transition-colors">
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject" className="flex items-center gap-2 cursor-pointer flex-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium">Rechazar verificación</p>
                    <p className="text-sm text-muted-foreground">La identidad no pudo ser verificada</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Justificación {action && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="reason"
              placeholder={
                action === "approve"
                  ? "Describe por qué apruebas esta verificación..."
                  : action === "reject"
                    ? "Describe por qué rechazas esta verificación..."
                    : "Selecciona una acción primero..."
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={!action}
              rows={3}
            />
          </div>

          {action && (
            <Alert variant={action === "approve" ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {action === "approve"
                  ? "Esta acción aprobará la verificación de identidad y permitirá que el usuario continúe."
                  : "Esta acción rechazará la verificación de identidad y bloqueará el acceso del usuario."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!action || !reason.trim() || loading}
            variant={action === "approve" ? "default" : "destructive"}
          >
            {loading ? "Procesando..." : action === "approve" ? "Aprobar" : "Rechazar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
