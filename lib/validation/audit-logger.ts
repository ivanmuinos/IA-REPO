import { createServerSupabaseClient } from "@/lib/supabase"

export interface AuditLogEntry {
  id?: string
  table_name: string
  record_id: string
  operation: "CREATE" | "UPDATE" | "DELETE"
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  user_id?: string
  user_email?: string
  timestamp: string
  ip_address?: string
  user_agent?: string
  changes_summary?: string
}

export class AuditLogger {
  /**
   * Registra una operación en el log de auditoría
   */
  static async logOperation(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    try {
      const supabase = createServerSupabaseClient()

      const auditEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
        changes_summary: this.generateChangesSummary(entry.old_values, entry.new_values),
      }

      const { error } = await supabase.from("audit_logs").insert([auditEntry])

      if (error) {
        console.error("Error logging audit entry:", error)
      }
    } catch (error) {
      console.error("Failed to log audit entry:", error)
    }
  }

  /**
   * Registra creación de registro
   */
  static async logCreate(
    tableName: string,
    recordId: string,
    newValues: Record<string, any>,
    userInfo?: { id?: string; email?: string; ip?: string; userAgent?: string },
  ): Promise<void> {
    await this.logOperation({
      table_name: tableName,
      record_id: recordId,
      operation: "CREATE",
      new_values: newValues,
      user_id: userInfo?.id,
      user_email: userInfo?.email,
      ip_address: userInfo?.ip,
      user_agent: userInfo?.userAgent,
    })
  }

  /**
   * Registra actualización de registro
   */
  static async logUpdate(
    tableName: string,
    recordId: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    userInfo?: { id?: string; email?: string; ip?: string; userAgent?: string },
  ): Promise<void> {
    await this.logOperation({
      table_name: tableName,
      record_id: recordId,
      operation: "UPDATE",
      old_values: oldValues,
      new_values: newValues,
      user_id: userInfo?.id,
      user_email: userInfo?.email,
      ip_address: userInfo?.ip,
      user_agent: userInfo?.userAgent,
    })
  }

  /**
   * Registra eliminación de registro
   */
  static async logDelete(
    tableName: string,
    recordId: string,
    oldValues: Record<string, any>,
    userInfo?: { id?: string; email?: string; ip?: string; userAgent?: string },
  ): Promise<void> {
    await this.logOperation({
      table_name: tableName,
      record_id: recordId,
      operation: "DELETE",
      old_values: oldValues,
      user_id: userInfo?.id,
      user_email: userInfo?.email,
      ip_address: userInfo?.ip,
      user_agent: userInfo?.userAgent,
    })
  }

  /**
   * Obtiene el historial de cambios de un registro
   */
  static async getRecordHistory(tableName: string, recordId: string): Promise<AuditLogEntry[]> {
    try {
      const supabase = createServerSupabaseClient()

      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("table_name", tableName)
        .eq("record_id", recordId)
        .order("timestamp", { ascending: false })

      if (error) {
        console.error("Error fetching audit history:", error)
        return []
      }

      return data as AuditLogEntry[]
    } catch (error) {
      console.error("Failed to fetch audit history:", error)
      return []
    }
  }

  /**
   * Genera un resumen de los cambios realizados
   */
  private static generateChangesSummary(oldValues?: Record<string, any>, newValues?: Record<string, any>): string {
    if (!oldValues && newValues) {
      return "Registro creado"
    }

    if (oldValues && !newValues) {
      return "Registro eliminado"
    }

    if (oldValues && newValues) {
      const changes: string[] = []

      for (const [key, newValue] of Object.entries(newValues)) {
        const oldValue = oldValues[key]
        if (oldValue !== newValue) {
          changes.push(`${key}: "${oldValue}" → "${newValue}"`)
        }
      }

      return changes.length > 0 ? `Campos modificados: ${changes.join(", ")}` : "Sin cambios detectados"
    }

    return "Operación desconocida"
  }
}
