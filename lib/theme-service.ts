import { createServerSupabaseClient, createClientSupabaseClient } from "./supabase"

export interface Theme {
  id: string
  name: string
  description?: string
  logo_url?: string
  logo_width?: number
  logo_height?: number
  favicon_url?: string
  primary_color: string
  secondary_color: string
  accent_color?: string
  success_color?: string
  warning_color?: string
  error_color?: string
  info_color?: string
  bg_color: string
  text_color?: string
  muted_text_color?: string
  button_radius?: string
  card_radius?: string
  input_radius?: string
  font_family?: string
  heading_font_family?: string
  custom_css?: string
  border_radius?: string
  created_at?: string
  updated_at?: string
}

// Función para obtener todos los temas
export async function getThemes() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("themes").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching themes:", error)
    throw error
  }

  return data as Theme[]
}

// Función para obtener un tema por ID
export async function getThemeById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("themes").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching theme with ID ${id}:`, error)
    throw error
  }

  return data as Theme
}

// Función para crear un nuevo tema
export async function createTheme(themeData: Partial<Theme>) {
  const supabase = createServerSupabaseClient()
  const now = new Date().toISOString()

  const newTheme = {
    ...themeData,
    created_at: now,
    updated_at: now,
  }

  const { data, error } = await supabase.from("themes").insert([newTheme]).select()

  if (error) {
    console.error("Error creating theme:", error)
    throw error
  }

  return data[0] as Theme
}

// Función para actualizar un tema
export async function updateTheme(id: string, themeData: Partial<Theme>) {
  const supabase = createServerSupabaseClient()
  const now = new Date().toISOString()

  const updatedTheme = {
    ...themeData,
    updated_at: now,
  }

  const { data, error } = await supabase.from("themes").update(updatedTheme).eq("id", id).select()

  if (error) {
    console.error(`Error updating theme ${id}:`, error)
    throw error
  }

  return data[0] as Theme
}

// Función para eliminar un tema
export async function deleteTheme(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("themes").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting theme ${id}:`, error)
    throw error
  }

  return { success: true }
}

// Versiones del lado del cliente para usar en componentes client-side
export const clientThemeService = {
  async getThemes() {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase.from("themes").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as Theme[]
  },

  async getThemeById(id: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase.from("themes").select("*").eq("id", id).single()

    if (error) throw error
    return data as Theme
  },

  async createTheme(themeData: Partial<Theme>) {
    const supabase = createClientSupabaseClient()
    const now = new Date().toISOString()

    const newTheme = {
      ...themeData,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase.from("themes").insert([newTheme]).select()

    if (error) throw error
    return data[0] as Theme
  },

  async updateTheme(id: string, themeData: Partial<Theme>) {
    const supabase = createClientSupabaseClient()
    const now = new Date().toISOString()

    const updatedTheme = {
      ...themeData,
      updated_at: now,
    }

    const { data, error } = await supabase.from("themes").update(updatedTheme).eq("id", id).select()

    if (error) throw error
    return data[0] as Theme
  },

  async deleteTheme(id: string) {
    const supabase = createClientSupabaseClient()
    const { error } = await supabase.from("themes").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  },

  // Función para obtener el tema asociado a un flujo
  async getThemeByFlowId(flowId: string) {
    const supabase = createClientSupabaseClient()

    // Primero obtenemos el flow para ver su theme_id
    const { data: flowData, error: flowError } = await supabase
      .from("flows")
      .select("theme_id")
      .eq("id", flowId)
      .single()

    if (flowError) throw flowError

    // Si no tiene theme_id, devolvemos null
    if (!flowData.theme_id) return null

    // Obtenemos el tema
    const { data, error } = await supabase.from("themes").select("*").eq("id", flowData.theme_id).single()

    if (error) throw error
    return data as Theme
  },

  // Función para asociar un tema a un flujo
  async assignThemeToFlow(flowId: string, themeId: string) {
    const supabase = createClientSupabaseClient()

    const { data, error } = await supabase.from("flows").update({ theme_id: themeId }).eq("id", flowId).select()

    if (error) throw error
    return data[0]
  },
}
