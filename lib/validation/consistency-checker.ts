import { createServerSupabaseClient } from "../supabase"
import type { PersonaData } from "./schemas"

export interface ConsistencyCheckResult {
  isConsistent: boolean
  issues: ConsistencyIssue[]
  severity: "low" | "medium" | "high"
}

export interface ConsistencyIssue {
  field: string
  issue: string
  severity: "low" | "medium" | "high"
  suggestion?: string
}

export class DataConsistencyChecker {
  /**
   * Verifica la consistencia de datos de una persona
   */
  static async checkPersonaConsistency(persona: PersonaData): Promise<ConsistencyCheckResult> {
    const issues: ConsistencyIssue[] = []

    // Verificar consistencia entre documento OCR y datos principales
    if (persona.documento !== persona.datosOCR.documento) {
      issues.push({
        field: "documento",
        issue: "El documento principal no coincide con el documento OCR",
        severity: "high",
        suggestion: "Verificar que ambos documentos sean idénticos",
      })
    }

    // Verificar consistencia de nombres
    const nombreCompleto = `${persona.datosOCR.nombre} ${persona.datosOCR.apellidos}`
    if (!persona.nombre.includes(persona.datosOCR.nombre)) {
      issues.push({
        field: "nombre",
        issue: "El nombre principal no coincide con el nombre OCR",
        severity: "medium",
        suggestion: "Verificar que el nombre principal incluya el nombre del OCR",
      })
    }

    // Verificar fechas lógicas
    const fechaNacimiento = this.parseDate(persona.datosOCR.fechaNacimiento)
    const fechaExpedicion = this.parseDate(persona.datosOCR.fechaExpedicion)
    const fechaCaducidad = this.parseDate(persona.datosOCR.fechaCaducidad)

    if (fechaExpedicion <= fechaNacimiento) {
      issues.push({
        field: "fechaExpedicion",
        issue: "La fecha de expedición debe ser posterior a la fecha de nacimiento",
        severity: "high",
      })
    }

    if (fechaCaducidad <= fechaExpedicion) {
      issues.push({
        field: "fechaCaducidad",
        issue: "La fecha de caducidad debe ser posterior a la fecha de expedición",
        severity: "high",
      })
    }

    // Verificar edad lógica
    const edad = this.calculateAge(fechaNacimiento)
    if (edad < 16 || edad > 120) {
      issues.push({
        field: "fechaNacimiento",
        issue: `Edad calculada (${edad}) fuera del rango esperado`,
        severity: "medium",
        suggestion: "Verificar la fecha de nacimiento",
      })
    }

    // Verificar consistencia de progreso y estado
    if (persona.estado === "completado" && persona.progreso !== 100) {
      issues.push({
        field: "progreso",
        issue: "Estado completado pero progreso no es 100%",
        severity: "medium",
        suggestion: "Actualizar progreso a 100% o cambiar estado",
      })
    }

    if (persona.estado === "abandonado" && persona.progreso === 100) {
      issues.push({
        field: "estado",
        issue: "Estado abandonado pero progreso es 100%",
        severity: "medium",
        suggestion: "Revisar el estado del proceso",
      })
    }

    // Verificar pasos completados vs progreso
    const pasosCompletados = persona.pasos.filter((p) => p.estado === "completado").length
    const progresoEsperado = Math.round((pasosCompletados / persona.pasos.length) * 100)

    if (Math.abs(persona.progreso - progresoEsperado) > 10) {
      issues.push({
        field: "progreso",
        issue: `Progreso reportado (${persona.progreso}%) no coincide con pasos completados (${progresoEsperado}%)`,
        severity: "low",
        suggestion: "Recalcular progreso basado en pasos completados",
      })
    }

    // Verificar consistencia de resultados
    if (persona.estado === "completado" && persona.resultados.biometria.resultado !== "Válido") {
      issues.push({
        field: "resultados",
        issue: "Estado completado pero resultado biométrico no es válido",
        severity: "high",
        suggestion: "Revisar los resultados de validación",
      })
    }

    // Verificar formato de coordenadas
    const coordsRegex = /^-?\d+\.\d+,\s*-?\d+\.\d+$/
    if (!coordsRegex.test(persona.geolocalizacion.coordenadas)) {
      issues.push({
        field: "coordenadas",
        issue: "Formato de coordenadas inválido",
        severity: "low",
        suggestion: "Usar formato: latitud, longitud",
      })
    }

    // Determinar severidad general
    const highSeverityCount = issues.filter((i) => i.severity === "high").length
    const mediumSeverityCount = issues.filter((i) => i.severity === "medium").length

    let overallSeverity: "low" | "medium" | "high" = "low"
    if (highSeverityCount > 0) {
      overallSeverity = "high"
    } else if (mediumSeverityCount > 0) {
      overallSeverity = "medium"
    }

    return {
      isConsistent: issues.length === 0,
      issues,
      severity: overallSeverity,
    }
  }

  /**
   * Verifica duplicados en la base de datos
   */
  static async checkForDuplicates(persona: Partial<PersonaData>): Promise<ConsistencyIssue[]> {
    const issues: ConsistencyIssue[] = []
    const supabase = createServerSupabaseClient()

    try {
      // Verificar duplicado por documento
      if (persona.documento) {
        const { data: duplicateDoc } = await supabase
          .from("personas")
          .select("id, nombre")
          .eq("documento", persona.documento)
          .neq("id", persona.id || 0)
          .limit(1)

        if (duplicateDoc && duplicateDoc.length > 0) {
          issues.push({
            field: "documento",
            issue: `Documento ya existe para: ${duplicateDoc[0].nombre}`,
            severity: "high",
            suggestion: "Verificar si es la misma persona o corregir documento",
          })
        }
      }

      // Verificar duplicado por email
      if (persona.email) {
        const { data: duplicateEmail } = await supabase
          .from("personas")
          .select("id, nombre")
          .eq("email", persona.email)
          .neq("id", persona.id || 0)
          .limit(1)

        if (duplicateEmail && duplicateEmail.length > 0) {
          issues.push({
            field: "email",
            issue: `Email ya existe para: ${duplicateEmail[0].nombre}`,
            severity: "medium",
            suggestion: "Verificar si es la misma persona o usar email diferente",
          })
        }
      }
    } catch (error) {
      console.error("Error checking duplicates:", error)
      issues.push({
        field: "general",
        issue: "No se pudo verificar duplicados",
        severity: "low",
        suggestion: "Verificar manualmente en la base de datos",
      })
    }

    return issues
  }

  /**
   * Verifica la integridad referencial
   */
  static async checkReferentialIntegrity(data: any, table: string): Promise<ConsistencyIssue[]> {
    const issues: ConsistencyIssue[] = []
    const supabase = createServerSupabaseClient()

    try {
      // Verificar referencias a flujos
      if (data.flujo_id) {
        const { data: flow } = await supabase.from("flows").select("id").eq("id", data.flujo_id).limit(1)

        if (!flow || flow.length === 0) {
          issues.push({
            field: "flujo_id",
            issue: "Referencia a flujo inexistente",
            severity: "high",
            suggestion: "Verificar que el flujo existe o crear el flujo necesario",
          })
        }
      }

      // Verificar referencias a temas
      if (data.theme_id) {
        const { data: theme } = await supabase.from("themes").select("id").eq("id", data.theme_id).limit(1)

        if (!theme || theme.length === 0) {
          issues.push({
            field: "theme_id",
            issue: "Referencia a tema inexistente",
            severity: "medium",
            suggestion: "Usar tema por defecto o crear el tema necesario",
          })
        }
      }
    } catch (error) {
      console.error("Error checking referential integrity:", error)
      issues.push({
        field: "general",
        issue: "No se pudo verificar integridad referencial",
        severity: "low",
      })
    }

    return issues
  }

  private static parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  private static calculateAge(birthDate: Date): number {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }
}
