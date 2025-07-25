"use client"

import { useState } from "react"
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  UserPlus,
  Filter,
  Search,
  Eye,
  Calendar,
  FileText,
  Users,
  Building,
  Send,
  UserCheck,
  UserX,
  MessageCircle,
  UserCog
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

// Tipos de datos
interface Comment {
  id: string
  author: string
  content: string
  date: string
  type: 'internal' | 'public'
}

interface ApprovalCase {
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
  // Datos adicionales para vista detallada
  personalInfo?: {
    email: string;
    phone: string;
    birthDate: string;
    nationality: string;
    address: string;
  };
  documents?: {
    type: string;
    status: string;
    uploadedAt: string;
  }[];
  progress?: {
    identityVerification: number;
    documentVerification: number;
    biometricVerification?: number;
    uboVerification?: number;
    riskAssessment: number;
    complianceCheck: number;
  };
  riskFactors?: string[];
  complianceIssues?: string[];
  companyInfo?: {
    email: string;
    phone: string;
    address: string;
    constitutionDate: string;
    mainActivity: string;
    companyType: string;
    country: string;
    website: string;
  };
}

// Datos simulados
const mockPersonCases: ApprovalCase[] = [
  {
    id: "person-1",
    type: "person",
    name: "María González Fernández",
    document: "DNI 12.345.678",
    flow: "KYC Básico",
    date: "2023-05-20 09:45",
    status: "pending",
    priority: "critical",
    assignedTo: "Juan Pérez",
    comments: [
      {
        id: "comment-1",
        author: "Juan Pérez",
        content: "Documento principal verificado, pendiente validación biométrica",
        date: "2023-05-20 10:30",
        type: "internal"
      }
    ],
    description: "Verificación de identidad básica con documento nacional",
    // Datos adicionales para vista detallada
    personalInfo: {
      email: "maria.gonzalez@email.com",
      phone: "+54 11 1234-5678",
      birthDate: "15/03/1985",
      nationality: "Argentina",
      address: "Av. Corrientes 1234, CABA"
    },
    documents: [
      { type: "DNI", status: "verified", uploadedAt: "2023-05-20 09:30" },
      { type: "Selfie", status: "pending", uploadedAt: "2023-05-20 09:45" },
      { type: "Comprobante de domicilio", status: "verified", uploadedAt: "2023-05-20 09:35" }
    ],
    progress: {
      identityVerification: 100,
      documentVerification: 100,
      biometricVerification: 0,
      riskAssessment: 75,
      complianceCheck: 50
    },
    riskFactors: ["Nueva cuenta", "Sector financiero"],
    complianceIssues: ["Pendiente verificación biométrica"]
  },
  {
    id: "person-2",
    type: "person",
    name: "Carlos Rodríguez López",
    document: "DNI 87.654.321",
    flow: "KYC Premium",
    date: "2023-05-20 11:15",
    status: "pending",
    priority: "high",
    assignedTo: "Ana Martínez",
    comments: [
      {
        id: "comment-2",
        author: "Ana Martínez",
        content: "Requiere verificación adicional de ingresos",
        date: "2023-05-20 12:00",
        type: "internal"
      }
    ],
    description: "Verificación premium con análisis de riesgo",
    personalInfo: {
      email: "carlos.rodriguez@email.com",
      phone: "+54 11 8765-4321",
      birthDate: "22/07/1978",
      nationality: "Argentina",
      address: "Belgrano 567, CABA"
    },
    documents: [
      { type: "DNI", status: "verified", uploadedAt: "2023-05-20 11:00" },
      { type: "Selfie", status: "verified", uploadedAt: "2023-05-20 11:10" },
      { type: "Comprobante de ingresos", status: "pending", uploadedAt: "2023-05-20 11:15" },
      { type: "Certificado de antecedentes", status: "verified", uploadedAt: "2023-05-20 11:05" }
    ],
    progress: {
      identityVerification: 100,
      documentVerification: 75,
      biometricVerification: 100,
      riskAssessment: 60,
      complianceCheck: 40
    },
    riskFactors: ["Alto volumen de transacciones", "Sector tecnológico"],
    complianceIssues: ["Pendiente comprobante de ingresos"]
  },
  {
    id: "person-3",
    type: "person",
    name: "Ana Martínez Silva",
    document: "DNI 11.223.344",
    flow: "KYC Express",
    date: "2023-05-20 13:30",
    status: "pending",
    priority: "normal",
    comments: [],
    description: "Verificación rápida para usuarios existentes",
    personalInfo: {
      email: "ana.martinez@email.com",
      phone: "+54 11 1122-3344",
      birthDate: "10/12/1990",
      nationality: "Argentina",
      address: "Palermo 890, CABA"
    },
    documents: [
      { type: "DNI", status: "verified", uploadedAt: "2023-05-20 13:20" },
      { type: "Selfie", status: "verified", uploadedAt: "2023-05-20 13:25" }
    ],
    progress: {
      identityVerification: 100,
      documentVerification: 100,
      biometricVerification: 100,
      riskAssessment: 90,
      complianceCheck: 80
    },
    riskFactors: ["Usuario existente"],
    complianceIssues: []
  }
]

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
    name: "Servicios Digitales S.A.S.",
    document: "CUIT 30-34567890-1",
    flow: "KYB Básico",
    date: "2023-05-20 13:45",
    status: "pending",
    priority: "high",
    assignedTo: "Carlos Ruiz",
    comments: [
      {
        id: "comment-4",
        author: "Carlos Ruiz",
        content: "Sector fintech, requiere análisis adicional",
        date: "2023-05-20 15:10",
        type: "internal"
      }
    ],
    description: "Verificación básica para empresas pequeñas",
    companyInfo: {
      email: "info@serviciosdigitales.com",
      phone: "+54 11 3456-7890",
      address: "Microcentro 456, CABA",
      constitutionDate: "20/03/2018",
      mainActivity: "Desarrollo de software",
      companyType: "Sociedad de Responsabilidad Limitada",
      country: "Argentina",
      website: "www.serviciosdigitales.com"
    },
    documents: [
      { type: "Certificado de existencia", status: "verified", uploadedAt: "2023-05-20 13:30" },
      { type: "CUIT", status: "verified", uploadedAt: "2023-05-20 13:25" },
      { type: "Contrato social", status: "verified", uploadedAt: "2023-05-20 13:35" }
    ],
    progress: {
      identityVerification: 100,
      documentVerification: 100,
      uboVerification: 100,
      riskAssessment: 50,
      complianceCheck: 40
    },
    riskFactors: ["Sector fintech", "Nueva empresa"],
    complianceIssues: ["Análisis de riesgo requerido"]
  },
  {
    id: "company-3",
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

// Revisores disponibles
const availableReviewers = [
  "Juan Pérez",
  "Ana Martínez", 
  "María López",
  "Carlos Ruiz",
  "Laura Díaz",
  "Pedro Sánchez"
]

interface ApprovalQueueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'person' | 'company'
}

// Componente para acciones rápidas
function QuickActions({ case_, onAction }: { case_: ApprovalCase; onAction: (action: string, caseId: string) => void }) {
  const [showJustification, setShowJustification] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [justification, setJustification] = useState('')

  const handleAction = (actionType: 'approve' | 'reject') => {
    setAction(actionType)
    setShowJustification(true)
  }

  const confirmAction = () => {
    if (justification.trim()) {
      onAction(action!, case_.id)
      setShowJustification(false)
      setJustification('')
      setAction(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction('view-details', case_.id)}
        className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      >
        <Eye className="h-4 w-4 mr-1" />
        Ver detalles
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction('approve')}
        className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
        disabled={case_.status !== 'pending'}
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Aprobar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction('reject')}
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        disabled={case_.status !== 'pending'}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Rechazar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction('comment', case_.id)}
        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        Comentar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction('assign', case_.id)}
        className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
      >
        <UserCog className="h-4 w-4 mr-1" />
        Asignar
      </Button>

      {/* Modal de justificación */}
      <Dialog open={showJustification} onOpenChange={setShowJustification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Aprobar caso' : 'Rechazar caso'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="justification">Justificación *</Label>
              <Textarea
                id="justification"
                placeholder="Explica el motivo de tu decisión..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJustification(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmAction}
              disabled={!justification.trim()}
              variant={action === 'approve' ? 'default' : 'destructive'}
            >
              {action === 'approve' ? 'Aprobar' : 'Rechazar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente para indicador de prioridad
function PriorityIndicator({ priority }: { priority: string }) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          color: 'bg-red-500',
          icon: AlertTriangle,
          text: 'Crítica',
          description: 'Requiere atención inmediata'
        }
      case 'high':
        return {
          color: 'bg-yellow-500',
          icon: Clock,
          text: 'Alta',
          description: 'Requiere atención pronto'
        }
      case 'normal':
        return {
          color: 'bg-green-500',
          icon: CheckCircle,
          text: 'Normal',
          description: 'Procesamiento estándar'
        }
      default:
        return {
          color: 'bg-gray-500',
          icon: Clock,
          text: 'Normal',
          description: 'Procesamiento estándar'
        }
    }
  }

  const config = getPriorityConfig(priority)
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full", config.color)} />
      <span className="text-xs font-medium">{config.text}</span>
    </div>
  )
}

// Componente para estado visual mejorado
function StatusIndicator({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          icon: Clock,
          text: 'Pendiente'
        }
      case 'approved':
        return {
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          icon: CheckCircle,
          text: 'Aprobado'
        }
      case 'rejected':
        return {
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          icon: XCircle,
          text: 'Rechazado'
        }
      default:
        return {
          color: 'bg-gray-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          icon: Clock,
          text: status
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.bgColor, config.textColor)}>
      <Icon className="h-3 w-3" />
      {config.text}
    </div>
  )
}

export function ApprovalQueueModal({ open, onOpenChange, type }: ApprovalQueueModalProps) {
  const [cases, setCases] = useState<ApprovalCase[]>(
    type === 'person' ? mockPersonCases : mockCompanyCases
  )
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showCommentsView, setShowCommentsView] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [selectedCase, setSelectedCase] = useState<ApprovalCase | null>(null)
  const [newComment, setNewComment] = useState('')
  const [selectedReviewer, setSelectedReviewer] = useState('')

  // Filtrar casos
  const filteredCases = cases.filter(case_ => {
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus
    const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority
    const matchesSearch = case_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.document.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const pendingCases = cases.filter(case_ => case_.status === 'pending')
  const approvedCases = cases.filter(case_ => case_.status === 'approved')
  const rejectedCases = cases.filter(case_ => case_.status === 'rejected')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-yellow-500'
      case 'normal': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'approved': return 'Aprobado'
      case 'rejected': return 'Rechazado'
      default: return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Crítica'
      case 'high': return 'Alta'
      case 'normal': return 'Normal'
      default: return priority
    }
  }

  const handleAction = (action: string, caseId: string) => {
    const caseIndex = cases.findIndex(c => c.id === caseId)
    if (caseIndex === -1) return

    const updatedCases = [...cases]
    const currentCase = updatedCases[caseIndex]

    switch (action) {
      case 'approve':
        currentCase.status = 'approved'
        currentCase.justification = 'Aprobado por el revisor'
        break
      case 'reject':
        currentCase.status = 'rejected'
        currentCase.justification = 'Rechazado por el revisor'
        break
      case 'comment':
        setSelectedCase(currentCase)
        setShowCommentModal(true)
        break
      case 'assign':
        setSelectedCase(currentCase)
        setShowAssignModal(true)
        break
      case 'view-comments':
        setSelectedCase(currentCase)
        setShowCommentsView(true)
        break
      case 'view-details':
        setSelectedCase(currentCase)
        setShowDetailView(true)
        break
    }

    setCases(updatedCases)
  }

  const handleAddComment = () => {
    if (!selectedCase || !newComment.trim()) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Revisor Actual",
      content: newComment,
      date: new Date().toLocaleString('es-ES'),
      type: 'internal'
    }

    const updatedCases = cases.map(c => 
      c.id === selectedCase.id 
        ? { ...c, comments: [...c.comments, comment] }
        : c
    )

    setCases(updatedCases)
    setNewComment('')
    setShowCommentModal(false)
    setSelectedCase(null)
  }

  const handleAssignReviewer = () => {
    if (!selectedCase || !selectedReviewer) return

    const updatedCases = cases.map(c => 
      c.id === selectedCase.id 
        ? { ...c, assignedTo: selectedReviewer }
        : c
    )

    setCases(updatedCases)
    setSelectedReviewer('')
    setShowAssignModal(false)
    setSelectedCase(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col [&>button]:hidden">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <DialogTitle>
                  Cola de aprobación de {type === 'person' ? 'personas' : 'empresas'}
                </DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                Casos de verificación de {type === 'person' ? 'personas' : 'empresas'} que requieren revisión manual
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">{pendingCases.length} pendientes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">{approvedCases.length} aprobados</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-muted-foreground">{rejectedCases.length} rechazados</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Filtros y búsqueda */}
          <div className="flex-shrink-0 flex items-center gap-4 p-4 border-b">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="rejected">Rechazado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de casos */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredCases.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay casos pendientes</h3>
                <p className="text-muted-foreground">
                  No hay casos que requieran revisión manual en este momento. 
                  Los nuevos casos aparecerán aquí cuando estén listos para revisión.
                </p>
              </div>
            ) : (
              filteredCases.map((case_) => (
                <Card key={case_.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <PriorityIndicator priority={case_.priority} />
                          <h4 className="font-medium">{case_.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {case_.document}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {case_.flow}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {case_.date}
                          </div>
                          {case_.assignedTo && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {case_.assignedTo}
                            </div>
                          )}
                        </div>

                        {case_.comments.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <button 
                              onClick={() => handleAction('view-comments', case_.id)}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {case_.comments.length} comentario{case_.comments.length !== 1 ? 's' : ''}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <StatusIndicator status={case_.status} />
                        <QuickActions case_={case_} onAction={handleAction} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Footer con estadísticas */}
          <div className="flex-shrink-0 border-t p-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{pendingCases.length} pendientes</span>
                <span>{approvedCases.length} aprobados</span>
                <span>{rejectedCases.length} rechazados</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de comentarios */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar comentario interno</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comentario</Label>
              <Textarea
                id="comment"
                placeholder="Escribe tu comentario interno..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de asignación */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar revisor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reviewer">Seleccionar revisor</Label>
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Elige un revisor..." />
                </SelectTrigger>
                <SelectContent>
                  {availableReviewers.map((reviewer) => (
                    <SelectItem key={reviewer} value={reviewer}>
                      {reviewer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignReviewer} disabled={!selectedReviewer}>
              <UserCheck className="h-4 w-4 mr-2" />
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de vista de comentarios */}
      <Dialog open={showCommentsView} onOpenChange={setShowCommentsView}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comentarios - {selectedCase?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedCase?.comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay comentarios para este caso
              </p>
            ) : (
              selectedCase?.comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.type === 'internal' ? 'Interno' : 'Público'}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentsView(false)}>
              Cerrar
            </Button>
            <Button onClick={() => {
              setShowCommentsView(false)
              setShowCommentModal(true)
            }}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Agregar comentario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de vista detallada */}
      <Dialog open={showDetailView} onOpenChange={setShowDetailView}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col [&>button]:hidden">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <DialogTitle>Vista detallada - {selectedCase?.name}</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDetailView(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedCase && (
              <>
                {/* Información básica */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PriorityIndicator priority={selectedCase.priority} />
                      Información básica
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                        <p className="font-medium">{selectedCase.name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-muted-foreground">Documento</Label>
                        <p className="font-mono">{selectedCase.document}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-muted-foreground">Flujo</Label>
                        <Badge variant="outline">{selectedCase.flow}</Badge>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-muted-foreground">Fecha de inicio</Label>
                        <p>{selectedCase.date}</p>
                      </div>
                      {selectedCase.assignedTo && (
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Asignado a</Label>
                          <p>{selectedCase.assignedTo}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Información personal/empresarial */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedCase.type === 'person' ? 'Información personal' : 'Información empresarial'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCase.type === 'person' && selectedCase.personalInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <p>{selectedCase.personalInfo.email}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                          <p>{selectedCase.personalInfo.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Fecha de nacimiento</Label>
                          <p>{selectedCase.personalInfo.birthDate}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Nacionalidad</Label>
                          <p>{selectedCase.personalInfo.nationality}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
                          <p>{selectedCase.personalInfo.address}</p>
                        </div>
                      </div>
                    ) : selectedCase.companyInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <p>{selectedCase.companyInfo.email}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                          <p>{selectedCase.companyInfo.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Fecha de constitución</Label>
                          <p>{selectedCase.companyInfo.constitutionDate}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Actividad principal</Label>
                          <p>{selectedCase.companyInfo.mainActivity}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Tipo de empresa</Label>
                          <p>{selectedCase.companyInfo.companyType}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">País</Label>
                          <p>{selectedCase.companyInfo.country}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
                          <p>{selectedCase.companyInfo.address}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Sitio web</Label>
                          <p className="text-blue-600 hover:underline cursor-pointer">{selectedCase.companyInfo.website}</p>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                {/* Progreso del flujo */}
                {selectedCase.progress && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Progreso del flujo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Verificación de identidad</span>
                            <span className="text-sm font-medium">{selectedCase.progress.identityVerification}%</span>
                          </div>
                          <Progress value={selectedCase.progress.identityVerification} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Verificación de documentos</span>
                            <span className="text-sm font-medium">{selectedCase.progress.documentVerification}%</span>
                          </div>
                          <Progress value={selectedCase.progress.documentVerification} className="h-2" />
                          
                          {selectedCase.progress.biometricVerification !== undefined && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Verificación biométrica</span>
                                <span className="text-sm font-medium">{selectedCase.progress.biometricVerification}%</span>
                              </div>
                              <Progress value={selectedCase.progress.biometricVerification} className="h-2" />
                            </>
                          )}
                          
                          {selectedCase.progress.uboVerification !== undefined && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Verificación UBO</span>
                                <span className="text-sm font-medium">{selectedCase.progress.uboVerification}%</span>
                              </div>
                              <Progress value={selectedCase.progress.uboVerification} className="h-2" />
                            </>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Evaluación de riesgo</span>
                            <span className="text-sm font-medium">{selectedCase.progress.riskAssessment}%</span>
                          </div>
                          <Progress value={selectedCase.progress.riskAssessment} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Verificación de cumplimiento</span>
                            <span className="text-sm font-medium">{selectedCase.progress.complianceCheck}%</span>
                          </div>
                          <Progress value={selectedCase.progress.complianceCheck} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Documentos */}
                {selectedCase.documents && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCase.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{doc.type}</p>
                                <p className="text-sm text-muted-foreground">Subido: {doc.uploadedAt}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={doc.status === 'verified' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}
                              className="ml-2"
                            >
                              {doc.status === 'verified' ? 'Verificado' : doc.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Factores de riesgo y problemas de cumplimiento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCase.riskFactors && selectedCase.riskFactors.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-amber-600">Factores de riesgo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedCase.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                              <span className="text-sm">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedCase.complianceIssues && selectedCase.complianceIssues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Problemas de cumplimiento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedCase.complianceIssues.map((issue, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Comentarios */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comentarios ({selectedCase.comments.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCase.comments.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No hay comentarios</p>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {selectedCase.comments.map((comment) => (
                          <div key={comment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-sm leading-relaxed">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Footer con acciones */}
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowDetailView(false)}>
                Cerrar
              </Button>
              {selectedCase?.status === 'pending' && (
                <>
                  <Button 
                    variant="default" 
                    onClick={() => {
                      setShowDetailView(false)
                      handleAction('approve', selectedCase.id)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setShowDetailView(false)
                      handleAction('reject', selectedCase.id)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
