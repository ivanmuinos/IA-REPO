import { createServerSupabaseClient, createClientSupabaseClient } from "./supabase"

export interface StepLibraryItem {
  id: string
  type: string
  title: string
  description: string
  icon: string
  category: string
  is_template: boolean
  config?: any
}

// Función para obtener todos los pasos de la biblioteca
export async function getStepLibrary() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("step_library").select("*").order("category").order("title")

  if (error) {
    console.error("Error fetching step library:", error)
    throw error
  }

  return data as StepLibraryItem[]
}

// Función para obtener pasos por categoría
export async function getStepsByCategory(category: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("step_library").select("*").eq("category", category).order("title")

  if (error) {
    console.error(`Error fetching steps for category ${category}:`, error)
    throw error
  }

  return data as StepLibraryItem[]
}

// Función para obtener un paso por ID
export async function getStepById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("step_library").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching step with ID ${id}:`, error)
    throw error
  }

  return data as StepLibraryItem
}

// Función para crear un nuevo paso en la biblioteca
export async function createStepLibraryItem(step: Omit<StepLibraryItem, "id">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("step_library").insert([step]).select()

  if (error) {
    console.error("Error creating step library item:", error)
    throw error
  }

  return data[0] as StepLibraryItem
}

// Función para actualizar un paso existente
export async function updateStepLibraryItem(id: string, step: Partial<StepLibraryItem>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("step_library").update(step).eq("id", id).select()

  if (error) {
    console.error(`Error updating step library item ${id}:`, error)
    throw error
  }

  return data[0] as StepLibraryItem
}

// Función para eliminar un paso
export async function deleteStepLibraryItem(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("step_library").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting step library item ${id}:`, error)
    throw error
  }

  return { success: true }
}

// Versión del lado del cliente para usar en componentes client-side
export const clientStepLibraryService = {
  async getStepLibrary() {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase.from("step_library").select("*").order("category").order("title")

    if (error) throw error
    return data as StepLibraryItem[]
  },

  async getStepsByCategory(category: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase.from("step_library").select("*").eq("category", category).order("title")

    if (error) throw error
    return data as StepLibraryItem[]
  },

  async getStepById(id: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase.from("step_library").select("*").eq("id", id).single()

    if (error) throw error
    return data as StepLibraryItem
  },
}
