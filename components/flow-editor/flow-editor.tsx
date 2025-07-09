"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Settings, ZoomIn, ZoomOut, MousePointer, Move } from "lucide-react"
import type { FlowNode, FlowConnection, FlowValidationError, Position, FlowNodeData } from "@/types/flow"
import { FlowBlocks } from "@/components/flow-editor/flow-blocks"
import { FlowProperties } from "@/components/flow-editor/flow-properties"
import { FlowCanvas } from "@/components/flow-editor/flow-canvas"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AutoArrangeDialog } from "@/components/flow-editor/auto-arrange-dialog"
import type { LayoutDirection } from "@/lib/flow-layout"
import { suppressResizeObserverLoopError, debounce } from "@/lib/resize-observer-polyfill"

interface FlowEditorProps {
  nodes: FlowNode[]
  setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>
  connections: FlowConnection[]
  setConnections: React.Dispatch<React.SetStateAction<FlowConnection[]>>
  selectedNodeId: string | null
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>
  validationErrors: FlowValidationError[]
  canvasRef: React.RefObject<HTMLDivElement>
}

export function FlowEditor({
  nodes,
  setNodes,
  connections,
  setConnections,
  selectedNodeId,
  setSelectedNodeId,
  validationErrors,
  canvasRef,
}: FlowEditorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<Position | null>(null)
  const [isCreatingConnection, setIsCreatingConnection] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string; position: Position } | null>(null)
  const [connectionEnd, setConnectionEnd] = useState<Position | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })
  const [isCanvasDragging, setIsCanvasDragging] = useState(false)
  const [canvasDragStart, setCanvasDragStart] = useState<Position | null>(null)
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [editorMode, setEditorMode] = useState<"select" | "pan">("select")
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false)
  const [keyboardFocusedNodeIndex, setKeyboardFocusedNodeIndex] = useState(-1)
  const [showAutoArrangeDialog, setShowAutoArrangeDialog] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)

  // Suppress ResizeObserver errors when component mounts
  useEffect(() => {
    suppressResizeObserverLoopError()

    // Delay initialization to prevent ResizeObserver issues
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Actualizar el nodo seleccionado cuando cambia el ID seleccionado
  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId)
      setSelectedNode(node || null)
    } else {
      setSelectedNode(null)
    }
  }, [selectedNodeId, nodes])

  // Manejar navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Activar modo de navegación por teclado con Tab
      if (e.key === "Tab" && !isKeyboardNavigating) {
        e.preventDefault()
        setIsKeyboardNavigating(true)
        setKeyboardFocusedNodeIndex(0)
      }

      // Navegación entre nodos con flechas
      if (isKeyboardNavigating) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault()
          setKeyboardFocusedNodeIndex((prev) => (prev < nodes.length - 1 ? prev + 1 : prev))
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault()
          setKeyboardFocusedNodeIndex((prev) => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === "Enter" && keyboardFocusedNodeIndex >= 0) {
          e.preventDefault()
          setSelectedNodeId(nodes[keyboardFocusedNodeIndex].id)
        } else if (e.key === "Escape") {
          e.preventDefault()
          setIsKeyboardNavigating(false)
          setKeyboardFocusedNodeIndex(-1)
        }
      }

      // Atajos de teclado para zoom
      if (e.ctrlKey && e.key === "=") {
        e.preventDefault()
        setScale((prev) => Math.min(2, prev + 0.1))
      } else if (e.ctrlKey && e.key === "-") {
        e.preventDefault()
        setScale((prev) => Math.max(0.5, prev - 0.1))
      }

      // Atajos para cambiar de modo
      if (e.key === "v" || e.key === "V") {
        setEditorMode("select")
      } else if (e.key === "h" || e.key === "H") {
        setEditorMode("pan")
      }

      // Eliminar nodo seleccionado con Delete o Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        const node = nodes.find((n) => n.id === selectedNodeId)
        if (node && node.type !== "inicio") {
          deleteNode(selectedNodeId)
        }
      }

      // Auto-organizar con Ctrl+A
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault()
        setShowAutoArrangeDialog(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isKeyboardNavigating, keyboardFocusedNodeIndex, nodes, selectedNodeId])

  // Generar un ID único para un nuevo nodo
  const generateNodeId = (type: string) => {
    const existingIds = nodes.filter((n) => n.type === type).map((n) => n.id)
    let counter = 1
    let newId = `${type}-${counter}`

    while (existingIds.includes(newId)) {
      counter++
      newId = `${type}-${counter}`
    }

    return newId
  }

  // Manejar el inicio del arrastre de un bloque
  const handleBlockDragStart = (blockType: string) => {
    setIsDragging(true)
    setDraggedBlock(blockType)
  }

  // Manejar el movimiento durante el arrastre con debounce para evitar demasiados eventos
  const handleCanvasMouseMove = useCallback(
    debounce((e: React.MouseEvent) => {
      if (!canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - offset.x) / scale
      const y = (e.clientY - rect.top - offset.y) / scale

      if (isDragging && draggedBlock) {
        setDragPosition({ x, y })
      } else if (isCreatingConnection && connectionStart) {
        setConnectionEnd({ x, y })
      } else if (isCanvasDragging && canvasDragStart) {
        const dx = e.clientX - canvasDragStart.x
        const dy = e.clientY - canvasDragStart.y
        setOffset({
          x: offset.x + dx,
          y: offset.y + dy,
        })
        setCanvasDragStart({
          x: e.clientX,
          y: e.clientY,
        })
      }
    }, 10),
    [
      canvasRef,
      scale,
      offset,
      isDragging,
      draggedBlock,
      isCreatingConnection,
      connectionStart,
      isCanvasDragging,
      canvasDragStart,
    ],
  )

  // Manejar el final del arrastre
  const handleCanvasMouseUp = () => {
    if (isDragging && draggedBlock && dragPosition) {
      // Crear un nuevo nodo
      const newNodeId = generateNodeId(draggedBlock)
      const newNode: FlowNode = {
        id: newNodeId,
        type: draggedBlock,
        position: { ...dragPosition },
        data: { label: getNodeLabel(draggedBlock) },
      }

      setNodes([...nodes, newNode])
      setSelectedNodeId(newNodeId)
    } else if (isCreatingConnection && connectionStart && connectionEnd) {
      // Finalizar la creación de una conexión
      const targetNode = findNodeAtPosition(connectionEnd)

      if (targetNode && targetNode.id !== connectionStart.nodeId) {
        const newConnection: FlowConnection = {
          id: `${connectionStart.nodeId}-${targetNode.id}`,
          source: connectionStart.nodeId,
          target: targetNode.id,
        }

        // Verificar que no exista ya esta conexión
        const connectionExists = connections.some(
          (conn) => conn.source === newConnection.source && conn.target === newConnection.target,
        )

        if (!connectionExists) {
          setConnections([...connections, newConnection])
        }
      }
    }

    // Resetear estados
    setIsDragging(false)
    setDraggedBlock(null)
    setDragPosition(null)
    setIsCreatingConnection(false)
    setConnectionStart(null)
    setConnectionEnd(null)
    setIsCanvasDragging(false)
    setCanvasDragStart(null)
  }

  // Encontrar un nodo en una posición determinada
  const findNodeAtPosition = (position: Position) => {
    const nodeSize = { width: 200, height: 80 }

    return nodes.find((node) => {
      return (
        position.x >= node.position.x &&
        position.x <= node.position.x + nodeSize.width &&
        position.y >= node.position.y &&
        position.y <= node.position.y + nodeSize.height
      )
    })
  }

  // Obtener la etiqueta para un tipo de nodo
  const getNodeLabel = (type: string) => {
    switch (type) {
      case "inicio":
        return "Inicio"
      case "ocr":
        return "OCR de documento"
      case "biometria":
        return "Validación biométrica"
      case "listas":
        return "Validación contra listas"
      case "revision":
        return "Revisión manual"
      case "decision":
        return "Decisión automática"
      case "mensaje":
        return "Mensaje personalizado"
      case "fin":
        return "Fin del flujo"
      default:
        return "Bloque"
    }
  }

  // Iniciar la creación de una conexión
  const handleStartConnection = (nodeId: string, position: Position) => {
    setIsCreatingConnection(true)
    setConnectionStart({ nodeId, position })
    setConnectionEnd(position)
  }

  // Manejar el inicio del arrastre del canvas
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Activar el arrastre del canvas con el botón central o si estamos en modo pan
    if (e.button === 1 || editorMode === "pan") {
      setIsCanvasDragging(true)
      setCanvasDragStart({
        x: e.clientX,
        y: e.clientY,
      })
      e.preventDefault()
    }
  }

  // Manejar el zoom del canvas con debounce
  const handleCanvasWheel = useCallback(
    debounce((e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        const newScale = Math.max(0.5, Math.min(2, scale + delta))
        setScale(newScale)
      }
    }, 50),
    [scale],
  )

  // Actualizar la posición de un nodo
  const updateNodePosition = (nodeId: string, position: Position) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, position }
        }
        return node
      }),
    )
  }

  // Eliminar un nodo y sus conexiones
  const deleteNode = (nodeId: string) => {
    // No permitir eliminar nodos fijos como "inicio"
    const node = nodes.find((n) => n.id === nodeId)
    if (node?.type === "inicio") return

    setNodes(nodes.filter((node) => node.id !== nodeId))
    setConnections(connections.filter((conn) => conn.source !== nodeId && conn.target !== nodeId))

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
    }
  }

  // Actualizar las propiedades de un nodo
  const updateNodeData = (nodeId: string, data: FlowNodeData) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } }
        }
        return node
      }),
    )
  }

  // Cambiar el zoom
  const handleZoomIn = () => {
    setScale((prev) => Math.min(2, prev + 0.1))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.1))
  }

  // Centrar el canvas
  const handleCenterCanvas = () => {
    setOffset({ x: 0, y: 0 })
    setScale(1)
  }

  // Manejar la auto-organización
  const handleAutoArrange = (direction: LayoutDirection, options?: { spacing?: number }) => {
    // Importar dinámicamente la función de auto-organización
    import("@/lib/flow-layout").then(({ autoArrangeFlow }) => {
      // Aplicar factor de espaciado si se proporciona
      const spacingFactor = options?.spacing || 1

      // Guardar valores originales
      const originalHorizontalSpacing = 300
      const originalVerticalSpacing = 180

      // Modificar temporalmente las constantes de espaciado
      const HORIZONTAL_SPACING = originalHorizontalSpacing * spacingFactor
      const VERTICAL_SPACING = originalVerticalSpacing * spacingFactor

      // Aplicar la organización con el espaciado ajustado
      const arrangedNodes = autoArrangeFlow(nodes, connections, direction)
      setNodes(arrangedNodes)
    })
  }

  // Mostrar un indicador de carga mientras se inicializa
  if (!isInitialized) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando editor de flujo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full" ref={editorRef}>
      {/* Panel izquierdo - Bloques disponibles */}
      <div className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Bloques disponibles</h2>
          <p className="text-sm text-muted-foreground">Arrastra al canvas</p>
        </div>
        <div className="h-[calc(100vh-8.5rem)] overflow-auto">
          <div className="p-4 space-y-2">
            <FlowBlocks
              onDragStart={handleBlockDragStart}
              allCollapsed={true}
              combineActionCategories={true}
              capitalizeCategories={true}
              enableDragForAllSteps={true}
            />
          </div>
        </div>
      </div>

      {/* Canvas central */}
      <div
        className="flex-1 relative overflow-hidden"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleCanvasWheel}
        ref={canvasRef}
        style={{ cursor: editorMode === "pan" ? "grab" : "default" }}
        tabIndex={0}
        aria-label="Editor de flujo"
      >
        {/* Barra de herramientas del canvas */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-background border rounded-lg shadow-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={editorMode === "select" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setEditorMode("select")}
                  aria-label="Modo selección"
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Modo selección (V)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={editorMode === "pan" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setEditorMode("pan")}
                  aria-label="Modo navegación"
                >
                  <Move className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Modo navegación (H)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomIn} aria-label="Acercar vista">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Acercar (Ctrl +)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomOut} aria-label="Alejar vista">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Alejar (Ctrl -)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {validationErrors.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[80%] max-w-md">
            {validationErrors.map((error, index) => (
              <Alert key={index} variant="destructive" className="mb-2">
                <AlertTitle className="text-destructive-foreground font-medium">
                  {error.title || "Error de validación"}
                </AlertTitle>
                <AlertDescription className="text-destructive-foreground/90">{error.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <FlowCanvas
          nodes={nodes}
          connections={connections}
          scale={scale}
          offset={offset}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          updateNodePosition={updateNodePosition}
          deleteNode={deleteNode}
          startConnection={handleStartConnection}
          isCreatingConnection={isCreatingConnection}
          connectionStart={connectionStart}
          connectionEnd={connectionEnd}
          validationErrors={validationErrors}
          keyboardFocusedNodeIndex={keyboardFocusedNodeIndex}
          isKeyboardNavigating={isKeyboardNavigating}
          addConnection={(source, target, label) => {
            const newConnection: FlowConnection = {
              id: `${source}-${target}`,
              source,
              target,
              label,
            }
            setConnections((prev) => [...prev, newConnection])
          }}
          updateConnection={(id, data) => {
            setConnections((prev) => prev.map((conn) => (conn.id === id ? { ...conn, ...data } : conn)))
          }}
          deleteConnection={(id) => {
            setConnections((prev) => prev.filter((conn) => conn.id !== id))
          }}
        />

        {isDragging && draggedBlock && dragPosition && (
          <div
            className="absolute pointer-events-none border-2 border-dashed border-primary rounded-lg p-4 bg-background/80"
            style={{
              left: `${dragPosition.x * scale + offset.x}px`,
              top: `${dragPosition.y * scale + offset.y}px`,
              transform: "translate(-50%, -50%)",
              width: "200px",
              height: "80px",
            }}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <span>{getNodeLabel(draggedBlock)}</span>
            </div>
          </div>
        )}

        {/* Diálogo de auto-organización */}
        {showAutoArrangeDialog && (
          <AutoArrangeDialog
            open={showAutoArrangeDialog}
            onOpenChange={setShowAutoArrangeDialog}
            onArrange={handleAutoArrange}
          />
        )}
      </div>

      {/* Panel derecho - Propiedades */}
      <div className="w-80 border-l bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Propiedades</h2>
          <p className="text-sm text-muted-foreground">
            {selectedNode ? `Configuración de: ${selectedNode.data.label}` : "Selecciona un bloque para configurar"}
          </p>
        </div>
        <div className="h-[calc(100vh-8.5rem)] overflow-auto">
          <div className="p-4">
            <FlowProperties selectedNode={selectedNode} updateNodeData={updateNodeData} />
          </div>
        </div>
      </div>
    </div>
  )
}
