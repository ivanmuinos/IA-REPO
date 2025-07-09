"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { clientFlowService } from "@/lib/flow-service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export default function NuevoFlujoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Crear el flujo en Supabase
      const newFlow = await clientFlowService.createFlow({
        name: formData.name,
        type: formData.type,
        status: "draft", // Por defecto, los nuevos flujos se crean como borradores
      })

      toast({
        title: "Flujo creado",
        description: "El flujo se ha creado correctamente. Redirigiendo al editor...",
      })

      // Redirigir al editor con el nuevo ID
      setTimeout(() => {
        router.push(`/editor-flujo/${newFlow.id}`)
      }, 1000)
    } catch (error) {
      console.error("Error al crear el flujo:", error)
      toast({
        title: "Error al crear el flujo",
        description: "Ha ocurrido un error al crear el flujo. Inténtelo de nuevo.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6">
      <div className="space-y-10">
        <PageHeader
          title="Crear nuevo flujo"
          description="Configure los detalles básicos para su nuevo flujo de onboarding"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/flujos">Flujos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Nuevo flujo</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/flujos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </a>
            </Button>
          </div>
        </PageHeader>

        <Card className="mt-10 max-w-2xl mx-auto">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">Información del flujo</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Ingrese los detalles básicos para crear su nuevo flujo de onboarding
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Nombre del flujo
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej: KYC Básico"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="text-base"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="type" className="text-base font-medium">
                  Tipo de flujo
                </Label>
                <Select name="type" onValueChange={(value) => handleSelectChange("type", value)} required>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kyc">KYC (Conoce a tu Cliente)</SelectItem>
                    <SelectItem value="kyb">KYB (Conoce a tu Negocio)</SelectItem>
                    <SelectItem value="onboarding">Onboarding General</SelectItem>
                    <SelectItem value="verification">Verificación de Identidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button variant="outline" type="button" onClick={() => router.push("/flujos")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>Creando flujo...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear y continuar
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
