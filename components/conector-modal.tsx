"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConectorModal({ open, onOpenChange }: ConectorModalProps) {
  const [tipo, setTipo] = useState<string>("webhook")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nuevo conector</DialogTitle>
          <DialogDescription>Conecta tu flujo de onboarding con servicios externos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del conector</Label>
            <Input id="nombre" placeholder="Ej: Webhook de aprobación" />
          </div>

          <div className="space-y-2">
            <Label>Tipo de conector</Label>
            <RadioGroup value={tipo} onValueChange={setTipo}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="webhook" id="webhook" />
                <Label htmlFor="webhook">Webhook HTTP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slack" id="slack" />
                <Label htmlFor="slack">Slack</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zapier" id="zapier" />
                <Label htmlFor="zapier">Zapier</Label>
              </div>
            </RadioGroup>
          </div>

          {tipo === "webhook" && (
            <div className="space-y-2">
              <Label htmlFor="url">URL del webhook</Label>
              <Input id="url" placeholder="https://" />
              <p className="text-xs text-muted-foreground">La URL donde se enviarán las notificaciones HTTP POST</p>
            </div>
          )}

          {tipo === "slack" && (
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL del webhook de Slack</Label>
              <Input id="webhook-url" placeholder="https://hooks.slack.com/services/..." />
              <div className="space-y-2 mt-4">
                <Label htmlFor="canal">Canal</Label>
                <Input id="canal" placeholder="#verificaciones" />
              </div>
            </div>
          )}

          {tipo === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asunto">Asunto del email</Label>
                <Input id="asunto" placeholder="Resultado de verificación" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plantilla">Plantilla de email</Label>
                <Textarea id="plantilla" placeholder="Contenido del email..." className="min-h-[100px]" />
              </div>
            </div>
          )}

          {tipo === "zapier" && (
            <div className="space-y-2">
              <Label htmlFor="zap-webhook">URL del webhook de Zapier</Label>
              <Input id="zap-webhook" placeholder="https://hooks.zapier.com/..." />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            <Check className="mr-2 h-4 w-4" />
            Guardar conector
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
