import { createClient } from "@supabase/supabase-js"

// Singleton para el cliente de Supabase del lado del cliente
let clientInstance = null

// Verificar si las variables de entorno están configuradas
function hasSupabaseConfig() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Crear cliente de Supabase para el lado del servidor
export function createServerSupabaseClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Variables de entorno de Supabase no configuradas para el servidor")
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Crear cliente de Supabase para el lado del cliente
export function createClientSupabaseClient() {
  if (clientInstance) return clientInstance

  if (!hasSupabaseConfig()) {
    console.warn("Variables de entorno de Supabase no configuradas. Usando modo demo.")
    return null
  }

  clientInstance = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return clientInstance
}

// Verificar si Supabase está disponible
export function isSupabaseAvailable() {
  return hasSupabaseConfig()
}
