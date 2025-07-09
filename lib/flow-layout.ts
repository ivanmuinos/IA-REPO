import type { FlowNode, FlowConnection } from "@/types/flow"

// Constantes para el espaciado - Aumentadas significativamente
const HORIZONTAL_SPACING = 400 // Aumentado de 300 a 400
const VERTICAL_SPACING = 250 // Aumentado de 180 a 250
const NODE_WIDTH = 200
const NODE_HEIGHT = 80
const MIN_NODE_DISTANCE_X = 450 // Aumentado de 320 a 450
const MIN_NODE_DISTANCE_Y = 300 // Aumentado de 200 a 300

// Tipos de disposición
export type LayoutDirection = "horizontal" | "vertical" | "auto"

// Interfaz para el nodo con información adicional para el layout
interface LayoutNode extends FlowNode {
  level?: number
  order?: number
  children?: string[]
  parents?: string[]
  visited?: boolean
  x?: number
  y?: number
}

/**
 * Organiza automáticamente los nodos del flujo
 */
export function autoArrangeFlow(
  nodes: FlowNode[],
  connections: FlowConnection[],
  direction: LayoutDirection = "auto",
): FlowNode[] {
  if (nodes.length === 0) return nodes

  // Asegurarse de que todos los nodos tengan posiciones válidas
  const safeNodes = nodes.map((node) => ({
    ...node,
    position: node.position || { x: 0, y: 0 },
  }))

  // Determinar la dirección si es automática
  const actualDirection = direction === "auto" ? determineOptimalDirection(safeNodes, connections) : direction

  // Crear una copia de los nodos para trabajar
  const layoutNodes: LayoutNode[] = JSON.parse(JSON.stringify(safeNodes))

  // Construir el grafo de dependencias
  const graph = buildDependencyGraph(layoutNodes, connections)

  // Detectar nodos iniciales (sin padres)
  const startNodes = layoutNodes.filter((node) => !graph[node.id].parents.length)

  if (startNodes.length === 0 && layoutNodes.length > 0) {
    // Si no hay nodos iniciales, tomar el primero como inicio
    startNodes.push(layoutNodes[0])
  }

  // Asignar niveles a los nodos (profundidad en el grafo)
  assignLevels(startNodes, graph)

  // Organizar según la dirección
  if (actualDirection === "horizontal") {
    arrangeHorizontally(layoutNodes, graph)
  } else {
    arrangeVertically(layoutNodes, graph)
  }

  // Ajustar posiciones para evitar solapamientos
  resolveOverlaps(layoutNodes, actualDirection)

  // Centrar el flujo en el canvas
  centerFlow(layoutNodes)

  return layoutNodes.map((node) => ({
    ...node,
    position: node.position || { x: 0, y: 0 },
  }))
}

/**
 * Determina la dirección óptima basada en la estructura del flujo
 */
function determineOptimalDirection(nodes: FlowNode[], connections: FlowConnection[]): LayoutDirection {
  if (nodes.length <= 3) return "horizontal"

  // Analizar la estructura del grafo para determinar si es más ancho que alto
  const graph = buildDependencyGraph(nodes, connections)
  const levels: Record<number, number> = {}

  // Contar nodos por nivel
  nodes.forEach((node) => {
    const level = getNodeLevel(node.id, graph) || 0
    levels[level] = (levels[level] || 0) + 1
  })

  // Calcular la anchura máxima y la profundidad
  const maxWidth = Math.max(...Object.values(levels), 0)
  const depth = Object.keys(levels).length

  // Si hay más niveles que nodos en el nivel más ancho, usar vertical
  return depth > maxWidth ? "vertical" : "horizontal"
}

/**
 * Construye un grafo de dependencias a partir de los nodos y conexiones
 */
function buildDependencyGraph(
  nodes: LayoutNode[],
  connections: FlowConnection[],
): Record<string, { node: LayoutNode; children: string[]; parents: string[] }> {
  const graph: Record<string, { node: LayoutNode; children: string[]; parents: string[] }> = {}

  // Inicializar el grafo
  nodes.forEach((node) => {
    graph[node.id] = {
      node,
      children: [],
      parents: [],
    }
  })

  // Añadir relaciones basadas en las conexiones
  connections.forEach((conn) => {
    if (graph[conn.source]) {
      graph[conn.source].children.push(conn.target)
    }

    if (graph[conn.target]) {
      graph[conn.target].parents.push(conn.source)
    }
  })

  return graph
}

/**
 * Asigna niveles a los nodos basados en su profundidad en el grafo
 */
function assignLevels(
  startNodes: LayoutNode[],
  graph: Record<string, { node: LayoutNode; children: string[]; parents: string[] }>,
  level = 0,
  visited: Record<string, boolean> = {},
) {
  const nextLevel: LayoutNode[] = []

  startNodes.forEach((node) => {
    if (visited[node.id]) return

    visited[node.id] = true
    graph[node.id].node.level = level

    // Añadir hijos al siguiente nivel
    graph[node.id].children.forEach((childId) => {
      if (!visited[childId] && graph[childId]) {
        nextLevel.push(graph[childId].node)
      }
    })
  })

  if (nextLevel.length > 0) {
    assignLevels(nextLevel, graph, level + 1, visited)
  }
}

/**
 * Obtiene el nivel de un nodo en el grafo
 */
function getNodeLevel(
  nodeId: string,
  graph: Record<string, { node: LayoutNode; children: string[]; parents: string[] }>,
): number | undefined {
  return graph[nodeId]?.node.level
}

/**
 * Organiza los nodos horizontalmente (niveles en columnas)
 */
function arrangeHorizontally(
  nodes: LayoutNode[],
  graph: Record<string, { node: LayoutNode; children: string[]; parents: string[] }>,
) {
  // Agrupar nodos por nivel
  const nodesByLevel: Record<number, LayoutNode[]> = {}

  nodes.forEach((node) => {
    const level = node.level || 0
    if (!nodesByLevel[level]) {
      nodesByLevel[level] = []
    }
    nodesByLevel[level].push(node)
  })

  // Ordenar nodos dentro de cada nivel
  Object.keys(nodesByLevel).forEach((levelStr) => {
    const level = Number.parseInt(levelStr)
    const levelNodes = nodesByLevel[level]

    // Ordenar nodos basados en sus conexiones
    levelNodes.sort((a, b) => {
      // Priorizar nodos con más conexiones entrantes desde el nivel anterior
      const aParentsInPrevLevel = graph[a.id].parents.filter((p) => graph[p]?.node.level === level - 1).length

      const bParentsInPrevLevel = graph[b.id].parents.filter((p) => graph[p]?.node.level === level - 1).length

      return bParentsInPrevLevel - aParentsInPrevLevel
    })

    // Asignar posiciones X e Y con espaciado mejorado
    levelNodes.forEach((node, index) => {
      node.position = {
        x: level * HORIZONTAL_SPACING,
        y: index * VERTICAL_SPACING * 1.2, // Multiplicador adicional para aumentar el espaciado vertical
      }
    })
  })
}

/**
 * Organiza los nodos verticalmente (niveles en filas)
 */
function arrangeVertically(
  nodes: LayoutNode[],
  graph: Record<string, { node: LayoutNode; children: string[]; parents: string[] }>,
) {
  // Agrupar nodos por nivel
  const nodesByLevel: Record<number, LayoutNode[]> = {}

  nodes.forEach((node) => {
    const level = node.level || 0
    if (!nodesByLevel[level]) {
      nodesByLevel[level] = []
    }
    nodesByLevel[level].push(node)
  })

  // Ordenar nodos dentro de cada nivel
  Object.keys(nodesByLevel).forEach((levelStr) => {
    const level = Number.parseInt(levelStr)
    const levelNodes = nodesByLevel[level]

    // Ordenar nodos basados en sus conexiones
    levelNodes.sort((a, b) => {
      // Priorizar nodos con más conexiones entrantes desde el nivel anterior
      const aParentsInPrevLevel = graph[a.id].parents.filter((p) => graph[p]?.node.level === level - 1).length

      const bParentsInPrevLevel = graph[b.id].parents.filter((p) => graph[p]?.node.level === level - 1).length

      return bParentsInPrevLevel - aParentsInPrevLevel
    })

    // Asignar posiciones X e Y con espaciado mejorado
    levelNodes.forEach((node, index) => {
      node.position = {
        x: index * HORIZONTAL_SPACING * 1.2, // Multiplicador adicional para aumentar el espaciado horizontal
        y: level * VERTICAL_SPACING,
      }
    })
  })
}

/**
 * Resuelve solapamientos entre nodos - Algoritmo mejorado
 */
function resolveOverlaps(nodes: LayoutNode[], direction: LayoutDirection) {
  const isHorizontal = direction === "horizontal"
  let hasOverlap = true
  let iterations = 0
  const MAX_ITERATIONS = 30 // Aumentado para permitir más iteraciones

  // Iterar hasta que no haya solapamientos o se alcance el máximo de iteraciones
  while (hasOverlap && iterations < MAX_ITERATIONS) {
    hasOverlap = false
    iterations++

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i]
        const nodeB = nodes[j]

        // Verificar si hay solapamiento o distancia insuficiente
        const distanceX = Math.abs(nodeA.position.x - nodeB.position.x)
        const distanceY = Math.abs(nodeA.position.y - nodeB.position.y)

        const tooCloseX = distanceX < MIN_NODE_DISTANCE_X && distanceY < NODE_HEIGHT * 2
        const tooCloseY = distanceY < MIN_NODE_DISTANCE_Y && distanceX < NODE_WIDTH * 2

        if (tooCloseX || tooCloseY) {
          hasOverlap = true

          // Ajustar posición según la dirección principal
          if (isHorizontal) {
            // Si están en el mismo nivel (misma X), ajustar Y
            if (Math.abs(nodeA.position.x - nodeB.position.x) < NODE_WIDTH * 1.5) {
              nodeB.position.y = nodeA.position.y + VERTICAL_SPACING * 1.5
            }
            // Si están muy cerca horizontalmente pero no en el mismo nivel
            else if (tooCloseX) {
              // Ajustar la posición horizontal para mantener la distancia mínima
              const levelDiff = (nodeB.level || 0) - (nodeA.level || 0)
              if (levelDiff > 0) {
                nodeB.position.x = nodeA.position.x + MIN_NODE_DISTANCE_X * 1.2
              } else if (levelDiff < 0) {
                nodeA.position.x = nodeB.position.x + MIN_NODE_DISTANCE_X * 1.2
              } else {
                // Si están en el mismo nivel, separarlos verticalmente
                nodeB.position.y = nodeA.position.y + VERTICAL_SPACING * 1.5
              }
            }
          } else {
            // Si están en el mismo nivel (misma Y), ajustar X
            if (Math.abs(nodeA.position.y - nodeB.position.y) < NODE_HEIGHT * 1.5) {
              nodeB.position.x = nodeA.position.x + HORIZONTAL_SPACING * 1.5
            }
            // Si están muy cerca verticalmente pero no en el mismo nivel
            else if (tooCloseY) {
              // Ajustar la posición vertical para mantener la distancia mínima
              const levelDiff = (nodeB.level || 0) - (nodeA.level || 0)
              if (levelDiff > 0) {
                nodeB.position.y = nodeA.position.y + MIN_NODE_DISTANCE_Y * 1.2
              } else if (levelDiff < 0) {
                nodeA.position.y = nodeB.position.y + MIN_NODE_DISTANCE_Y * 1.2
              } else {
                // Si están en el mismo nivel, separarlos horizontalmente
                nodeB.position.x = nodeA.position.x + HORIZONTAL_SPACING * 1.5
              }
            }
          }
        }
      }
    }
  }

  // Aplicar un paso final de ajuste para asegurar espaciado mínimo
  ensureMinimumSpacing(nodes, isHorizontal)
}

/**
 * Asegura un espaciado mínimo entre todos los nodos
 */
function ensureMinimumSpacing(nodes: LayoutNode[], isHorizontal: boolean) {
  // Ordenar nodos por posición para procesarlos secuencialmente
  const sortedNodes = [...nodes]

  if (isHorizontal) {
    // Para layout horizontal, ordenar primero por X y luego por Y
    sortedNodes.sort((a, b) => {
      if (Math.abs(a.position.x - b.position.x) < NODE_WIDTH * 2) {
        return a.position.y - b.position.y
      }
      return a.position.x - b.position.x
    })

    // Ajustar espaciado horizontal
    let currentLevel = -1
    let lastX = 0

    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i]
      const level = node.level || 0

      if (level !== currentLevel) {
        // Nuevo nivel, reiniciar lastX
        currentLevel = level
        lastX = node.position.x
      } else {
        // Mismo nivel, asegurar espaciado mínimo
        if (node.position.x < lastX + MIN_NODE_DISTANCE_X) {
          node.position.x = lastX + MIN_NODE_DISTANCE_X
        }
        lastX = node.position.x
      }
    }
  } else {
    // Para layout vertical, ordenar primero por Y y luego por X
    sortedNodes.sort((a, b) => {
      if (Math.abs(a.position.y - b.position.y) < NODE_HEIGHT * 2) {
        return a.position.x - b.position.x
      }
      return a.position.y - b.position.y
    })

    // Ajustar espaciado vertical
    let currentLevel = -1
    let lastY = 0

    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i]
      const level = node.level || 0

      if (level !== currentLevel) {
        // Nuevo nivel, reiniciar lastY
        currentLevel = level
        lastY = node.position.y
      } else {
        // Mismo nivel, asegurar espaciado mínimo
        if (node.position.y < lastY + MIN_NODE_DISTANCE_Y) {
          node.position.y = lastY + MIN_NODE_DISTANCE_Y
        }
        lastY = node.position.y
      }
    }
  }
}

/**
 * Centra el flujo en el canvas
 */
function centerFlow(nodes: LayoutNode[]) {
  if (nodes.length === 0) return

  // Encontrar los límites del flujo
  let minX = Number.POSITIVE_INFINITY,
    minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY,
    maxY = Number.NEGATIVE_INFINITY

  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH)
    maxY = Math.max(maxY, node.position.y + NODE_HEIGHT)
  })

  // Calcular el centro del flujo
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  // Ajustar para centrar en el canvas (asumiendo un canvas de 1000x600)
  const offsetX = 500 - centerX
  const offsetY = 300 - centerY

  // Aplicar el offset a todos los nodos
  nodes.forEach((node) => {
    node.position.x += offsetX
    node.position.y += offsetY
  })
}

/**
 * Distribuye los nodos en una cuadrícula
 */
export function arrangeInGrid(nodes: FlowNode[]): FlowNode[] {
  if (nodes.length === 0) return nodes

  const result = JSON.parse(JSON.stringify(nodes)) as FlowNode[]
  const cols = Math.ceil(Math.sqrt(nodes.length))

  result.forEach((node, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols

    node.position = {
      x: 100 + col * HORIZONTAL_SPACING,
      y: 100 + row * VERTICAL_SPACING,
    }
  })

  return result
}
