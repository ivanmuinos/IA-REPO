import { createClient } from "@supabase/supabase-js"

// Singleton para el cliente de Supabase del lado del cliente
let clientInstance = null

// Crear cliente de Supabase para el lado del servidor
export function createServerSupabaseClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Crear cliente de Supabase para el lado del cliente
export function createClientSupabaseClient() {
  if (clientInstance) return clientInstance

  clientInstance = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return clientInstance
}
