import { PersonasService } from "./personas-service"

export interface DataIntegrityReport {
  timestamp: string
  totalRecords: number
  validRecords: number
  issues: DataIntegrityIssue[]
  recommendations: string[]
}

export interface DataIntegrityIssue {
  type: "duplicate_id" | "duplicate_document" | "duplicate_email" | "invalid_data" | "inconsistent_state"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  affectedRecords: number[]
  suggestedAction: string
}

export class DataIntegrityService {
  private static readonly INTEGRITY_CHECK_INTERVAL = 10 * 60 * 1000 // 10 minutes
  private static lastCheck = 0
  private static cachedReport: DataIntegrityReport | null = null

  static async performIntegrityCheck(): Promise<DataIntegrityReport> {
    const now = Date.now()

    // Return cached report if recent
    if (this.cachedReport && now - this.lastCheck < this.INTEGRITY_CHECK_INTERVAL) {
      return this.cachedReport
    }

    console.log("Performing comprehensive data integrity check...")

    const personas = await PersonasService.getAllPersonas()
    const issues: DataIntegrityIssue[] = []
    const recommendations: string[] = []

    // Check for duplicate IDs
    const idCounts = new Map<number, number>()
    personas.forEach((persona) => {
      idCounts.set(persona.id, (idCounts.get(persona.id) || 0) + 1)
    })

    const duplicateIds = Array.from(idCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([id, _]) => id)

    if (duplicateIds.length > 0) {
      issues.push({
        type: "duplicate_id",
        severity: "critical",
        description: `Found ${duplicateIds.length} duplicate IDs`,
        affectedRecords: duplicateIds,
        suggestedAction: "Remove or reassign duplicate IDs immediately",
      })
    }

    // Check for duplicate documents
    const documentCounts = new Map<string, number[]>()
    personas.forEach((persona) => {
      if (!documentCounts.has(persona.documento)) {
        documentCounts.set(persona.documento, [])
      }
      documentCounts.get(persona.documento)!.push(persona.id)
    })

    const duplicateDocuments = Array.from(documentCounts.entries()).filter(([_, ids]) => ids.length > 1)

    if (duplicateDocuments.length > 0) {
      duplicateDocuments.forEach(([document, ids]) => {
        issues.push({
          type: "duplicate_document",
          severity: "high",
          description: `Document ${document} is used by multiple personas`,
          affectedRecords: ids,
          suggestedAction: "Verify and correct document numbers",
        })
      })
    }

    // Check for duplicate emails
    const emailCounts = new Map<string, number[]>()
    personas.forEach((persona) => {
      if (!emailCounts.has(persona.email)) {
        emailCounts.set(persona.email, [])
      }
      emailCounts.get(persona.email)!.push(persona.id)
    })

    const duplicateEmails = Array.from(emailCounts.entries()).filter(([_, ids]) => ids.length > 1)

    if (duplicateEmails.length > 0) {
      duplicateEmails.forEach(([email, ids]) => {
        issues.push({
          type: "duplicate_email",
          severity: "medium",
          description: `Email ${email} is used by multiple personas`,
          affectedRecords: ids,
          suggestedAction: "Update email addresses to be unique",
        })
      })
    }

    // Check for data consistency issues
    personas.forEach((persona) => {
      // Check estado vs progreso consistency
      if (persona.estado === "completado" && persona.progreso !== 100) {
        issues.push({
          type: "inconsistent_state",
          severity: "medium",
          description: `Persona ${persona.id} marked as completed but progress is ${persona.progreso}%`,
          affectedRecords: [persona.id],
          suggestedAction: "Update progress to 100% or change status",
        })
      }

      // Check OCR data consistency
      if (persona.datosOCR.documento !== persona.documento) {
        issues.push({
          type: "inconsistent_state",
          severity: "low",
          description: `Persona ${persona.id} has mismatched document numbers`,
          affectedRecords: [persona.id],
          suggestedAction: "Synchronize document numbers between main data and OCR data",
        })
      }
    })

    // Generate recommendations
    if (issues.length === 0) {
      recommendations.push("Data integrity is excellent. No issues detected.")
    } else {
      const criticalIssues = issues.filter((i) => i.severity === "critical").length
      const highIssues = issues.filter((i) => i.severity === "high").length

      if (criticalIssues > 0) {
        recommendations.push(`Address ${criticalIssues} critical issues immediately`)
      }
      if (highIssues > 0) {
        recommendations.push(`Review and fix ${highIssues} high-priority issues`)
      }

      recommendations.push("Run data validation before each deployment")
      recommendations.push("Implement automated data integrity monitoring")
    }

    const report: DataIntegrityReport = {
      timestamp: new Date().toISOString(),
      totalRecords: personas.length,
      validRecords: personas.length - issues.reduce((sum, issue) => sum + issue.affectedRecords.length, 0),
      issues,
      recommendations,
    }

    this.cachedReport = report
    this.lastCheck = now

    console.log(`Data integrity check completed. Found ${issues.length} issues.`)
    return report
  }

  static async getIntegrityStatus(): Promise<"excellent" | "good" | "warning" | "critical"> {
    const report = await this.performIntegrityCheck()

    const criticalIssues = report.issues.filter((i) => i.severity === "critical").length
    const highIssues = report.issues.filter((i) => i.severity === "high").length
    const totalIssues = report.issues.length

    if (criticalIssues > 0) return "critical"
    if (highIssues > 0) return "warning"
    if (totalIssues > 0) return "good"
    return "excellent"
  }

  static async exportIntegrityReport(): Promise<string> {
    const report = await this.performIntegrityCheck()
    return JSON.stringify(report, null, 2)
  }
}
