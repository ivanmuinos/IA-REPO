"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ControlButton,
  useReactFlow,
  type Node,
  type Edge,
} from "reactflow"
import "reactflow/dist/style.css"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { clientFlowService } from "@/lib/flow-service"

// Definir nodos y bordes iniciales aquí en lugar de importarlos
const initialNodes: Node[] = []
const initialEdges: Edge[] = []

// Definir tipos de nodos personalizados
const nodeTypes = {
  // Si no existe CustomNode, podemos usar el nodo predeterminado
  // customNode: CustomNode,
}

// Función de validación de conexión simple
const isValidConnection = (connection) => {
  return true // Implementar lógica de validación según sea necesario
}

const isValidEndNode = (node) => {
  const type = node.type || ""
  const label = node.data?.label || ""
  return (
    type.includes("fin") ||
    type.includes("final") ||
    label.includes("fin") ||
    label.includes("final") ||
    type === "error_state"
  )
}

const isValidStartNode = (node) => {
  const type = node.type || ""
  const label = node.data?.label || ""
  return type.includes("inicio") || label.includes("inicio")
}

// Componente interno que usa los hooks de React Flow
const Flow = ({ flowId }: { flowId: string }) => {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { fitView, project } = useReactFlow()
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar los pasos del flujo al inicializar el componente
  useEffect(() => {
    const loadFlowSteps = async () => {
      try {
        setIsLoading(true)
        const flowData = await clientFlowService.getFlowSteps(flowId)
        if (flowData.nodes.length > 0) {
          setNodes(flowData.nodes)
          setEdges(flowData.connections)
        }
      } catch (error) {
        console.error("Error al cargar los pasos del flujo:", error)
        setValidationError("Error al cargar los pasos del flujo")
      } finally {
        setIsLoading(false)
      }
    }

    if (flowId) {
      loadFlowSteps()
    }
  }, [flowId, setNodes, setEdges])

  // Ajustar la vista después de cargar los nodos
  useEffect(() => {
    if (!isLoading && nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2 })
      }, 200)
    }
  }, [isLoading, nodes, fitView])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      // Intentar obtener el tipo de diferentes fuentes de datos
      let type = event.dataTransfer.getData("application/reactflow")

      // Si no hay tipo en application/reactflow, intentar con blockType
      if (!type) {
        type = event.dataTransfer.getData("blockType")
      }

      // Si aún no hay tipo, intentar con text/plain
      if (!type) {
        type = event.dataTransfer.getData("text/plain")
      }

      // Verificar que tenemos un tipo válido
      if (!type) {
        console.error("No se pudo obtener el tipo de bloque arrastrado")
        return
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      // Crear un nuevo nodo con un ID único
      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label: type },
      }

      // Actualizar el estado de los nodos inmediatamente
      setNodes((nds) => [...nds, newNode])

      // Ajustar la vista para mostrar el nuevo nodo
      setTimeout(() => {
        fitView({ padding: 0.2 })
      }, 50)
    },
    [project, setNodes, fitView],
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const validateFlow = useCallback(() => {
    // Eliminar la validación de nodos de inicio y finalización
    // Puedes agregar otras validaciones aquí si es necesario
    setValidationError(null)
    return true
  }, [])

  return (
    <div className="dndflow flex flex-col h-full">
      {validationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="text-black font-medium">{validationError}</AlertDescription>
        </Alert>
      )}

      <div className="reactflow-wrapper flex-1" ref={reactFlowWrapper}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg font-medium">Cargando flujo...</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStop={(_, node) => {
              // Actualizar la posición del nodo en el estado
              setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n)))
            }}
            fitView={false}
          >
            <Controls>
              <ControlButton onClick={validateFlow} title="Validar Flujo">
                ✓
              </ControlButton>
            </Controls>
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}

// Componente principal que envuelve el componente interno con ReactFlowProvider
export const FlowCanvas = ({ flowId }: { flowId: string }) => {
  return (
    <ReactFlowProvider>
      <Flow flowId={flowId} />
    </ReactFlowProvider>
  )
}

export default FlowCanvas
