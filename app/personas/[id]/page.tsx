"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  Shield,
  MapPin,
  AlertCircle,
  XCircle,
  Eye,
  User,
  MessageSquare,
  Send,
  FileX,
  AlertTriangle,
  CheckSquare,
  Save,
  History,
} from "lucide-react"
import dynamic from "next/dynamic"

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
  loading: () => <div className="p-4 text-sm text-muted-foreground">Cargando JSON...</div>
})

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AprobacionModal } from "@/components/aprobacion-modal"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { InfoField, InfoFieldWithBadge } from "@/components/ui/info-field"
import Link from "next/link"

// Importar el nuevo sistema unificado
import { DetailPageTemplate, SectionConfig, SidebarConfig } from "@/components/templates/DetailPageTemplate"
import { ActionConfig, StatusConfig, TabConfig } from "@/components/shared/PageHeader/UnifiedPageHeader"
import { SectionCard } from "@/components/shared/Sections/SectionCard"
import { ActionsCard, type ActionItem } from "@/components/shared/ActionsCard/ActionsCard"
import { InfoField as InfoFieldNew, InfoGrid } from "@/components/shared/InfoField/InfoField"

// Componentes de sección específicos para KYC
const DocumentoIdentidadSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Documento de identidad" description="Resultados del procesamiento OCR" icon={FileText}>
    <div className="space-y-6">
      <InfoGrid>
        <InfoFieldNew label="Nombre" value={data.nombre} />
        <InfoFieldNew label="Apellidos" value={data.apellidos} />
        <InfoFieldNew label="Documento" value={data.documento} />
        <InfoFieldNew label="Tipo de documento" value={data.tipoDocumento} />
        <InfoFieldNew label="Fecha de nacimiento" value={data.fechaNacimiento} type="date" />
        <InfoFieldNew label="Nacionalidad" value={data.nacionalidad} />
      </InfoGrid>
    </div>
  </SectionCard>
)

const PerfilRiesgoSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Perfil de riesgo" description="Evaluación de riesgo y compliance" icon={Shield}>
    <div className="space-y-6">
      <InfoGrid>
        <InfoFieldNew label="Nivel de riesgo" value={data.nivelRiesgo} />
        <InfoFieldNew label="Compliance" value={data.compliance} />
        <InfoFieldNew label="Perfil transaccional" value={data.perfilTransaccional} />
        <InfoFieldNew label="Monto mensual" value={`AR$${data.monto}`} />
      </InfoGrid>
    </div>
  </SectionCard>
)

const ValidacionBiometricaSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Validación biométrica" description="Resultados de verificación facial" icon={UserCheck}>
    <div className="space-y-6">
      <InfoGrid>
        <InfoFieldNew label="Resultado" value={data.resultado} />
        <InfoFieldNew label="Confianza" value={`${data.confianza}%`} />
      </InfoGrid>
      <InfoFieldNew label="Observaciones" value={data.observaciones} type="textarea" />
    </div>
  </SectionCard>
)

const CronologiaSection: React.FC<{ events: any[] }> = ({ events }) => {
  // Datos de ejemplo si no hay eventos
  const defaultEvents = [
    {
      title: "Inicio del proceso",
      description: "Usuario inició el proceso de verificación",
      timestamp: "10:15:00"
    },
    {
      title: "Documento subido",
      description: "Documento de identidad cargado exitosamente",
      timestamp: "10:15:45"
    },
    {
      title: "Verificación OCR",
      description: "Procesamiento automático del documento completado",
      timestamp: "10:16:15"
    },
    {
      title: "Validación biométrica",
      description: "Verificación facial realizada",
      timestamp: "10:17:30"
    },
    {
      title: "Análisis de riesgo",
      description: "Evaluación de perfil de riesgo completada",
      timestamp: "10:18:00"
    }
  ]

  const displayEvents = events && events.length > 0 ? events : defaultEvents

  return (
    <SectionCard title="Cronología del flujo" description="Historial de eventos del proceso" icon={History}>
      <div className="space-y-4">
        {displayEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
            <Badge variant="outline">{event.timestamp}</Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

const GestionAnalistaSection: React.FC<{ 
  data: any, 
  onAddComment: () => void,
  onSendFeedback: () => void,
  onRequestDocuments: () => void,
  onUpdateRiskAssessment: () => void,
  onFinalApproval: () => void,
  onSaveAndContinue: () => void
}> = ({ 
  data, 
  onAddComment, 
  onSendFeedback, 
  onRequestDocuments, 
  onUpdateRiskAssessment, 
  onFinalApproval, 
  onSaveAndContinue 
}) => (
  <SectionCard title="Gestión de analista" description="Herramientas de gestión y análisis" icon={User}>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Analista asignado</Label>
            <Select value={data.selectedAnalyst} onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sin asignar">Sin asignar</SelectItem>
                <SelectItem value="Ana García">Ana García</SelectItem>
                <SelectItem value="Carlos López">Carlos López</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Nivel de riesgo</Label>
            <Select value={data.riskLevel} onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bajo">Bajo</SelectItem>
                <SelectItem value="Medio">Medio</SelectItem>
                <SelectItem value="Alto">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="urgent" checked={data.isUrgent} onCheckedChange={() => {}} />
            <Label htmlFor="urgent">Marcar como urgente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="email" checked={data.sendByEmail} onCheckedChange={() => {}} />
            <Label htmlFor="email">Enviar por email</Label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={onAddComment} className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Agregar comentario
        </Button>
        <Button onClick={onSendFeedback} variant="outline" className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Enviar feedback
        </Button>
        <Button onClick={onRequestDocuments} variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Solicitar documentos
        </Button>
        <Button onClick={onUpdateRiskAssessment} variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Actualizar evaluación
        </Button>
      </div>
      

    </div>
  </SectionCard>
)

const HistorialActividadSection: React.FC<{ data: any }> = ({ data }) => {
  // Datos de ejemplo si no hay actividades
  const defaultActividades = [
    {
      titulo: "Verificación iniciada",
      descripcion: "El usuario comenzó el proceso de verificación de identidad",
      fecha: "15/05/2023 10:15:00"
    },
    {
      titulo: "Documento cargado",
      descripcion: "Documento de identidad subido exitosamente",
      fecha: "15/05/2023 10:15:45"
    },
    {
      titulo: "Verificación OCR completada",
      descripcion: "Procesamiento automático del documento finalizado",
      fecha: "15/05/2023 10:16:15"
    },
    {
      titulo: "Validación biométrica exitosa",
      descripcion: "Verificación facial aprobada con 98% de confianza",
      fecha: "15/05/2023 10:17:30"
    }
  ]

  const displayActividades = data.actividades && data.actividades.length > 0 ? data.actividades : defaultActividades

  return (
    <SectionCard title="Historial de actividad" description="Registro completo de actividades" icon={History}>
      <div className="space-y-4">
        {displayActividades.map((actividad: any, index: number) => (
          <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            </div>
            <div className="flex-1">
              <p className="font-medium">{actividad.titulo}</p>
              <p className="text-sm text-muted-foreground">{actividad.descripcion}</p>
              <p className="text-xs text-muted-foreground mt-1">{actividad.fecha}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default function PersonaDetallePage() {
  const params = useParams()
  const personaId = Number(params.id)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("detalles")
  const [aprobacionModalOpen, setAprobacionModalOpen] = useState(false)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [selectedStepData, setSelectedStepData] = useState<any>(null)
  const [selectedStepName, setSelectedStepName] = useState<string>("")
  const { toast } = useToast()

  // Analyst management state
  const [analystNotes, setAnalystNotes] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isInternalComment, setIsInternalComment] = useState(false)
  const [clientFeedback, setClientFeedback] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [sendByEmail, setSendByEmail] = useState(false)
  const [selectedAnalyst, setSelectedAnalyst] = useState("Sin asignar")
  const [riskLevel, setRiskLevel] = useState("Bajo")
  const [riskObservations, setRiskObservations] = useState("")
  const [documentObservations, setDocumentObservations] = useState("")

  // Preservar toda la lógica de negocio existente
  const loadPersona = async () => {
    setLoading(true)
    try {
      const data = await PersonasService.getPersonaById(personaId)
      if (data) {
        setPersona(data)
      } else {
        setError("Persona no encontrada")
      }
    } catch (err) {
      setError("Error al cargar los datos de la persona")
      console.error("Error loading persona:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!persona) return
    try {
      await PersonasService.updatePersonaEstado(personaId, "aprobado")
      toast({
        title: "Verificación aprobada",
        description: "La verificación ha sido aprobada exitosamente.",
      })
      loadPersona()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la verificación.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!persona) return
    try {
      await PersonasService.updatePersonaEstado(personaId, "rechazado")
      toast({
        title: "Verificación rechazada",
        description: "La verificación ha sido rechazada.",
      })
      loadPersona()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la verificación.",
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    if (!persona) return
    try {
      const dataStr = JSON.stringify(persona, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `persona-${persona.id}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Datos exportados",
        description: "Los datos han sido exportados exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos.",
        variant: "destructive",
      })
    }
  }

  // Funciones de gestión de analista
  const handleAddComment = () => {
    toast({
      title: "Comentario agregado",
      description: "El comentario ha sido agregado exitosamente.",
    })
  }

  const handleSendFeedback = () => {
    toast({
      title: "Feedback enviado",
      description: "El feedback ha sido enviado al cliente.",
    })
  }

  const handleRequestDocuments = () => {
    toast({
      title: "Solicitud enviada",
      description: "La solicitud de documentos ha sido enviada.",
    })
  }

  const handleUpdateRiskAssessment = () => {
    toast({
      title: "Evaluación actualizada",
      description: "La evaluación de riesgo ha sido actualizada.",
    })
  }

  const handleFinalApproval = () => {
    setAprobacionModalOpen(true)
  }

  const handleSaveAndContinue = () => {
    toast({
      title: "Guardado",
      description: "Los cambios han sido guardados.",
    })
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadPersona()
  }, [personaId])

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return CheckCircle
      case "en-progreso":
        return Clock
      case "revision":
        return Eye
      case "rechazado":
        return XCircle
      default:
        return Clock
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "completado":
        return "Completado"
      case "en-progreso":
        return "En progreso"
      case "revision":
        return "En revisión"
      case "rechazado":
        return "Rechazado"
      default:
        return "Pendiente"
    }
  }

  const getStatusVariant = (estado: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (estado) {
      case "completado":
        return "default"
      case "en-progreso":
        return "secondary"
      case "revision":
        return "outline"
      case "rechazado":
        return "destructive"
      default:
        return "outline"
    }
  }

  const shouldShowAnalystTab = (estado: string) => {
    return estado === "revision" || estado === "en-progreso"
  }

  useEffect(() => {
    loadPersona()
  }, [personaId])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !persona) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "No se pudo cargar la información de la persona"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Configuración del nuevo sistema unificado
  const status: StatusConfig = {
    value: getStatusText(persona.estado),
    label: "Estado",
    variant: getStatusVariant(persona.estado),
    icon: getStatusIcon(persona.estado)
  }

  // Acciones movidas al sidebar - header solo muestra información
  const primaryActions: ActionConfig[] = []

  const tabs: TabConfig[] = [
    { id: "detalles", label: "Detalles de onboarding" },
    { id: "cronologia", label: "Cronología del flujo" },
    ...(shouldShowAnalystTab(persona.estado) ? [{ id: "gestion", label: "Gestión de analista" }] : []),
    { id: "historial", label: "Historial de actividad" }
  ]

  const sections: SectionConfig[] = [
    {
      id: "detalles-documento",
      title: "Documento de identidad",
      component: DocumentoIdentidadSection,
      props: { data: persona.datosOCR }
    },
    {
      id: "detalles-riesgo",
      title: "Perfil de riesgo",
      component: PerfilRiesgoSection,
      props: { 
        data: {
          nivelRiesgo: persona.perfilRiesgo.nivelRiesgo,
          compliance: persona.perfilRiesgo.compliance,
          perfilTransaccional: persona.perfilRiesgo.perfilTransaccional,
          monto: "5.000.000"
        }
      }
    },
    {
      id: "detalles-biometrica",
      title: "Validación biométrica",
      component: ValidacionBiometricaSection,
      props: { 
        data: {
          resultado: persona.resultados?.biometria?.resultado || "Válido",
          confianza: persona.resultados?.biometria?.confianza || 98,
          observaciones: "Documento en excelente estado, todos los campos legibles"
        }
      }
    },
    {
      id: "cronologia",
      title: "Cronología",
      component: CronologiaSection,
      props: { events: [] } // Forzar uso de eventos por defecto
    },
    ...(shouldShowAnalystTab(persona.estado) ? [{
      id: "gestion-analista",
      title: "Gestión de analista",
      component: GestionAnalistaSection,
      props: { 
        data: {
          selectedAnalyst,
          riskLevel,
          isUrgent,
          sendByEmail
        },
        onAddComment: handleAddComment,
        onSendFeedback: handleSendFeedback,
        onRequestDocuments: handleRequestDocuments,
        onUpdateRiskAssessment: handleUpdateRiskAssessment,
        onFinalApproval: handleFinalApproval,
        onSaveAndContinue: handleSaveAndContinue
      }
    }] : []),
    {
      id: "historial",
      title: "Historial de actividad",
      component: HistorialActividadSection,
      props: { data: { actividades: [] } } // Forzar uso de actividades por defecto
    }
  ]

  // Configuración de acciones para el sidebar
  const sidebarActions: ActionItem[] = [
    {
      label: "Aprobar verificación",
      variant: "default",
      icon: ThumbsUp,
      onClick: handleApprove
    },
    {
      label: "Rechazar verificación",
      variant: "destructive",
      icon: ThumbsDown,
      onClick: handleReject
    },
    {
      label: "Exportar datos JSON",
      variant: "outline",
      icon: Download,
      onClick: handleExport
    }
  ]

  const sidebarConfig: SidebarConfig = {
    quickActions: {
      title: "Acciones disponibles",
      actions: sidebarActions
    },
    summary: {
      title: "Información general",
      data: [
        { label: "Progreso", value: persona.progreso, type: "progress" },
        { label: "Estado actual", value: getStatusText(persona.estado), type: "badge", variant: getStatusVariant(persona.estado) },
        { label: "Flujo", value: persona.flujo, type: "badge", variant: "outline" },
        { label: "Documento", value: persona.documento, type: "text" },
        { label: "Email", value: persona.email, type: "email" },
        { label: "Teléfono", value: persona.telefono, type: "tel" },
        { label: "Fecha de inicio", value: persona.fecha, type: "text" }
      ]
    }
  }

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos de la persona...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si hay alguno
  if (error || !persona) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Error al cargar los datos</h2>
          <p className="text-muted-foreground mb-4">
            {error || "No se pudo cargar la información de la persona"}
          </p>
          <Button onClick={loadPersona} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <DetailPageTemplate
        title={persona.nombre}
        subtitle="Detalles del proceso de onboarding"
        status={status}
        primaryActions={primaryActions}
        tabs={tabs}
        sections={sections}
        sidebarConfig={sidebarConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Mantener modales existentes */}
      <AprobacionModal
        open={aprobacionModalOpen}
        onOpenChange={setAprobacionModalOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        personaName={persona.nombre}
      />

      {/* JSON Modal */}
      <Dialog open={jsonModalOpen} onOpenChange={setJsonModalOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Datos del paso - {selectedStepName}
            </DialogTitle>
            <DialogDescription>
              Información detallada de entrada y salida durante este paso del proceso
            </DialogDescription>
          </DialogHeader>
          {selectedStepData && (
            <div className="overflow-hidden flex-1">
              <div className="bg-muted/50 border rounded-lg overflow-hidden text-xs">
                <div className="p-4 max-h-96 overflow-y-auto">
                  <ReactJson
                    src={selectedStepData}
                    name={false}
                    collapsed={2}
                    enableClipboard={true}
                    displayDataTypes={false}
                    theme="rjv-default"
                    style={{
                      backgroundColor: "transparent",
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
