"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FlowEditor } from "@/components/flow-editor/flow-editor"
import { PageHeader } from "@/components/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"

export default function EditorPage() {
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [flowData, setFlowData] = useState(null)
  const [error, setError] = useState(false)

  // Simular carga de datos del flujo basado en el ID
  useEffect(() => {
    const flowId = params.id

    // Simulación de carga de datos
    const loadFlowData = async () => {
      setLoading(true)

      try {
        // Simulamos una llamada a API con un timeout
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Verificar si el ID tiene el formato correcto (para simular validación)
        if (!flowId || !String(flowId).startsWith("fl-")) {
          throw new Error("ID de flujo no válido")
        }

        // Datos de ejemplo basados en el ID
        const mockData = {
          id: flowId,
          nombre: `Flujo ${flowId}`,
          descripcion: "Descripción del flujo cargado desde el servidor",
          // Otros datos del flujo...
        }

        setFlowData(mockData)
        setLoading(false)
        setError(false)
      } catch (err) {
        console.error("Error al cargar el flujo:", err)
        setError(true)
        setLoading(false)
        toast({
          title: "Error al cargar el flujo",
          description: "No se pudo encontrar el flujo solicitado. Verifique el ID e intente nuevamente.",
          variant: "destructive",
        })
      }
    }

    loadFlowData()
  }, [params.id, toast])

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={
          loading ? <Skeleton className="h-9 w-64" /> : error ? "Flujo no encontrado" : `Editor: ${flowData?.nombre}`
        }
        description={
          loading ? (
            <Skeleton className="h-5 w-96" />
          ) : error ? (
            "El flujo solicitado no existe o no se puede cargar"
          ) : (
            "Edite y configure los pasos del flujo de onboarding"
          )
        }
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
              <BreadcrumbLink>Editor</BreadcrumbLink>
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

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No se pudo cargar el flujo</h3>
          <p className="text-muted-foreground mb-6">
            El ID proporcionado no corresponde a un flujo válido o ha ocurrido un error al cargarlo.
          </p>
          <Button asChild>
            <a href="/flujos">Ver todos los flujos</a>
          </Button>
        </div>
      ) : (
        <FlowEditor flowId={params.id as string} initialData={flowData} />
      )}
    </div>
  )
}
