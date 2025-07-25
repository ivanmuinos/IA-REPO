"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ApprovalService, ApprovalCase } from "@/lib/approval-service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Shield, 
  Filter, 
  Search, 
  Download, 
  Users, 
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

// Tipos de datos importados del servicio

// Los datos ahora se cargan desde el servicio ApprovalService

export default function AprobacionesPage() {
  const router = useRouter()
  const [cases, setCases] = useState<ApprovalCase[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const { toast } = useToast()

  // Cargar datos al montar el componente
  useEffect(() => {
    loadApprovalCases()
  }, [])

  const loadApprovalCases = async () => {
    try {
      setLoading(true)
      const allCases = await ApprovalService.getAllApprovalCases()
      setCases(allCases)
    } catch (error) {
      console.error('Error cargando casos de aprobación:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los casos de aprobación.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar casos
  const filteredCases = cases.filter(case_ => {
    const matchesType = filterType === 'all' || case_.type === filterType
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus
    const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority
    const matchesSearch = case_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.document.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesStatus && matchesPriority && matchesSearch
  })

  // Estadísticas
  const pendingCases = cases.filter(case_ => case_.status === 'pending')
  const approvedCases = cases.filter(case_ => case_.status === 'approved')
  const rejectedCases = cases.filter(case_ => case_.status === 'rejected')
  const kycCases = cases.filter(case_ => case_.type === 'person')
  const kybCases = cases.filter(case_ => case_.type === 'company')

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

  const handleAction = async (action: string, caseId: string) => {
    const currentCase = cases.find(c => c.id === caseId)
    if (!currentCase) return

    try {
      switch (action) {
        case 'approve':
          const approveSuccess = await ApprovalService.approveCase(caseId, 'Aprobado por el revisor')
          if (approveSuccess) {
            toast({
              title: "Caso aprobado",
              description: `${currentCase.name} ha sido aprobado exitosamente.`,
            })
            // Recargar datos
            await loadApprovalCases()
          } else {
            toast({
              title: "Error",
              description: "No se pudo aprobar el caso.",
              variant: "destructive",
            })
          }
          break
        case 'reject':
          const rejectSuccess = await ApprovalService.rejectCase(caseId, 'Rechazado por el revisor')
          if (rejectSuccess) {
            toast({
              title: "Caso rechazado",
              description: `${currentCase.name} ha sido rechazado.`,
            })
            // Recargar datos
            await loadApprovalCases()
          } else {
            toast({
              title: "Error",
              description: "No se pudo rechazar el caso.",
              variant: "destructive",
            })
          }
          break
        case 'view-details':
          // Navegar a la página de detalles correspondiente usando Next.js router
          const url = currentCase.type === 'person' 
            ? `/personas/${caseId.replace('person-', '')}`
            : `/juridico/${caseId.replace('company-', '')}`
          router.push(url)
          break
      }
    } catch (error) {
      console.error('Error ejecutando acción:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la acción.",
        variant: "destructive",
      })
    }
  }

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Aprobaciones</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros avanzados
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar datos
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Gestiona todos los casos de verificación KYC y KYB que requieren revisión manual
      </p>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCases.length}</div>
            <p className="text-xs text-muted-foreground">
              {kycCases.filter(c => c.status === 'pending').length} KYC, {kybCases.filter(c => c.status === 'pending').length} KYB
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCases.length}</div>
            <p className="text-xs text-muted-foreground">
              +{approvedCases.length} este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCases.length}</div>
            <p className="text-xs text-muted-foreground">
              {rejectedCases.length} este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              Tiempo promedio de resolución de casos pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="person">KYC (Personas)</SelectItem>
                <SelectItem value="company">KYB (Empresas)</SelectItem>
              </SelectContent>
            </Select>
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
        </CardContent>
      </Card>

      {/* Tabs para diferentes vistas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({filteredCases.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({pendingCases.length})</TabsTrigger>
          <TabsTrigger value="kyc">KYC ({kycCases.length})</TabsTrigger>
          <TabsTrigger value="kyb">KYB ({kybCases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando casos de aprobación...</p>
              </CardContent>
            </Card>
          ) : (
            <ApprovalCasesList cases={filteredCases} onAction={handleAction} />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando casos pendientes...</p>
              </CardContent>
            </Card>
          ) : (
            <ApprovalCasesList cases={filteredCases.filter(c => c.status === 'pending')} onAction={handleAction} />
          )}
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando casos KYC...</p>
              </CardContent>
            </Card>
          ) : (
            <ApprovalCasesList cases={filteredCases.filter(c => c.type === 'person')} onAction={handleAction} />
          )}
        </TabsContent>

        <TabsContent value="kyb" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando casos KYB...</p>
              </CardContent>
            </Card>
          ) : (
            <ApprovalCasesList cases={filteredCases.filter(c => c.type === 'company')} onAction={handleAction} />
          )}
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  )
}

// Componente para mostrar la lista de casos
function ApprovalCasesList({ cases, onAction }: { cases: ApprovalCase[], onAction: (action: string, caseId: string) => void }) {
  if (cases.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay casos que coincidan</h3>
          <p className="text-muted-foreground">
            No se encontraron casos que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {cases.map((case_) => (
        <Card key={case_.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(case_.priority)}`} />
                  <div className="flex items-center gap-2">
                    {case_.type === 'person' ? (
                      <Users className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Building className="h-4 w-4 text-green-600" />
                    )}
                    <h4 className="font-medium">{case_.name}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {case_.document}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {case_.type === 'person' ? 'KYC' : 'KYB'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{case_.flow}</span>
                  <span>•</span>
                  <span>{case_.date}</span>
                  {case_.assignedTo && (
                    <>
                      <span>•</span>
                      <span>Asignado a: {case_.assignedTo}</span>
                    </>
                  )}
                </div>

                {case_.progress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso general</span>
                      <span>{Math.round(
                        (case_.progress.identityVerification + 
                         case_.progress.documentVerification + 
                         (case_.progress.biometricVerification || case_.progress.uboVerification || 0) + 
                         case_.progress.riskAssessment + 
                         case_.progress.complianceCheck) / 5
                      )}%</span>
                    </div>
                    <Progress value={
                      (case_.progress.identityVerification + 
                       case_.progress.documentVerification + 
                       (case_.progress.biometricVerification || case_.progress.uboVerification || 0) + 
                       case_.progress.riskAssessment + 
                       case_.progress.complianceCheck) / 5
                    } className="h-2" />
                  </div>
                )}

                {case_.comments.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>💬 {case_.comments.length} comentario{case_.comments.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 ml-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={case_.status === 'pending' ? 'secondary' : case_.status === 'approved' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {getStatusText(case_.status)}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help">
                        {getPriorityText(case_.priority)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        {case_.priority === 'critical' && "Caso crítico que requiere atención inmediata"}
                        {case_.priority === 'high' && "Caso de alta prioridad que debe resolverse pronto"}
                        {case_.priority === 'normal' && "Caso de prioridad normal"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction('view-details', case_.id)}
                  >
                    Ver detalles
                  </Button>
                  {case_.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAction('approve', case_.id)}
                        className="text-green-600 border-green-200 hover:bg-green-50 transition-colors"
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAction('reject', case_.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Funciones auxiliares
function getPriorityColor(priority: string) {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-yellow-500'
    case 'normal': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'approved': return 'Aprobado'
    case 'rejected': return 'Rechazado'
    default: return status
  }
}

function getPriorityText(priority: string) {
  switch (priority) {
    case 'critical': return 'Crítica'
    case 'high': return 'Alta'
    case 'normal': return 'Normal'
    default: return priority
  }
} 