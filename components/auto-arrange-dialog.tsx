"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type LayoutDirection = "horizontal" | "vertical" | "auto"

interface AutoArrangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onArrange: (direction: LayoutDirection, options?: { spacing?: number }) => void
}

export default function AutoArrangeDialog({
  open,
  onOpenChange,
  onArrange,
}: AutoArrangeDialogProps) {
  const [direction, setDirection] = useState<LayoutDirection>("auto")
  const [spacing, setSpacing] = useState(100)

  const handleArrange = () => {
    onArrange(direction, { spacing })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Auto-organizar flujo</DialogTitle>
          <DialogDescription>
            Organiza automáticamente los bloques del flujo para mejorar la legibilidad.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="direction">Dirección de organización</Label>
            <RadioGroup value={direction} onValueChange={(value) => setDirection(value as LayoutDirection)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto">Automática (recomendado)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="horizontal" id="horizontal" />
                <Label htmlFor="horizontal">Horizontal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vertical" id="vertical" />
                <Label htmlFor="vertical">Vertical</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="spacing">Espaciado entre bloques (px)</Label>
            <input
              id="spacing"
              type="range"
              min="50"
              max="200"
              step="10"
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground">{spacing}px</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleArrange}>
            Organizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 