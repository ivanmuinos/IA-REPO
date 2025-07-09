"use client"
import {
  AlertCircle,
  CheckCircle2,
  CircleCheck,
  FileCheck,
  FileText,
  MessageSquare,
  Play,
  UserCheck,
  LayoutGrid,
} from "lucide-react"
import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type { FlowNode, FlowConnection, Position, FlowValidationError } from "@/types/flow"
import AutoArrangeDialog from "@/components/AutoArrangeDialog" // Import AutoArrangeDialog

interface FlowCanvasProps {
  onSelectBlock: (blockId: string | null) => void
  nodes: FlowNode[]
  connections: FlowConnection[]
  onUpdateNodes?: (nodes: FlowNode[]) => void
  onUpdateConnections?: (connections: FlowConnection[]) => void
  validationErrors?: FlowValidationError[]
}

export function FlowCanvas({
  onSelectBlock,
  nodes,
  connections,
  onUpdateNodes,
  onUpdateConnections,
  validationErrors = [],
}: FlowCanvasProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null)
  const [isCreatingConnection, setIsCreatingConnection] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string; position: Position } | null>(null)
  const [connectionEnd, setConnectionEnd] = useState<Position | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  const [showAutoArrangeDialog, setShowAutoArrangeDialog] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)

  // Obtener el icono para un tipo de nodo
  const getIcon = (type: string) => {
    switch (type) {
      case "inicio":
        return <Play className="h-4 w-4 text-primary" />
      case "ocr":
        return <FileText className="h-4 w-4 text-primary" />
      case "biometria":
        return <UserCheck className="h-4 w-4 text-primary" />
      case "listas":
        return <FileCheck className="h-4 w-4 text-primary" />
      case "revision":
        return <AlertCircle className="h-4 w-4 text-primary" />
      case "decision":
        return <CircleCheck className="h-4 w-4 text-primary" />
      case "mensaje":
        return <MessageSquare className="h-4 w-4 text-primary" />
      case "fin":
        return <CheckCircle2 className="h-4 w-4 text-primary" />
      default:
        return null
    }
  }

  // Manejar la selección de un nodo
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId)
    onSelectBlock(nodeId)
  }

  // Manejar el inicio de una conexión
  const handleStartConnection = (nodeId: string, e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const position = {
      x: (e.clientX - rect.left) / scale - offset.x,
      y: (e.clientY - rect.top) / scale - offset.y,
    }

    setIsCreatingConnection(true)
    setConnectionStart({ nodeId, position })
    setConnectionEnd(position)

    e.stopPropagation()
  }

  // Manejar el movimiento del mouse durante la creación de una conexión
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale - offset.x
    const y = (e.clientY - rect.top) / scale - offset.y

    if (isCreatingConnection && connectionStart) {
      setConnectionEnd({ x, y })
    } else if (isDragging && dragStart) {
      setOffset({
        x: offset.x + (x - dragStart.x),
        y: offset.y + (y - dragStart.y),
      })
    }
  }

  // Manejar el final de una conexión
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isCreatingConnection && connectionStart && connectionEnd) {
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

        if (!connectionExists && onUpdateConnections) {
          onUpdateConnections([...connections, newConnection])
        }
      }
    }

    setIsCreatingConnection(false)
    setConnectionStart(null)
    setConnectionEnd(null)
    setIsDragging(false)
    setDragStart(null)
  }

  // Encontrar un nodo en una posición determinada
  const findNodeAtPosition = (position: Position) => {
    const nodeSize = { width: 200, height: 80 }

    return nodes.find((node) => {
      const nodeX = node.position.x * scale + offset.x
      const nodeY = node.position.y * scale + offset.y

      return (
        position.x >= nodeX &&
        position.x <= nodeX + nodeSize.width &&
        position.y >= nodeY &&
        position.y <= nodeY + nodeSize.height
      )
    })
  }

  // Manejar el inicio del arrastre del canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left) / scale - offset.x
      const y = (e.clientY - rect.top) / scale - offset.y

      setIsDragging(true)
      setDragStart({ x, y })
      e.preventDefault()
    }
  }

  // Manejar el zoom del canvas
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newScale = Math.max(0.5, Math.min(2, scale + delta))
      setScale(newScale)
    } else {
      // Scroll normal
      setOffset({
        x: offset.x,
        y: offset.y - e.deltaY / scale,
      })
    }
  }

  // Obtener el color de un nodo basado en errores de validación
  const getNodeBorderColor = (nodeId: string) => {
    const hasError = validationErrors.some((error) => error.nodeIds?.includes(nodeId) && error.type === "error")

    const hasWarning = validationErrors.some((error) => error.nodeIds?.includes(nodeId) && error.type === "warning")

    if (hasError) return "border-destructive"
    if (hasWarning) return "border-warning"
    if (nodeId === selectedNodeId) return "border-primary"
    if (nodeId === hoveredNodeId) return "border-primary/70"
    return "border-border"
  }

  // Obtener el estilo de una conexión
  const getConnectionStyle = (connection: FlowConnection) => {
    const isHovered = connection.id === hoveredConnectionId
    const isSelected = selectedNodeId === connection.source || selectedNodeId === connection.target

    let strokeColor = "stroke-muted-foreground"
    let strokeWidth = 1.5

    if (isHovered) {
      strokeColor = "stroke-primary"
      strokeWidth = 2.5
    } else if (isSelected) {
      strokeColor = "stroke-primary/70"
      strokeWidth = 2
    }

    return {
      strokeColor,
      strokeWidth,
      strokeDasharray: "",
    }
  }

  // Calcular los puntos de conexión para un nodo
  const getConnectionPoints = (nodeId: string, isSource: boolean) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }

    const nodeX = node.position.x * scale + offset.x
    const nodeY = node.position.y * scale + offset.y
    const nodeWidth = 200
    const nodeHeight = 80

    // Punto en el centro derecho para fuentes, centro izquierdo para destinos
    return {
      x: nodeX + (isSource ? nodeWidth : 0),
      y: nodeY + nodeHeight / 2,
    }
  }

  // Generar la ruta SVG para una conexión
  const generateConnectionPath = (connection: FlowConnection) => {
    const source = getConnectionPoints(connection.source, true)
    const target = getConnectionPoints(connection.target, false)

    // Calcular puntos de control para la curva
    const dx = Math.abs(target.x - source.x)
    const controlPointOffset = Math.min(dx * 0.5, 100)

    const sourceControlX = source.x + controlPointOffset
    const targetControlX = target.x - controlPointOffset

    // Generar la ruta SVG
    return `M${source.x},${source.y} C${sourceControlX},${source.y} ${targetControlX},${target.y} ${target.x},${target.y}`
  }

  // Manejar la auto-organización
  const handleAutoArrange = (direction: "horizontal" | "vertical" | "auto") => {
    if (!onUpdateNodes) return

    // Importar dinámicamente la función de auto-organización
    import("@/lib/flow-layout").then(({ autoArrangeFlow }) => {
      const arrangedNodes = autoArrangeFlow(nodes, connections, direction)
      onUpdateNodes(arrangedNodes)
    })
  }

  return (
    <div
      className="h-full w-full canvas-grid p-4 overflow-hidden relative"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? "grabbing" : "default" }}
    >
      {/* Capa de fondo con cuadrícula */}
      <div
        className="absolute inset-0 bg-grid-pattern"
        style={{
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
      />

      {/* Botón de auto-organización */}
      <div className="absolute top-4 right-4 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAutoArrangeDialog(true)}
                className="bg-background"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Organizar automáticamente</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Capa SVG para las conexiones */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Definición de marcadores de flecha */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
          </marker>
          <marker id="arrowhead-primary" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
        </defs>

        {/* Conexiones existentes */}
        {connections.map((connection) => {
          const { strokeColor, strokeWidth, strokeDasharray } = getConnectionStyle(connection)
          const path = generateConnectionPath(connection)
          const isHovered = connection.id === hoveredConnectionId

          return (
            <g key={connection.id}>
              <path
                d={path}
                className={`${strokeColor} fill-none`}
                style={{
                  strokeWidth: `${strokeWidth}px`,
                  strokeDasharray,
                  markerEnd: `url(#${isHovered ? "arrowhead-primary" : "arrowhead"})`,
                }}
                onMouseEnter={() => setHoveredConnectionId(connection.id)}
                onMouseLeave={() => setHoveredConnectionId(null)}
              />
            </g>
          )
        })}

        {/* Conexión en creación */}
        {isCreatingConnection && connectionStart && connectionEnd && (
          <path
            d={`M${connectionStart.position.x},${connectionStart.position.y} L${connectionEnd.x},${connectionEnd.y}`}
            className="stroke-primary fill-none"
            style={{
              strokeWidth: "2px",
              strokeDasharray: "5,5",
              markerEnd: "url(#arrowhead-primary)",
            }}
          />
        )}
      </svg>

      {/* Nodos */}
      {nodes.map((node) => {
        const nodeX = node.position.x * scale + offset.x
        const nodeY = node.position.y * scale + offset.y
        const borderColorClass = getNodeBorderColor(node.id)

        // Verificar si el nodo tiene errores de validación
        const nodeErrors = validationErrors.filter(
          (error) => error.nodeIds?.includes(node.id) && error.type === "error",
        )

        const nodeWarnings = validationErrors.filter(
          (error) => error.nodeIds?.includes(node.id) && error.type === "warning",
        )

        return (
          <div
            key={node.id}
            className={`flow-node absolute cursor-pointer bg-card p-3 rounded-md border-2 ${borderColorClass} shadow-sm transition-all duration-200`}
            style={{
              left: `${nodeX}px`,
              top: `${nodeY}px`,
              width: "200px",
              transform: `scale(${node.id === selectedNodeId ? 1.02 : 1})`,
              zIndex: node.id === selectedNodeId ? 10 : 1,
            }}
            onClick={() => handleNodeSelect(node.id)}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                {getIcon(node.type)}
              </div>
              <span className="font-medium text-sm">{node.data.label}</span>

              {/* Indicadores de error/advertencia */}
              {nodeErrors.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="ml-auto h-5 px-1">
                        <AlertCircle className="h-3 w-3" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{nodeErrors[0].message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {nodeErrors.length === 0 && nodeWarnings.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="ml-auto h-5 px-1 border-yellow-500 text-yellow-500">
                        <AlertCircle className="h-3 w-3" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{nodeWarnings[0].message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="text-xs text-muted-foreground">{node.data.description || `Tipo: ${node.type}`}</div>

            {/* Puntos de conexión */}
            <div
              className="absolute right-0 top-1/2 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 translate-x-1/2 cursor-crosshair"
              onClick={(e) => handleStartConnection(node.id, e)}
            />

            <div className="absolute left-0 top-1/2 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-crosshair" />
          </div>
        )
      })}

      {/* Diálogo de auto-organización */}
      {showAutoArrangeDialog && (
        <AutoArrangeDialog
          open={showAutoArrangeDialog}
          onOpenChange={setShowAutoArrangeDialog}
          onArrange={handleAutoArrange}
        />
      )}
    </div>
  )
}
