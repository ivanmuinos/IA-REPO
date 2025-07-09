"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BrandingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandingModal({ open, onOpenChange }: BrandingModalProps) {
  const [primaryColor, setPrimaryColor] = useState("#1855A3")
  const [secondaryColor, setSecondaryColor] = useState("#F5F5F5")
  const [textColor, setTextColor] = useState("#333333")
  const [fontUrl, setFontUrl] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Personalización visual del flujo</DialogTitle>
          <DialogDescription>
            Personaliza la apariencia de tu flujo de onboarding para adaptarlo a tu marca
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="branding">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="preview">Vista previa</TabsTrigger>
          </TabsList>
          <TabsContent value="branding" className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo (240x80 px, fondo transparente recomendado)</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-20 w-60 border rounded-md flex items-center justify-center bg-muted/50">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Subir logo</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Seleccionar archivo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Color primario</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: primaryColor }} />
                    <Input
                      id="primary-color"
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Color secundario</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: secondaryColor }} />
                    <Input
                      id="secondary-color"
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color">Color de texto principal</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: textColor }} />
                    <Input
                      id="text-color"
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-url">Tipografía personalizada (opcional)</Label>
                <Input
                  id="font-url"
                  type="text"
                  placeholder="URL de Google Fonts (ej: https://fonts.googleapis.com/css2?family=Roboto)"
                  value={fontUrl}
                  onChange={(e) => setFontUrl(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preview" className="py-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-card p-4 border-b" style={{ backgroundColor: secondaryColor }}>
                <div className="h-10 w-32 bg-muted rounded-md mb-4"></div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>
                  Verificación de identidad
                </h3>
                <p className="text-muted-foreground">Por favor, sigue los pasos para verificar tu identidad</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium" style={{ color: textColor }}>
                    Paso 1: Sube tu documento de identidad
                  </h4>
                  <div className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <span className="text-muted-foreground">Arrastra o haz clic para subir</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button style={{ backgroundColor: primaryColor }}>Continuar</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onOpenChange(false)}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
