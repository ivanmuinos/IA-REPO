// Servicio unificado para manejar casos de aprobación KYC y KYB
import { PersonasService, Persona } from './personas-service'

// Tipos de datos para casos de aprobación
export interface Comment {
  id: string
  author: string
  content: string
  date: string
  type: 'internal' | 'public'
}

export interface ApprovalCase {
  id: string
  type: 'person' | 'company'
  name: string
  document: string
  flow: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'critical' | 'high' | 'normal'
  assignedTo?: string
  comments: Comment[]
  justification?: string
  description?: string
  progress?: {
    identityVerification: number
    documentVerification: number
    biometricVerification?: number
    uboVerification?: number
    riskAssessment: number
    complianceCheck: number
  }
  // Datos específicos por tipo
  personalInfo?: {
    email: string
    phone: string
    birthDate: string
    nationality: string
    address: string
  }
  companyInfo?: {
    email: string
    phone: string
    address: string
    constitutionDate: string
    mainActivity: string
    companyType: string
    country: string
    website: string
  }
  documents?: {
    type: string
    status: string
    uploadedAt: string
  }[]
  riskFactors?: string[]
  complianceIssues?: string[]
}

// Datos simulados para empresas (KYB)
const mockCompanyCases: ApprovalCase[] = [
  {
    id: "company-1",
    type: "company",
    name: "Inversiones Globales S.A.",
    document: "CUIT 30-87654321-9",
    flow: "KYB Empresas",
    date: "2023-05-20 09:45",
    status: "pending",
    priority: "critical",
    assignedTo: "María López",
    comments: [
      {
        id: "comment-3",
        author: "María López",
        content: "Documentación corporativa completa, pendiente verificación de UBO",
        date: "2023-05-20 14:20",
        type: "internal"
      }
    ],
    description: "Verificación empresarial completa con análisis de riesgo",
    companyInfo: {
      email: "contacto@inversionesglobales.com",
      phone: "+54 11 4567-8901",
      address: "Av. 9 de Julio 1234, CABA",
      constitutionDate: "15/01/2010",
      mainActivity: "Inversiones financieras",
      companyType: "Sociedad Anónima",
      country: "Argentina",
      website: "www.inversionesglobales.com"
    },
    documents: [
      { type: "Certificado de existencia", status: "verified", uploadedAt: "2023-05-20 09:30" },
      { type: "CUIT", status: "verified", uploadedAt: "2023-05-20 09:25" },
      { type: "Estatutos sociales", status: "verified", uploadedAt: "2023-05-20 09:35" },
      { type: "Balance 2023", status: "pending", uploadedAt: "2023-05-20 09:40" },
      { type: "Documentos de identidad", status: "verified", uploadedAt: "2023-05-20 09:20" }
    ],
    progress: {
      identityVerification: 100,
      documentVerification: 80,
      uboVerification: 0,
      riskAssessment: 70,
      complianceCheck: 60
    },
    riskFactors: ["Sector financiero", "Operaciones internacionales"],
    complianceIssues: ["Pendiente verificación UBO", "Balance 2023 requerido"]
  },
  {
    id: "company-2",
    type: "company",
    name: "Tech Solutions S.L.",
    document: "CUIT 30-11111111-1",
    flow: "KYB Premium",
    date: "2023-05-20 16:00",
    status: "pending",
    priority: "normal",
    comments: [],
    description: "Verificación premium para empresas de tecnología",
    companyInfo: {
      email: "contact@techsolutions.com",
      phone: "+54 11 1111-1111",
      address: "Puerto Madero 789, CABA",
      constitutionDate: "05/06/2015",
      mainActivity: "Consultoría tecnológica",
      companyType: "Sociedad Limitada",
      country: "Argentina",
      website: "www.techsolutions.com"
    },
    documents: [
      { type: "Certificado de existencia", status: "verified", uploadedAt: "2023-05-20 15:45" },
      { type: "CUIT", status: "verified", uploadedAt: "2023-05-20 15:40" },
      { type: "Contrato social", status: "verified", uploadedAt: "2023-05-20 15:50" },
      { type: "Balance 2023", status: "verified", uploadedAt: "2023-05-20 15:55" }
    ],
    progress: {
      identityVerification: 100,
      documentVerification: 100,
      uboVerification: 100,
      riskAssessment: 90,
      complianceCheck: 85
    },
    riskFactors: ["Empresa establecida"],
    complianceIssues: []
  }
]

export class ApprovalService {
  /**
   * Obtiene todos los casos de aprobación (KYC + KYB)
   */
  static async getAllApprovalCases(): Promise<ApprovalCase[]> {
    try {
      // Obtener casos KYC (personas)
      const personas = await PersonasService.getAllPersonas()
      const kycCases: ApprovalCase[] = personas
        .filter(persona => persona.estado === 'revision' || persona.estado === 'en-progreso')
        .map(persona => this.convertPersonaToApprovalCase(persona))

      // Combinar con casos KYB (empresas)
      const allCases = [...kycCases, ...mockCompanyCases]
      
      // Ordenar por prioridad y fecha
      return allCases.sort((a, b) => {
        const priorityOrder = { critical: 3, high: 2, normal: 1 }
        const aPriority = priorityOrder[a.priority] || 0
        const bPriority = priorityOrder[b.priority] || 0
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority
        }
        
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
    } catch (error) {
      console.error('Error obteniendo casos de aprobación:', error)
      return []
    }
  }

  /**
   * Obtiene casos de aprobación filtrados
   */
  static async getApprovalCasesByFilters(filters: {
    type?: 'person' | 'company' | 'all'
    status?: 'pending' | 'approved' | 'rejected' | 'all'
    priority?: 'critical' | 'high' | 'normal' | 'all'
    searchTerm?: string
  }): Promise<ApprovalCase[]> {
    const allCases = await this.getAllApprovalCases()
    
    return allCases.filter(case_ => {
      const matchesType = !filters.type || filters.type === 'all' || case_.type === filters.type
      const matchesStatus = !filters.status || filters.status === 'all' || case_.status === filters.status
      const matchesPriority = !filters.priority || filters.priority === 'all' || case_.priority === filters.priority
      
      let matchesSearch = true
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        matchesSearch = case_.name.toLowerCase().includes(searchTerm) ||
                       case_.document.toLowerCase().includes(searchTerm)
      }
      
      return matchesType && matchesStatus && matchesPriority && matchesSearch
    })
  }

  /**
   * Obtiene estadísticas de casos de aprobación
   */
  static async getApprovalStats(): Promise<{
    total: number
    pending: number
    approved: number
    rejected: number
    kyc: number
    kyb: number
    averageResolutionTime: string
  }> {
    const allCases = await this.getAllApprovalCases()
    
    const pending = allCases.filter(c => c.status === 'pending').length
    const approved = allCases.filter(c => c.status === 'approved').length
    const rejected = allCases.filter(c => c.status === 'rejected').length
    const kyc = allCases.filter(c => c.type === 'person').length
    const kyb = allCases.filter(c => c.type === 'company').length
    
    return {
      total: allCases.length,
      pending,
      approved,
      rejected,
      kyc,
      kyb,
      averageResolutionTime: "2.4h" // Simulado
    }
  }

  /**
   * Aprueba un caso de verificación
   */
  static async approveCase(caseId: string, justification?: string): Promise<boolean> {
    try {
      if (caseId.startsWith('person-')) {
        // Es un caso KYC
        const personaId = parseInt(caseId.replace('person-', ''))
        const success = await PersonasService.updatePersonaEstado(personaId, 'aprobado')
        return success
      } else if (caseId.startsWith('company-')) {
        // Es un caso KYB - actualizar en datos simulados
        const caseIndex = mockCompanyCases.findIndex(c => c.id === caseId)
        if (caseIndex !== -1) {
          mockCompanyCases[caseIndex].status = 'approved'
          mockCompanyCases[caseIndex].justification = justification
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error aprobando caso:', error)
      return false
    }
  }

  /**
   * Rechaza un caso de verificación
   */
  static async rejectCase(caseId: string, justification?: string): Promise<boolean> {
    try {
      if (caseId.startsWith('person-')) {
        // Es un caso KYC
        const personaId = parseInt(caseId.replace('person-', ''))
        const success = await PersonasService.updatePersonaEstado(personaId, 'rechazado')
        return success
      } else if (caseId.startsWith('company-')) {
        // Es un caso KYB - actualizar en datos simulados
        const caseIndex = mockCompanyCases.findIndex(c => c.id === caseId)
        if (caseIndex !== -1) {
          mockCompanyCases[caseIndex].status = 'rejected'
          mockCompanyCases[caseIndex].justification = justification
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error rechazando caso:', error)
      return false
    }
  }

  /**
   * Agrega un comentario a un caso
   */
  static async addComment(caseId: string, comment: Omit<Comment, 'id' | 'date'>): Promise<boolean> {
    try {
      const newComment: Comment = {
        ...comment,
        id: `comment-${Date.now()}`,
        date: new Date().toISOString()
      }

      if (caseId.startsWith('person-')) {
        // Para casos KYC, podríamos almacenar en una base de datos
        console.log('Comentario agregado a caso KYC:', caseId, newComment)
        return true
      } else if (caseId.startsWith('company-')) {
        // Para casos KYB, agregar a datos simulados
        const caseIndex = mockCompanyCases.findIndex(c => c.id === caseId)
        if (caseIndex !== -1) {
          mockCompanyCases[caseIndex].comments.push(newComment)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error agregando comentario:', error)
      return false
    }
  }

  /**
   * Convierte una Persona a ApprovalCase
   */
  private static convertPersonaToApprovalCase(persona: Persona): ApprovalCase {
    const priority = this.determinePriority(persona)
    
    return {
      id: `person-${persona.id}`,
      type: 'person',
      name: persona.nombre,
      document: persona.documento,
      flow: persona.flujo,
      date: persona.fecha,
      status: this.convertEstado(persona.estado),
      priority,
      assignedTo: undefined, // Por ahora no hay asignación
      comments: [], // Por ahora sin comentarios
      description: `Verificación de identidad - ${persona.flujo}`,
      personalInfo: {
        email: persona.email,
        phone: persona.telefono,
        birthDate: persona.datosOCR.fechaNacimiento,
        nationality: persona.datosOCR.nacionalidad,
        address: `${persona.geolocalizacion.ciudad}, ${persona.geolocalizacion.pais}`
      },
      progress: {
        identityVerification: persona.progreso,
        documentVerification: persona.progreso,
        biometricVerification: persona.progreso,
        riskAssessment: persona.progreso,
        complianceCheck: persona.progreso
      },
      riskFactors: [persona.perfilRiesgo.nivelRiesgo],
      complianceIssues: persona.perfilRiesgo.compliance === 'Rechazado' ? ['Compliance rechazado'] : []
    }
  }

  /**
   * Determina la prioridad basada en los datos de la persona
   */
  private static determinePriority(persona: Persona): 'critical' | 'high' | 'normal' {
    if (persona.perfilRiesgo.nivelRiesgo === 'Alto') return 'critical'
    if (persona.perfilRiesgo.nivelRiesgo === 'Medio') return 'high'
    return 'normal'
  }

  /**
   * Convierte el estado de Persona a ApprovalCase
   */
  private static convertEstado(estado: Persona['estado']): 'pending' | 'approved' | 'rejected' {
    switch (estado) {
      case 'aprobado': return 'approved'
      case 'rechazado': return 'rejected'
      default: return 'pending'
    }
  }
} 