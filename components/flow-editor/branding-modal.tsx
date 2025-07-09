"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, AlertTriangle, Check, Loader2 } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { clientThemeService, type Theme } from "@/lib/theme-service"
import { createClientSupabaseClient } from "@/lib/supabase"

interface BrandingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flowId: string // Añadimos el ID del flujo para poder asociar el tema
}

export function BrandingModal({ open, onOpenChange, flowId }: BrandingModalProps) {
  const { toast } = useToast()
  const [primaryColor, setPrimaryColor] = useState("#1855A3")
  const [secondaryColor, setSecondaryColor] = useState("#F5F5F5")
  const [textColor, setTextColor] = useState("#333333")
  const [fontFamily, setFontFamily] = useState("Inter")
  const [logo, setLogo] = useState<string | null>(null)
  const [contrastWarning, setContrastWarning] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [themeId, setThemeId] = useState<string | null>(null)
  const [existingThemes, setExistingThemes] = useState<Theme[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string>("custom")

  // Cargar el tema actual del flujo
  useEffect(() => {
    const loadTheme = async () => {
      if (!open || !flowId) return

      setLoading(true)
      try {
        // Cargar temas existentes
        const themes = await clientThemeService.getThemes()
        setExistingThemes(themes)

        // Cargar el tema asociado al flujo
        const flowTheme = await clientThemeService.getThemeByFlowId(flowId)

        if (flowTheme) {
          setThemeId(flowTheme.id)
          setPrimaryColor(flowTheme.primary_color || "#1855A3")
          setSecondaryColor(flowTheme.secondary_color || "#F5F5F5")
          setTextColor(flowTheme.text_color || "#333333")
          setFontFamily(flowTheme.font_family || "Inter")
          setLogo(flowTheme.logo_url || null)
          setSelectedTheme(flowTheme.id)
        } else {
          setSelectedTheme("custom")
        }
      } catch (error) {
        console.error("Error al cargar el tema:", error)
        toast({
          title: "Error al cargar",
          description: "No se pudo cargar la información de personalización",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTheme()
  }, [open, flowId, toast])

  // Verificar el contraste cuando cambian los colores
  useEffect(() => {
    // Función simple para calcular el contraste (no es perfecta pero sirve como ejemplo)
    const checkContrast = () => {
      // Convertir colores hex a RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? {
              r: Number.parseInt(result[1], 16),
              g: Number.parseInt(result[2], 16),
              b: Number.parseInt(result[3], 16),
            }
          : { r: 0, g: 0, b: 0 }
      }

      // Calcular luminancia
      const luminance = (rgb: { r: number; g: number; b: number }) => {
        const a = [rgb.r, rgb.g, rgb.b].map((v) => {
          v /= 255
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        })
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
      }

      const textRgb = hexToRgb(textColor)
      const bgRgb = hexToRgb(secondaryColor)

      const textLum = luminance(textRgb)
      const bgLum = luminance(bgRgb)

      const ratio = textLum > bgLum ? (textLum + 0.05) / (bgLum + 0.05) : (bgLum + 0.05) / (textLum + 0.05)

      // WCAG 2.1 AA requiere un ratio mínimo de 4.5:1 para texto normal
      setContrastWarning(ratio < 4.5)
    }

    checkContrast()
  }, [textColor, secondaryColor])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
        setLogoError("El archivo debe ser PNG, JPEG o SVG")
        return
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setLogoError("El archivo no debe superar los 2MB")
        return
      }

      setLogoError(null)

      try {
        // Subir el archivo a Supabase Storage
        const supabase = createClientSupabaseClient()
        const fileName = `logos/${flowId}/${Date.now()}-${file.name}`

        const { data, error } = await supabase.storage.from("themes").upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        })

        if (error) throw error

        // Obtener la URL pública
        const { data: urlData } = supabase.storage.from("themes").getPublicUrl(fileName)

        setLogo(urlData.publicUrl)
      } catch (error) {
        console.error("Error al subir el logo:", error)
        setLogoError("Error al subir el archivo. Inténtalo de nuevo.")
      }
    }
  }

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value)

    if (value === "custom") {
      // Mantener los valores actuales para personalización
      return
    }

    // Cargar el tema seleccionado
    const theme = existingThemes.find((t) => t.id === value)
    if (theme) {
      setPrimaryColor(theme.primary_color || "#1855A3")
      setSecondaryColor(theme.secondary_color || "#F5F5F5")
      setTextColor(theme.text_color || "#333333")
      setFontFamily(theme.font_family || "Inter")
      setLogo(theme.logo_url || null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let currentThemeId = themeId

      // Si es un tema personalizado o no hay tema seleccionado, crear uno nuevo
      if (selectedTheme === "custom" || !currentThemeId) {
        const newTheme = await clientThemeService.createTheme({
          name: `Tema de ${flowId}`,
          description: "Tema personalizado para flujo de onboarding",
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          text_color: textColor,
          font_family: fontFamily,
          logo_url: logo,
          bg_color: secondaryColor, // Usamos el color secundario como fondo
        })

        currentThemeId = newTheme.id
      }
      // Si se seleccionó un tema existente, usamos ese
      else if (selectedTheme !== "custom") {
        currentThemeId = selectedTheme
      }

      // Asociar el tema al flujo
      await clientThemeService.assignThemeToFlow(flowId, currentThemeId)

      toast({
        title: "Branding guardado",
        description: "Los cambios de personalización se han guardado correctamente",
        action: <Check className="h-4 w-4" />,
      })

      setThemeId(currentThemeId)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al guardar el tema:", error)
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios de personalización",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setPrimaryColor("#1855A3")
    setSecondaryColor("#F5F5F5")
    setTextColor("#333333")
    setFontFamily("Inter")
    setLogo(null)
    setContrastWarning(false)
    setLogoError(null)
    setSelectedTheme("custom")
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Cargando configuración de personalización...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
              {existingThemes.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="theme-select">Seleccionar tema</Label>
                  <Select value={selectedTheme} onValueChange={handleThemeChange}>
                    <SelectTrigger id="theme-select">
                      <SelectValue placeholder="Seleccionar tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Personalizado</SelectItem>
                      {existingThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="logo">Logo (240x80 px, fondo transparente recomendado)</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-20 w-60 border rounded-md flex items-center justify-center bg-muted/50 overflow-hidden">
                    {logo ? (
                      <img
                        src={logo || "/placeholder.svg"}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Subir logo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="logo-upload"
                      className="sr-only"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleLogoUpload}
                      aria-label="Subir logo"
                      aria-describedby="logo-error"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        Seleccionar archivo
                      </label>
                    </Button>
                    {logo && (
                      <Button variant="ghost" size="sm" onClick={() => setLogo(null)}>
                        Eliminar logo
                      </Button>
                    )}
                  </div>
                </div>
                {logoError && (
                  <p id="logo-error" className="text-sm text-destructive mt-1">
                    {logoError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Color primario</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: primaryColor }} />
                    <div className="flex-1 flex gap-2">
                      <Input
                        id="primary-color"
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        aria-label="Código de color primario"
                      />
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 p-1 h-10"
                        aria-label="Selector de color primario"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Color secundario</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: secondaryColor }} />
                    <div className="flex-1 flex gap-2">
                      <Input
                        id="secondary-color"
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        aria-label="Código de color secundario"
                      />
                      <Input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 p-1 h-10"
                        aria-label="Selector de color secundario"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color">Color de texto principal</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: textColor }} />
                    <div className="flex-1 flex gap-2">
                      <Input
                        id="text-color"
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        aria-label="Código de color de texto"
                      />
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-10 p-1 h-10"
                        aria-label="Selector de color de texto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-family">Tipografía</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Seleccionar tipografía" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {contrastWarning && (
                <Alert variant="warning" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    El contraste entre el color de texto y el color de fondo puede no ser suficiente para cumplir con
                    los estándares de accesibilidad WCAG 2.1 AA. Considera ajustar los colores para mejorar la
                    legibilidad.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          <TabsContent value="preview" className="py-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 border-b" style={{ backgroundColor: secondaryColor }}>
                <div className="h-10 w-32 bg-muted rounded-md mb-4">
                  {logo && <img src={logo || "/placeholder.svg"} alt="Logo" className="h-full object-contain" />}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: textColor, fontFamily }}>
                  Verificación de identidad
                </h3>
                <p className="text-muted-foreground" style={{ fontFamily }}>
                  Por favor, sigue los pasos para verificar tu identidad
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium" style={{ color: textColor, fontFamily }}>
                    Paso 1: Sube tu documento de identidad
                  </h4>
                  <div className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <span className="text-muted-foreground" style={{ fontFamily }}>
                        Arrastra o haz clic para subir
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button style={{ backgroundColor: primaryColor, fontFamily }}>Continuar</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            Restablecer valores
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
