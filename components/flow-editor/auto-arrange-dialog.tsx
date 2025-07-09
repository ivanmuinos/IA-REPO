"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { LayoutDirection } from "@/lib/flow-layout"
import { LayoutGrid, ArrowRightIcon, ArrowDownIcon, Wand2, MoveHorizontal, MoveVertical } from "lucide-react"

interface AutoArrangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onArrange: (direction: LayoutDirection, options?: { spacing?: number }) => void
}

export function AutoArrangeDialog({ open, onOpenChange, onArrange }: AutoArrangeDialogProps) {
  const [direction, setDirection] = useState<LayoutDirection>("auto")
  const [spacing, setSpacing] = useState(100) // Valor base de espaciado (porcentaje)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Organizar automáticamente</DialogTitle>
          <DialogDescription>Selecciona cómo quieres organizar los elementos del flujo de trabajo.</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <RadioGroup
            value={direction}
            onValueChange={(value) => setDirection(value as LayoutDirection)}
            className="grid grid-cols-1 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto" className="flex items-center cursor-pointer w-full">
                <Wand2 className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium">Automático</div>
                  <div className="text-sm text-muted-foreground">
                    Detecta la mejor disposición según la estructura del flujo
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
              <RadioGroupItem value="horizontal" id="horizontal" />
              <Label htmlFor="horizontal" className="flex items-center cursor-pointer w-full">
                <ArrowRightIcon className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium">Horizontal</div>
                  <div className="text-sm text-muted-foreground">Organiza los nodos de izquierda a derecha</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
              <RadioGroupItem value="vertical" id="vertical" />
              <Label htmlFor="vertical" className="flex items-center cursor-pointer w-full">
                <ArrowDownIcon className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium">Vertical</div>
                  <div className="text-sm text-muted-foreground">Organiza los nodos de arriba hacia abajo</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-6 space-y-4">
            <Label htmlFor="spacing-slider" className="flex items-center">
              <div className="flex items-center mr-3">
                {direction === "horizontal" ? (
                  <MoveHorizontal className="h-5 w-5 text-primary" />
                ) : (
                  <MoveVertical className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="font-medium">Espaciado entre nodos</div>
                <div className="text-sm text-muted-foreground">Ajusta la distancia entre los elementos del flujo</div>
              </div>
            </Label>

            <div className="px-2">
              <Slider
                id="spacing-slider"
                min={50}
                max={150}
                step={10}
                value={[spacing]}
                onValueChange={(value) => setSpacing(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Compacto</span>
                <span>Normal</span>
                <span>Amplio</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onArrange(direction, { spacing: spacing / 100 })
              onOpenChange(false)
            }}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Organizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
