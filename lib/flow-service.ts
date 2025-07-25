import { createServerSupabaseClient, createClientSupabaseClient, isSupabaseAvailable } from "./supabase"
import type { FlowNode, FlowConnection } from "@/types/flow"

export interface Flow {
  id: string
  name: string
  type: string
  status: string
  created_at: string
  updated_at: string
  last_edited: string
  last_activity?: string
  theme_id?: string
  description?: string
}

export interface FlowData {
  nodes: FlowNode[]
  connections: FlowConnection[]
}

// Mapeo de tipos de nodos del editor a tipos de la base de datos
const nodeTypeMapping: Record<string, string> = {
  // Tipos del editor -> Tipos de la base de datos
  inicio: "user_form",
  ocr: "document_recognizer",
  biometria: "liveness_check",
  listas: "verification",
  revision: "verification",
  decision: "condition",
  mensaje: "information_display",
  fin: "final_screen",

  // Tipos de la base de datos -> Tipos del editor
  user_form: "inicio",
  document_recognizer: "ocr",
  liveness_check: "biometria",
  verification: "listas",
  condition: "decision",
  information_display: "mensaje",
  final_screen: "fin",
  "document-capture": "ocr",
  biometric: "biometria",
  "document-upload": "ocr",
  acceptance: "mensaje",
  signature: "mensaje",
  error_state: "mensaje",
  form: "inicio",
}

// Datos de ejemplo para modo demo
const demoFlows: Flow[] = [
  {
    id: "demo-1",
    name: "Flujo de Verificación KYC",
    type: "kyc_verification",
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    last_edited: "2024-01-20T14:30:00Z",
    last_activity: "2024-01-20T14:30:00Z",
    description: "Flujo completo de verificación de identidad"
  },
  {
    id: "demo-2",
    name: "Proceso de Onboarding",
    type: "onboarding",
    status: "draft",
    created_at: "2024-01-18T09:00:00Z",
    updated_at: "2024-01-19T16:45:00Z",
    last_edited: "2024-01-19T16:45:00Z",
    description: "Proceso de registro de nuevos usuarios"
  },
  {
    id: "demo-3",
    name: "Verificación de Documentos",
    type: "document_verification",
    status: "active",
    created_at: "2024-01-10T11:00:00Z",
    updated_at: "2024-01-15T13:20:00Z",
    last_edited: "2024-01-15T13:20:00Z",
    last_activity: "2024-01-15T13:20:00Z",
    description: "Verificación automática de documentos"
  }
]

// Función para obtener todos los flujos
export async function getFlows(): Promise<Flow[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("flows").select("*").order("last_edited", { ascending: false })

    if (error) {
      console.error("Error fetching flows:", error)
      throw new Error(`Error al obtener flujos: ${error.message}`)
    }

    return data as Flow[]
  } catch (error) {
    console.error("Error in getFlows:", error)
    throw error
  }
}

// Función para obtener un flujo por ID
export async function getFlowById(id: string): Promise<Flow> {
  try {
    if (!id) {
      throw new Error("ID de flujo requerido")
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("flows").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching flow with ID ${id}:`, error)
      throw new Error(`Error al obtener flujo: ${error.message}`)
    }

    return data as Flow
  } catch (error) {
    console.error("Error in getFlowById:", error)
    throw error
  }
}

// Función para obtener los pasos de un flujo y convertirlos al formato del editor
export async function getFlowSteps(flowId: string): Promise<FlowData> {
  try {
    if (!flowId) {
      throw new Error("ID de flujo requerido")
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("flow_steps").select("*").eq("flow_id", flowId).order("order_index")

    if (error) {
      console.error(`Error fetching steps for flow ${flowId}:`, error)
      throw new Error(`Error al obtener pasos del flujo: ${error.message}`)
    }

    // Convertir los datos de la base de datos al formato esperado por la UI
    const nodes: FlowNode[] = []
    const connections: FlowConnection[] = []

    // Primero crear todos los nodos
    data.forEach((step) => {
      const config = step.config || {}
      const position = config.position || { x: 100 + nodes.length * 200, y: 100 }

      // Convertir el tipo de la base de datos al tipo del editor
      const editorType = nodeTypeMapping[step.type] || step.type

      // Crear el nodo
      const node: FlowNode = {
        id: step.id,
        type: editorType,
        position: position,
        data: {
          ...config,
          label: step.title || config.label || editorType,
        },
      }
      nodes.push(node)
    })

    // Luego crear las conexiones basadas en el orden
    for (let i = 0; i < data.length - 1; i++) {
      const connection: FlowConnection = {
        id: `${data[i].id}-${data[i + 1].id}`,
        source: data[i].id,
        target: data[i + 1].id,
      }
      connections.push(connection)
    }

    return { nodes, connections }
  } catch (error) {
    console.error("Error in getFlowSteps:", error)
    throw error
  }
}

// Función para crear un nuevo flujo
export async function createFlow(flowData: Partial<Flow>): Promise<Flow> {
  try {
    const supabase = createServerSupabaseClient()
    const now = new Date().toISOString()

    const newFlow = {
      ...flowData,
      created_at: now,
      updated_at: now,
      last_edited: now,
    }

    const { data, error } = await supabase.from("flows").insert([newFlow]).select()

    if (error) {
      console.error("Error creating flow:", error)
      throw new Error(`Error al crear flujo: ${error.message}`)
    }

    return data[0] as Flow
  } catch (error) {
    console.error("Error in createFlow:", error)
    throw error
  }
}

// Función para actualizar un flujo
export async function updateFlow(id: string, flowData: Partial<Flow>): Promise<Flow> {
  try {
    if (!id) {
      throw new Error("ID de flujo requerido")
    }

    const supabase = createServerSupabaseClient()
    const now = new Date().toISOString()

    const updatedFlow = {
      ...flowData,
      updated_at: now,
      last_edited: now,
    }

    const { data, error } = await supabase.from("flows").update(updatedFlow).eq("id", id).select()

    if (error) {
      console.error(`Error updating flow ${id}:`, error)
      throw new Error(`Error al actualizar flujo: ${error.message}`)
    }

    return data[0] as Flow
  } catch (error) {
    console.error("Error in updateFlow:", error)
    throw error
  }
}

// Función para guardar los pasos de un flujo
export async function saveFlowSteps(flowId: string, flowData: FlowData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!flowId) {
      throw new Error("ID de flujo requerido")
    }

    const supabase = createServerSupabaseClient()

    // Primero, eliminamos todos los pasos existentes para este flujo
    const { error: deleteError } = await supabase.from("flow_steps").delete().eq("flow_id", flowId)

    if (deleteError) {
      console.error(`Error deleting steps for flow ${flowId}:`, deleteError)
      throw new Error(`Error al eliminar pasos existentes: ${deleteError.message}`)
    }

    // Crear un mapa de conexiones para saber el orden de los nodos
    const connectionMap = new Map()
    flowData.connections.forEach((conn) => {
      connectionMap.set(conn.source, conn.target)
    })

    // Encontrar el nodo inicial (que no es destino de ninguna conexión)
    const targetNodes = new Set(flowData.connections.map((conn) => conn.target))
    const startNodeId = flowData.nodes.find((node) => !targetNodes.has(node.id))?.id

    if (!startNodeId) {
      console.error("No se pudo encontrar un nodo inicial")
      return { success: false, error: "No se pudo encontrar un nodo inicial" }
    }

    // Construir la secuencia ordenada de nodos
    const orderedNodes = []
    let currentNodeId = startNodeId

    while (currentNodeId) {
      const node = flowData.nodes.find((n) => n.id === currentNodeId)
      if (node) {
        orderedNodes.push(node)
        currentNodeId = connectionMap.get(currentNodeId)
      } else {
        break
      }
    }

    // Insertar los nodos en orden
    const stepsToInsert = orderedNodes.map((node, index) => {
      // Convertir el tipo del editor al tipo de la base de datos
      const dbType = nodeTypeMapping[node.type] || node.type

      return {
        id: node.id,
        flow_id: flowId,
        title: node.data.label || "",
        description: node.data.description || "",
        type: dbType,
        order_index: index,
        config: {
          ...node.data,
          position: node.position,
        },
        step_library_id: null, // Se podría buscar el ID correspondiente en step_library
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })

    if (stepsToInsert.length > 0) {
      const { error: insertError } = await supabase.from("flow_steps").insert(stepsToInsert)

      if (insertError) {
        console.error(`Error inserting steps for flow ${flowId}:`, insertError)
        throw new Error(`Error al insertar pasos: ${insertError.message}`)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in saveFlowSteps:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Función para eliminar un flujo
export async function deleteFlow(id: string): Promise<{ success: boolean }> {
  try {
    if (!id) {
      throw new Error("ID de flujo requerido")
    }

    const supabase = createServerSupabaseClient()

    // Primero eliminamos los pasos asociados
    const { error: stepsError } = await supabase.from("flow_steps").delete().eq("flow_id", id)

    if (stepsError) {
      console.error(`Error deleting steps for flow ${id}:`, stepsError)
      throw new Error(`Error al eliminar pasos: ${stepsError.message}`)
    }

    // Luego eliminamos el flujo
    const { error } = await supabase.from("flows").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting flow ${id}:`, error)
      throw new Error(`Error al eliminar flujo: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteFlow:", error)
    throw error
  }
}

// Versiones del lado del cliente para usar en componentes client-side
export const clientFlowService = {
  async getFlows(): Promise<Flow[]> {
    try {
      // Si Supabase no está disponible, usar datos de ejemplo
      if (!isSupabaseAvailable()) {
        console.log("Usando datos de ejemplo - Supabase no configurado")
        return demoFlows
      }

      const supabase = createClientSupabaseClient()
      if (!supabase) {
        console.log("Usando datos de ejemplo - Cliente Supabase no disponible")
        return demoFlows
      }

      const { data, error } = await supabase.from("flows").select("*").order("last_edited", { ascending: false })

      if (error) throw new Error(`Error al obtener flujos: ${error.message}`)
      return data as Flow[]
    } catch (error) {
      console.error("Error in clientFlowService.getFlows:", error)
      console.log("Usando datos de ejemplo debido al error")
      return demoFlows
    }
  },

  async getFlowById(id: string): Promise<Flow> {
    try {
      if (!id) throw new Error("ID de flujo requerido")

      // Si Supabase no está disponible, buscar en datos de ejemplo
      if (!isSupabaseAvailable()) {
        const demoFlow = demoFlows.find(flow => flow.id === id)
        if (demoFlow) return demoFlow
        throw new Error("Flujo no encontrado")
      }

      const supabase = createClientSupabaseClient()
      if (!supabase) {
        const demoFlow = demoFlows.find(flow => flow.id === id)
        if (demoFlow) return demoFlow
        throw new Error("Flujo no encontrado")
      }

      const { data, error } = await supabase.from("flows").select("*").eq("id", id).single()

      if (error) throw new Error(`Error al obtener flujo: ${error.message}`)
      return data as Flow
    } catch (error) {
      console.error("Error in clientFlowService.getFlowById:", error)
      throw error
    }
  },

  async getFlowSteps(flowId: string): Promise<FlowData> {
    try {
      if (!flowId) throw new Error("ID de flujo requerido")

      // Si Supabase no está disponible, devolver datos de ejemplo
      if (!isSupabaseAvailable()) {
        console.log("Usando datos de ejemplo para pasos del flujo")
        return {
          nodes: [
            {
              id: "step-1",
              type: "inicio",
              position: { x: 100, y: 100 },
              data: { label: "Inicio del Proceso" }
            },
            {
              id: "step-2", 
              type: "ocr",
              position: { x: 300, y: 100 },
              data: { label: "Captura de Documento" }
            },
            {
              id: "step-3",
              type: "biometria", 
              position: { x: 500, y: 100 },
              data: { label: "Verificación Biométrica" }
            },
            {
              id: "step-4",
              type: "fin",
              position: { x: 700, y: 100 },
              data: { label: "Finalización" }
            }
          ],
          connections: [
            { id: "step-1-step-2", source: "step-1", target: "step-2" },
            { id: "step-2-step-3", source: "step-2", target: "step-3" },
            { id: "step-3-step-4", source: "step-3", target: "step-4" }
          ]
        }
      }

      const supabase = createClientSupabaseClient()
      if (!supabase) {
        console.log("Usando datos de ejemplo para pasos del flujo")
        return {
          nodes: [
            {
              id: "step-1",
              type: "inicio",
              position: { x: 100, y: 100 },
              data: { label: "Inicio del Proceso" }
            },
            {
              id: "step-2", 
              type: "ocr",
              position: { x: 300, y: 100 },
              data: { label: "Captura de Documento" }
            },
            {
              id: "step-3",
              type: "biometria", 
              position: { x: 500, y: 100 },
              data: { label: "Verificación Biométrica" }
            },
            {
              id: "step-4",
              type: "fin",
              position: { x: 700, y: 100 },
              data: { label: "Finalización" }
            }
          ],
          connections: [
            { id: "step-1-step-2", source: "step-1", target: "step-2" },
            { id: "step-2-step-3", source: "step-2", target: "step-3" },
            { id: "step-3-step-4", source: "step-3", target: "step-4" }
          ]
        }
      }

      const { data, error } = await supabase.from("flow_steps").select("*").eq("flow_id", flowId).order("order_index")

      if (error) throw new Error(`Error al obtener pasos: ${error.message}`)

      // Convertir los datos de la base de datos al formato esperado por la UI
      const nodes: FlowNode[] = []
      const connections: FlowConnection[] = []

      // Primero crear todos los nodos
      data.forEach((step: any) => {
        const config = step.config || {}
        const position = config.position || { x: 100 + nodes.length * 200, y: 100 }

        // Convertir el tipo de la base de datos al tipo del editor
        const editorType = nodeTypeMapping[step.type] || step.type

        // Crear el nodo
        const node: FlowNode = {
          id: step.id,
          type: editorType,
          position: position,
          data: {
            ...config,
            label: step.title || config.label || editorType,
          },
        }
        nodes.push(node)
      })

      // Luego crear las conexiones basadas en el orden
      for (let i = 0; i < data.length - 1; i++) {
        const connection: FlowConnection = {
          id: `${data[i].id}-${data[i + 1].id}`,
          source: data[i].id,
          target: data[i + 1].id,
        }
        connections.push(connection)
      }

      return { nodes, connections }
    } catch (error) {
      console.error("Error in clientFlowService.getFlowSteps:", error)
      throw error
    }
  },

  async createFlow(flowData: Partial<Flow>): Promise<Flow> {
    try {
      // Si Supabase no está disponible, simular creación
      if (!isSupabaseAvailable()) {
        console.log("Simulando creación de flujo en modo demo")
        const newFlow: Flow = {
          id: `demo-${Date.now()}`,
          name: flowData.name || "Nuevo Flujo",
          type: flowData.type || "kyc_verification",
          status: flowData.status || "draft",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_edited: new Date().toISOString(),
          description: flowData.description || "Flujo creado en modo demo"
        }
        return newFlow
      }

      const supabase = createClientSupabaseClient()
      if (!supabase) {
        console.log("Simulando creación de flujo en modo demo")
        const newFlow: Flow = {
          id: `demo-${Date.now()}`,
          name: flowData.name || "Nuevo Flujo",
          type: flowData.type || "kyc_verification",
          status: flowData.status || "draft",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_edited: new Date().toISOString(),
          description: flowData.description || "Flujo creado en modo demo"
        }
        return newFlow
      }

      const now = new Date().toISOString()

      const newFlow = {
        ...flowData,
        created_at: now,
        updated_at: now,
        last_edited: now,
      }

      const { data, error } = await supabase.from("flows").insert([newFlow]).select()

      if (error) throw new Error(`Error al crear flujo: ${error.message}`)
      return data[0] as Flow
    } catch (error) {
      console.error("Error in clientFlowService.createFlow:", error)
      throw error
    }
  },

  async updateFlow(id: string, flowData: Partial<Flow>): Promise<Flow> {
    try {
      if (!id) throw new Error("ID de flujo requerido")

      // Si Supabase no está disponible, simular actualización
      if (!isSupabaseAvailable()) {
        console.log("Simulando actualización de flujo en modo demo")
        const updatedFlow: Flow = {
          id,
          name: flowData.name || "Flujo Actualizado",
          type: flowData.type || "kyc_verification",
          status: flowData.status || "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_edited: new Date().toISOString(),
          description: flowData.description || "Flujo actualizado en modo demo"
        }
        return updatedFlow
      }

      const supabase = createClientSupabaseClient()
      if (!supabase) {
        console.log("Simulando actualización de flujo en modo demo")
        const updatedFlow: Flow = {
          id,
          name: flowData.name || "Flujo Actualizado",
          type: flowData.type || "kyc_verification",
          status: flowData.status || "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_edited: new Date().toISOString(),
          description: flowData.description || "Flujo actualizado en modo demo"
        }
        return updatedFlow
      }

      const now = new Date().toISOString()

      const updatedFlow = {
        ...flowData,
        updated_at: now,
        last_edited: now,
      }

      const { data, error } = await supabase.from("flows").update(updatedFlow).eq("id", id).select()

      if (error) throw new Error(`Error al actualizar flujo: ${error.message}`)
      return data[0] as Flow
    } catch (error) {
      console.error("Error in clientFlowService.updateFlow:", error)
      throw error
    }
  },

  async saveFlowSteps(flowId: string, flowData: FlowData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!flowId) throw new Error("ID de flujo requerido")

      // Si Supabase no está disponible, simular guardado
      if (!isSupabaseAvailable()) {
        console.log("Simulando guardado de pasos del flujo en modo demo")
        return { success: true }
      }

      const supabase = createClientSupabaseClient()
      if (!supabase) {
        console.log("Simulando guardado de pasos del flujo en modo demo")
        return { success: true }
      }

      // Primero, eliminamos todos los pasos existentes para este flujo
      const { error: deleteError } = await supabase.from("flow_steps").delete().eq("flow_id", flowId)

      if (deleteError) throw new Error(`Error al eliminar pasos: ${deleteError.message}`)

      // Crear un mapa de conexiones para saber el orden de los nodos
      const connectionMap = new Map()
      flowData.connections.forEach((conn) => {
        connectionMap.set(conn.source, conn.target)
      })

      // Encontrar el nodo inicial (que no es destino de ninguna conexión)
      const targetNodes = new Set(flowData.connections.map((conn) => conn.target))
      const startNodeId = flowData.nodes.find((node) => !targetNodes.has(node.id))?.id

      if (!startNodeId) {
        return { success: false, error: "No se pudo encontrar un nodo inicial" }
      }

      // Construir la secuencia ordenada de nodos
      const orderedNodes = []
      let currentNodeId = startNodeId

      while (currentNodeId) {
        const node = flowData.nodes.find((n) => n.id === currentNodeId)
        if (node) {
          orderedNodes.push(node)
          currentNodeId = connectionMap.get(currentNodeId)
        } else {
          break
        }
      }

      // Insertar los nodos en orden
      const stepsToInsert = orderedNodes.map((node, index) => {
        // Convertir el tipo del editor al tipo de la base de datos
        const dbType = nodeTypeMapping[node.type] || node.type

        return {
          id: node.id,
          flow_id: flowId,
          title: node.data.label || "",
          description: node.data.description || "",
          type: dbType,
          order_index: index,
          config: {
            ...node.data,
            position: node.position,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      })

      if (stepsToInsert.length > 0) {
        const { error: insertError } = await supabase.from("flow_steps").insert(stepsToInsert)

        if (insertError) throw new Error(`Error al insertar pasos: ${insertError.message}`)
      }

      return { success: true }
    } catch (error) {
      console.error("Error in clientFlowService.saveFlowSteps:", error)
      return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
    }
  },

  async deleteFlow(id: string): Promise<{ success: boolean }> {
    try {
      if (!id) throw new Error("ID de flujo requerido")

      // Si Supabase no está disponible, simular eliminación
      if (!isSupabaseAvailable()) {
        console.log("Simulando eliminación de flujo en modo demo")
        return { success: true }
      }

      const supabase = createClientSupabaseClient()
      if (!supabase) {
        console.log("Simulando eliminación de flujo en modo demo")
        return { success: true }
      }

      // Primero eliminamos los pasos asociados
      const { error: stepsError } = await supabase.from("flow_steps").delete().eq("flow_id", id)

      if (stepsError) throw new Error(`Error al eliminar pasos: ${stepsError.message}`)

      // Luego eliminamos el flujo
      const { error } = await supabase.from("flows").delete().eq("id", id)

      if (error) throw new Error(`Error al eliminar flujo: ${error.message}`)

      return { success: true }
    } catch (error) {
      console.error("Error in clientFlowService.deleteFlow:", error)
      throw error
    }
  },
}
