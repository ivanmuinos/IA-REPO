import { z } from "zod"

// Base validation schemas
export const emailSchema = z
  .string()
  .email("Email inválido")
  .min(1, "Email es requerido")
  .max(254, "Email demasiado largo")
  .transform((email) => email.toLowerCase().trim())

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Formato de teléfono inválido")
  .transform((phone) => phone.replace(/\s+/g, ""))

export const documentSchema = z
  .string()
  .min(8, "Documento debe tener al menos 8 caracteres")
  .max(20, "Documento demasiado largo")
  .regex(/^[A-Z0-9]+$/, "Documento solo puede contener letras mayúsculas y números")
  .transform((doc) => doc.toUpperCase().trim())

export const nameSchema = z
  .string()
  .min(1, "Nombre es requerido")
  .max(100, "Nombre demasiado largo")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Nombre solo puede contener letras y espacios")
  .transform((name) => name.trim().replace(/\s+/g, " "))

export const dateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de fecha inválido (DD/MM/YYYY)")
  .refine((date) => {
    const [day, month, year] = date.split("/").map(Number)
    const dateObj = new Date(year, month - 1, day)
    return (
      dateObj.getDate() === day &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getFullYear() === year &&
      year >= 1900 &&
      year <= new Date().getFullYear()
    )
  }, "Fecha inválida")

export const coordinatesSchema = z
  .string()
  .regex(/^-?\d+\.\d+,\s*-?\d+\.\d+$/, "Formato de coordenadas inválido")
  .refine((coords) => {
    const [lat, lng] = coords.split(",").map((c) => Number.parseFloat(c.trim()))
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  }, "Coordenadas fuera de rango válido")

export const ipAddressSchema = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    "Dirección IP inválida",
  )

// Enum schemas
export const estadoSchema = z.enum(["completado", "en-progreso", "revision", "abandonado", "rechazado"], {
  errorMap: () => ({ message: "Estado inválido" }),
})

export const tipoDocumentoSchema = z.enum(["DNI", "NIE", "Pasaporte", "Cedula"], {
  errorMap: () => ({ message: "Tipo de documento inválido" }),
})

export const nivelRiesgoSchema = z.enum(["Alto", "Medio", "Bajo"], {
  errorMap: () => ({ message: "Nivel de riesgo inválido" }),
})

export const complianceSchema = z.enum(["Aprobado", "Rechazado", "Pendiente"], {
  errorMap: () => ({ message: "Estado de compliance inválido" }),
})

export const estadoPasoSchema = z.enum(["completado", "revision", "pendiente"], {
  errorMap: () => ({ message: "Estado de paso inválido" }),
})

// Complex object schemas
export const pasoSchema = z.object({
  id: z.string().min(1, "ID de paso requerido"),
  nombre: nameSchema,
  estado: estadoPasoSchema,
  tiempo: z.string().regex(/^\d+s$|^-$/, "Formato de tiempo inválido"),
  timestamp: z.string().regex(/^\d{2}:\d{2}:\d{2}$|^-$/, "Formato de timestamp inválido"),
})

export const datosOCRSchema = z.object({
  nombre: nameSchema,
  apellidos: nameSchema,
  documento: documentSchema,
  tipoDocumento: tipoDocumentoSchema,
  fechaNacimiento: dateSchema,
  fechaExpedicion: dateSchema,
  fechaCaducidad: dateSchema.refine((fecha) => {
    const [day, month, year] = fecha.split("/").map(Number)
    const fechaObj = new Date(year, month - 1, day)
    return fechaObj > new Date()
  }, "Fecha de caducidad debe ser futura"),
  nacionalidad: z.string().min(1, "Nacionalidad requerida").max(50, "Nacionalidad demasiado larga"),
})

export const perfilRiesgoSchema = z.object({
  nivelRiesgo: nivelRiesgoSchema,
  compliance: complianceSchema,
  perfilTransaccional: z.string().min(1, "Perfil transaccional requerido").max(50, "Perfil demasiado largo"),
})

export const geolocalizacionSchema = z.object({
  pais: z.string().min(1, "País requerido").max(100, "País demasiado largo"),
  ciudad: z.string().min(1, "Ciudad requerida").max(100, "Ciudad demasiado larga"),
  coordenadas: coordinatesSchema,
  direccionIP: ipAddressSchema,
  proveedor: z.string().min(1, "Proveedor requerido").max(100, "Proveedor demasiado largo"),
})

export const dispositivoInfoSchema = z.object({
  tipo: z.string().min(1, "Tipo de dispositivo requerido").max(50, "Tipo demasiado largo"),
  modelo: z.string().min(1, "Modelo requerido").max(100, "Modelo demasiado largo"),
  sistemaOperativo: z.string().min(1, "Sistema operativo requerido").max(100, "SO demasiado largo"),
  navegador: z.string().min(1, "Navegador requerido").max(100, "Navegador demasiado largo"),
  resolucion: z.string().regex(/^\d+x\d+$/, "Formato de resolución inválido"),
  userAgent: z.string().min(1, "User agent requerido").max(500, "User agent demasiado largo"),
})

export const resultadoSchema = z.object({
  resultado: z.string().min(1, "Resultado requerido").max(100, "Resultado demasiado largo"),
  confianza: z.string().regex(/^\d+%$/, "Formato de confianza inválido (debe terminar en %)"),
  observaciones: z.string().min(1, "Observaciones requeridas").max(500, "Observaciones demasiado largas"),
})

export const resultadosSchema = z.object({
  ocr: resultadoSchema,
  biometria: resultadoSchema,
})

// Main persona schema
export const personaSchema = z.object({
  id: z.number().int().positive("ID debe ser un número positivo"),
  nombre: nameSchema,
  documento: documentSchema,
  flujo: z.string().min(1, "Flujo requerido").max(100, "Flujo demasiado largo"),
  fecha: z.string().regex(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/, "Formato de fecha y hora inválido"),
  estado: estadoSchema,
  progreso: z.number().int().min(0, "Progreso mínimo 0").max(100, "Progreso máximo 100"),
  email: emailSchema,
  telefono: phoneSchema,
  pasos: z.array(pasoSchema).min(1, "Debe tener al menos un paso"),
  datosOCR: datosOCRSchema,
  perfilRiesgo: perfilRiesgoSchema,
  geolocalizacion: geolocalizacionSchema,
  dispositivoInfo: dispositivoInfoSchema,
  resultados: resultadosSchema,
})

// Partial schemas for updates
export const personaUpdateSchema = personaSchema.partial().omit({ id: true })

export const personaCreateSchema = personaSchema.omit({ id: true })

// Flow schemas
export const flowSchema = z.object({
  id: z.string().uuid("ID debe ser un UUID válido"),
  name: z.string().min(1, "Nombre requerido").max(100, "Nombre demasiado largo"),
  type: z.string().min(1, "Tipo requerido").max(50, "Tipo demasiado largo"),
  status: z.enum(["active", "inactive", "draft"], {
    errorMap: () => ({ message: "Estado de flujo inválido" }),
  }),
  description: z.string().max(500, "Descripción demasiado larga").optional(),
  created_at: z.string().datetime("Formato de fecha inválido"),
  updated_at: z.string().datetime("Formato de fecha inválido"),
  last_edited: z.string().datetime("Formato de fecha inválido"),
  last_activity: z.string().datetime("Formato de fecha inválido").optional(),
  theme_id: z.string().uuid("Theme ID debe ser un UUID válido").optional(),
})

export const flowCreateSchema = flowSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  last_edited: true,
})

export const flowUpdateSchema = flowSchema.partial().omit({
  id: true,
  created_at: true,
})

// User management schemas
export const userSchema = z.object({
  id: z.number().int().positive("ID debe ser un número positivo"),
  nombre: nameSchema,
  email: emailSchema,
  rol: z.enum(["Admin", "Editor", "Solo lectura"], {
    errorMap: () => ({ message: "Rol inválido" }),
  }),
  estado: z.enum(["Activo", "Suspendido"], {
    errorMap: () => ({ message: "Estado de usuario inválido" }),
  }),
})

export const userCreateSchema = userSchema.omit({ id: true })
export const userUpdateSchema = userSchema.partial().omit({ id: true })

// Export type definitions
export type PersonaData = z.infer<typeof personaSchema>
export type PersonaCreateData = z.infer<typeof personaCreateSchema>
export type PersonaUpdateData = z.infer<typeof personaUpdateSchema>
export type FlowData = z.infer<typeof flowSchema>
export type FlowCreateData = z.infer<typeof flowCreateSchema>
export type FlowUpdateData = z.infer<typeof flowUpdateSchema>
export type UserData = z.infer<typeof userSchema>
export type UserCreateData = z.infer<typeof userCreateSchema>
export type UserUpdateData = z.infer<typeof userUpdateSchema>
