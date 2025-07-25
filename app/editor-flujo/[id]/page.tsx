"use client"
import { useState, useRef, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Palette, Play, Save, Shield, Users, AlertTriangle } from "lucide-react"
import { clientFlowService } from "@/lib/flow-service"
import { FlowThemeProvider, FlowThemeApplier } from "@/components/flow-editor/theme-provider"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FlowEditor } from "@/components/flow-editor/flow-editor"
import { BrandingModal } from "@/components/flow-editor/branding-modal"
import { PersonasModal } from "@/components/flow-editor/personas-modal"
import { RegulatoryModal } from "@/components/flow-editor/regulatory-modal"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { FlowNode, FlowConnection, FlowValidationError } from "@/types/flow"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { suppressResizeObserverLoopError } from "@/lib/resize-observer-polyfill"

export default function EditorFlujoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  const router = useRouter()
  const [brandingModalOpen, setBrandingModalOpen] = useState(false)
  const [personasModalOpen, setPersonasModalOpen] = useState(false)
  const [regulatoryModalOpen, setRegulatoryModalOpen] = useState(false)
  const [nodes, setNodes] = useState<FlowNode[]>([])
  const [connections, setConnections] = useState<FlowConnection[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<FlowValidationError[]>([])
  const [flowName, setFlowName] = useState("")
  const [flowState, setFlowState] = useState<"loading" | "loaded" | "not-found" | "archived">("loading")
  const canvasRef = useRef<HTMLDivElement>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [flowData, setFlowData] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Suppress ResizeObserver errors when component mounts
  useEffect(() => {
    suppressResizeObserverLoopError()

    // Delay initialization to prevent ResizeObserver issues
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Cargar el flujo seleccionado
  useEffect(() => {
    if (!isInitialized) return

    const loadFlow = async () => {
      try {
        // Obtener los datos del flujo
        const flow = await clientFlowService.getFlowById(id)
        setFlowData(flow)
        setFlowName(flow.name)

        if (flow.status === "archived") {
          setFlowState("archived")
        } else {
          setFlowState("loaded")
        }

        // Obtener los pasos del flujo
        const flowSteps = await clientFlowService.getFlowSteps(id)

        // Ensure nodes have valid positions
        const validatedNodes = flowSteps.nodes.map((node) => ({
          ...node,
          position: node.position || { x: 0, y: 0 },
        }))

        setNodes(validatedNodes)
        setConnections(flowSteps.connections)

        // Si no hay nodos, crear un nodo de inicio por defecto
        if (validatedNodes.length === 0) {
          const initialNode: FlowNode = {
            id: crypto.randomUUID(),
            type: "inicio",
            position: { x: 300, y: 100 },
            data: { label: "Inicio", flowName: flow.name },
          }
          setNodes([initialNode])
        }

        // Scroll al inicio
        window.scrollTo(0, 0)
      } catch (error) {
        console.error("Error al cargar el flujo:", error)
        setFlowState("not-found")
      }
    }

    loadFlow()
  }, [id, isInitialized])

  // Marcar cambios sin guardar cuando se modifican nodos o conexiones
  useEffect(() => {
    if (flowState === "loaded") {
      setHasUnsavedChanges(true)
    }
  }, [nodes, connections, flowState])

  // Validar el flujo cuando cambian los nodos o conexiones
  useEffect(() => {
    const timer = setTimeout(() => {
      validateFlow()
    }, 300)

    return () => clearTimeout(timer)
  }, [nodes, connections])

  // Advertir al usuario antes de salir si hay cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  const validateFlow = () => {
    if (!nodes.length) return false

    const errors: FlowValidationError[] = []

    try {
      // Verificar si existe un nodo de fin
      const hasEndNode = nodes.some((node) => node.type === "fin")
      if (!hasEndNode) {
        errors.push({
          type: "missing-end",
          message:
            'Falta el nodo de finalización. Para completar el flujo, arrastrá un bloque "Fin del flujo" y conectalo al último paso.',
          title: "Falta el nodo de finalización",
        })
      }

      // Verificar nodos sin conexiones
      const connectedNodeIds = new Set<string>()
      connections.forEach((conn) => {
        if (conn.source) connectedNodeIds.add(conn.source)
        if (conn.target) connectedNodeIds.add(conn.target)
      })

      const disconnectedNodes = nodes.filter(
        (node) => node.type !== "inicio" && node.id && !connectedNodeIds.has(node.id),
      )

      if (disconnectedNodes.length > 0) {
        errors.push({
          type: "disconnected-nodes",
          message: `Hay ${disconnectedNodes.length} bloques sin conectar. Conectá todos los bloques para crear un flujo completo.`,
          nodeIds: disconnectedNodes.map((n) => n.id || ""),
          title: "Bloques sin conectar",
        })
      }

      // Verificar si hay un camino desde inicio hasta fin
      if (hasEndNode && nodes.length > 1) {
        const endNode = nodes.find((node) => node.type === "fin")
        const startNode = nodes.find((node) => node.type === "inicio")

        if (startNode && endNode && startNode.id && endNode.id) {
          const visited = new Set<string>()
          const visit = (nodeId: string) => {
            if (visited.has(nodeId)) return
            visited.add(nodeId)

            const outgoingConnections = connections.filter((conn) => conn.source === nodeId)
            outgoingConnections.forEach((conn) => {
              if (conn.target) visit(conn.target)
            })
          }

          visit(startNode.id)

          if (!visited.has(endNode.id)) {
            errors.push({
              type: "no-path-to-end",
              message:
                "No hay un camino desde el inicio hasta el fin del flujo. Asegurate de conectar todos los pasos necesarios.",
              title: "Flujo incompleto",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error during flow validation:", error)
      errors.push({
        type: "validation-error",
        message: "Error al validar el flujo. Por favor, revisa la estructura del flujo.",
        title: "Error de validación",
      })
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSaveFlow = async () => {
    if (validateFlow()) {
      try {
        // Actualizar el flujo
        await clientFlowService.updateFlow(id, {
          name: flowName,
          last_edited: new Date().toISOString(),
        })

        // Guardar los pasos del flujo
        await clientFlowService.saveFlowSteps(id, { nodes, connections })

        toast({
          title: "Flujo guardado",
          description: "El flujo se ha guardado correctamente",
          action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
        })
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error("Error al guardar el flujo:", error)
        toast({
          title: "Error al guardar",
          description: "Ha ocurrido un error al guardar el flujo. Inténtelo de nuevo.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Error al guardar",
        description: "Corrige los errores antes de guardar el flujo",
        variant: "destructive",
      })
    }
  }

  const handlePreviewFlow = () => {
    if (validateFlow()) {
      toast({
        title: "Vista previa",
        description: "Abriendo vista previa del flujo",
      })
    } else {
      toast({
        title: "No se puede previsualizar",
        description: "Corrige los errores antes de previsualizar",
        variant: "destructive",
      })
    }
  }

  const handleActivateFlow = async () => {
    if (validateFlow()) {
      try {
        // Actualizar el estado del flujo a activo
        await clientFlowService.updateFlow(id, {
          status: "active",
          last_edited: new Date().toISOString(),
        })

        toast({
          title: "Flujo activado",
          description: "El flujo se ha activado correctamente",
          action: <ToastAction altText="Ver flujos activos">Ver flujos activos</ToastAction>,
        })
        setHasUnsavedChanges(false)

        // Actualizar el estado local
        setFlowData({ ...flowData, status: "active" })
      } catch (error) {
        console.error("Error al activar el flujo:", error)
        toast({
          title: "Error al activar",
          description: "Ha ocurrido un error al activar el flujo. Inténtelo de nuevo.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No se puede activar",
        description: "Corrige los errores antes de activar el flujo",
        variant: "destructive",
      })
    }
  }

  const handleAddRegulatoryNodes = (newNodes: FlowNode[], newConnections: FlowConnection[]) => {
    try {
      // Ajustar posiciones para evitar solapamientos
      const existingNodeIds = new Set(nodes.map((node) => node.id))

      // Encontrar la posición más baja en el canvas actual
      let lowestY = 0
      nodes.forEach((node) => {
        if (node.position && node.position.y > lowestY) {
          lowestY = node.position.y
        }
      })

      // Añadir un margen
      lowestY += 150

      // Ajustar las posiciones de los nuevos nodos
      const adjustedNodes = newNodes.map((node, index) => {
        return {
          ...node,
          position: {
            x: node.position?.x || 0,
            y: lowestY + index * 150,
          },
        }
      })

      // Actualizar el estado
      setNodes([...nodes, ...adjustedNodes])
      setConnections([...connections, ...newConnections])

      // Marcar cambios sin guardar
      setHasUnsavedChanges(true)
    } catch (error) {
      console.error("Error adding regulatory nodes:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al añadir los nodos regulatorios.",
        variant: "destructive",
      })
    }
  }

  // Mostrar un indicador de carga mientras se inicializa
  if (!isInitialized || flowState === "loading") {
    return (
      <main className="h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <h2 className="text-xl font-semibold mb-2 mt-4">Cargando flujo...</h2>
          <p className="text-muted-foreground">Preparando el editor para {id}</p>
        </div>
      </main>
    )
  }

  if (flowState === "not-found") {
    return (
      <main className="h-screen flex flex-col">
        <header className="flex items-center h-14 border-b px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/flujos">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Volver a flujos</span>
            </Link>
          </Button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Flujo no encontrado</AlertTitle>
            <AlertDescription>
              No se pudo cargar el flujo seleccionado. Verificá que exista o intentá nuevamente.
            </AlertDescription>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/flujos")}>
              Volver a la lista de flujos
            </Button>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <FlowThemeProvider flowId={id}>
      <main className="h-screen flex flex-col">
        <FlowThemeApplier>
          {flowState === "archived" && (
            <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Flujo archivado</AlertTitle>
              <AlertDescription>
                Este flujo está archivado y no puede ser editado. Puedes visualizarlo pero no realizar cambios.
              </AlertDescription>
            </Alert>
          )}

          <header className="flex items-center justify-between h-14 border-b px-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/flujos">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Volver</span>
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="max-w-[300px] md:max-w-[400px] lg:max-w-[500px] overflow-hidden">
                <h1 className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  Editor de flujo: {flowName}
                </h1>
              </div>
              {hasUnsavedChanges && flowState !== "archived" && (
                <span className="text-xs text-muted-foreground shrink-0 ml-1" aria-label="Cambios sin guardar">
                  •
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRegulatoryModalOpen(true)}
                      disabled={flowState === "archived"}
                    >
                      <Shield className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">Regulatorio</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Agregar flujos regulatorios por país</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setPersonasModalOpen(true)}>
                      <Users className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">Usuarios</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Personas que realizaron este flujo</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBrandingModalOpen(true)}
                      disabled={flowState === "archived"}
                    >
                      <Palette className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">Branding</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Personalizar apariencia visual</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveFlow}
                      aria-label="Guardar flujo"
                      disabled={flowState === "archived"}
                    >
                      <Save className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">Guardar</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {flowState === "archived" ? "No se puede guardar un flujo archivado" : "Guardar cambios"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handlePreviewFlow} aria-label="Previsualizar flujo">
                      <Eye className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">Vista previa</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previsualizar flujo</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleActivateFlow}
                      disabled={validationErrors.length > 0 || flowState === "archived"}
                      aria-label={
                        flowState === "archived"
                          ? "No se puede activar un flujo archivado"
                          : validationErrors.length > 0
                            ? "No se puede activar: hay errores en el flujo"
                            : "Activar flujo"
                      }
                    >
                      <Play className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">Activar</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {flowState === "archived"
                      ? "No se puede activar un flujo archivado"
                      : validationErrors.length > 0
                        ? "Corrige los errores antes de activar"
                        : "Activar flujo en producción"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="editor">
              <div className="border-b px-4 py-2 flex items-center">
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TabsTrigger value="json">JSON</TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Ver y editar la estructura en formato JSON (avanzado)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsList>
              </div>
              <TabsContent value="editor" className="h-[calc(100vh-8.5rem)] p-0 m-0">
                <FlowEditor
                  nodes={nodes}
                  setNodes={setNodes}
                  connections={connections}
                  setConnections={setConnections}
                  selectedNodeId={selectedNodeId}
                  setSelectedNodeId={setSelectedNodeId}
                  validationErrors={validationErrors}
                  canvasRef={canvasRef}
                />
              </TabsContent>
              <TabsContent value="json" className="h-[calc(100vh-8.5rem)] p-4 m-0 overflow-auto">
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  {JSON.stringify(
                    {
                      id: id,
                      name: flowName,
                      nodes,
                      connections,
                    },
                    null,
                    2,
                  )}
                </pre>
              </TabsContent>
            </Tabs>
          </div>

          <BrandingModal open={brandingModalOpen} onOpenChange={setBrandingModalOpen} flowId={id} />
          <PersonasModal open={personasModalOpen} onOpenChange={setPersonasModalOpen} />
          <RegulatoryModal
            open={regulatoryModalOpen}
            onOpenChange={setRegulatoryModalOpen}
            onAddNodes={handleAddRegulatoryNodes}
          />
          <Toaster />
        </FlowThemeApplier>
      </main>
    </FlowThemeProvider>
  )
}
