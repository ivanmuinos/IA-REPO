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
import ReactJson from "react-json-view"

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

export default function PersonaDetallePage() {
  const params = useParams()
  const personaId = Number(params.id)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aprobacionModalOpen, setAprobacionModalOpen] = useState(false)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [selectedStepData, setSelectedStepData] = useState<any>(null)
  const [selectedStepName, setSelectedStepName] = useState<string>("")
  const { toast } = useToast()

  const [editingProfile, setEditingProfile] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState("Estándar")
  const [transactionAmount, setTransactionAmount] = useState(5000000)

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
  const [copied, setCopied] = useState(false)

  // Risk factors state
  const [riskFactors, setRiskFactors] = useState({
    highValueTransactions: false,
    foreignCountry: false,
    politicallyExposed: false,
    suspiciousActivity: false,
    incompleteDocumentation: false,
    inconsistentInformation: false,
  })

  // Required documents state
  const [requiredDocuments, setRequiredDocuments] = useState({
    identityDocument: false,
    proofOfAddress: false,
    incomeProof: false,
    bankStatement: false,
    additionalDocuments: false,
  })

  // Compliance checklist state
  const [complianceChecklist, setComplianceChecklist] = useState({
    identityVerified: true,
    addressVerified: true,
    biometricVerified: true,
    riskAssessment: true,
    sanctionsCheck: false,
    pepCheck: false,
    adverseMediaCheck: false,
    finalApproval: false,
  })

  const profileAmounts = {
    Estándar: 5000000,
    Premium: 15000000,
    VIP: 50000000,
    Corporativo: 100000000,
  }

  // Function to format numbers with dots as thousands separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Check if analyst management tab should be shown
  const shouldShowAnalystTab = (estado: string) => {
    return ["revision", "en-progreso", "completado", "aprobado"].includes(estado)
  }

  useEffect(() => {
    loadPersona()
  }, [personaId])

  useEffect(() => {
    if (persona) {
      setSelectedProfile(persona.perfilRiesgo.perfilTransaccional)
      setTransactionAmount(
        profileAmounts[persona.perfilRiesgo.perfilTransaccional as keyof typeof profileAmounts] || 5000000,
      )

      // Initialize analyst management data based on persona state
      setRiskLevel(persona.perfilRiesgo.nivelRiesgo)
      setAnalystNotes("Revisión inicial completada. Documentación en orden.")
    }
  }, [persona])

  const loadPersona = async () => {
    try {
      setLoading(true)
      setError(null)

      if (isNaN(personaId)) {
        setError("ID de persona inválido")
        return
      }

      const data = await PersonasService.getPersonaById(personaId)

      if (!data) {
        setError("Persona no encontrada")
        return
      }

      // Verify that the loaded data matches the requested ID
      if (data.id !== personaId) {
        setError(`Error de integridad: Se solicitó persona ID ${personaId} pero se recibió ID ${data.id}`)
        toast({
          title: "Error de integridad de datos",
          description: "Los datos no coinciden con la selección. Por favor, intente nuevamente.",
          variant: "destructive",
        })
        return
      }

      setPersona(data)

      // Log successful load for debugging
      // console.log(`Successfully loaded persona: ID ${data.id}, Name: ${data.nombre}`)
    } catch (error) {
      console.error("Error loading persona:", error)
      setError("Error al cargar los datos de la persona")
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la persona",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!persona) return

    try {
      const success = await PersonasService.updatePersonaEstado(persona.id, "completado")
      if (success) {
        setPersona({ ...persona, estado: "completado", progreso: 100 })
        toast({
          title: "Persona aprobada",
          description: "La verificación de identidad ha sido aprobada exitosamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la persona",
        variant: "destructive",
      })
    }
    setAprobacionModalOpen(false)
  }

  const handleReject = async () => {
    if (!persona) return

    try {
      const success = await PersonasService.updatePersonaEstado(persona.id, "rechazado")
      if (success) {
        setPersona({ ...persona, estado: "rechazado" })
        toast({
          title: "Persona rechazada",
          description: "La verificación de identidad ha sido rechazada",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la persona",
        variant: "destructive",
      })
    }
    setAprobacionModalOpen(false)
  }

  const handleExport = async () => {
    if (!persona) return

    try {
      const jsonData = await PersonasService.exportPersonaData(persona.id)
      const blob = new Blob([jsonData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `persona-${persona.id}-${persona.nombre.replace(/\s+/g, "-").toLowerCase()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Exportación completada",
        description: "Los datos se han exportado correctamente en formato JSON",
      })
    } catch (error) {
      toast({
        title: "Error en la exportación",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      })
    }
  }

  const updateTransactionProfile = async () => {
    if (!persona) return

    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just update the local state
      setPersona({
        ...persona,
        perfilRiesgo: {
          ...persona.perfilRiesgo,
          perfilTransaccional: selectedProfile,
        },
      })

      setEditingProfile(false)
      toast({
        title: "Perfil actualizado",
        description: `Perfil transaccional cambiado a ${selectedProfile} con monto AR$${formatNumber(transactionAmount)}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil transaccional",
        variant: "destructive",
      })
    }
  }

  // Analyst management functions
  const handleAddComment = () => {
    if (!newComment.trim()) return

    toast({
      title: "Comentario agregado",
      description: isInternalComment ? "Comentario interno guardado" : "Comentario agregado al historial",
    })
    setNewComment("")
    setIsInternalComment(false)
  }

  const handleSendFeedback = () => {
    if (!clientFeedback.trim()) return

    toast({
      title: "Retroalimentación enviada",
      description: sendByEmail ? "Enviado por email al cliente" : "Retroalimentación registrada",
    })
    setClientFeedback("")
    setIsUrgent(false)
    setSendByEmail(false)
  }

  const handleRequestDocuments = () => {
    const selectedDocs = Object.entries(requiredDocuments)
      .filter(([_, selected]) => selected)
      .map(([doc, _]) => doc)

    if (selectedDocs.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un documento para solicitar",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Documentos solicitados",
      description: `Se han solicitado ${selectedDocs.length} documentos al cliente`,
    })
  }

  const handleUpdateRiskAssessment = () => {
    toast({
      title: "Evaluación actualizada",
      description: `Nivel de riesgo actualizado a: ${riskLevel}`,
    })
  }

  const handleFinalApproval = () => {
    setAprobacionModalOpen(true)
  }

  const handleSaveAndContinue = () => {
    toast({
      title: "Progreso guardado",
      description: "Los cambios han sido guardados. Puedes continuar más tarde.",
    })
  }

  // Function to get status icon
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "en-progreso":
        return <Clock className="h-4 w-4 text-amber-600" />
      case "revision":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "abandonado":
      case "rechazado":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "aprobado":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  // Function to get status text
  const getStatusText = (estado: string) => {
    switch (estado) {
      case "completado":
        return "Completado"
      case "en-progreso":
        return "En progreso"
      case "revision":
        return "Revisión manual"
      case "abandonado":
        return "Abandonado"
      case "rechazado":
        return "Rechazado"
      case "aprobado":
        return "Aprobado"
      default:
        return estado
    }
  }

  // Function to get status variant
  const getStatusVariant = (estado: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (estado) {
      case "completado":
        return "default"
      case "en-progreso":
        return "secondary"
      case "revision":
        return "outline"
      case "abandonado":
      case "rechazado":
        return "destructive"
      case "aprobado":
        return "default"
      default:
        return "secondary"
    }
  }

  // Function to get step data for JSON modal with input/output
  const getStepData = (stepId: string) => {
    if (!persona) return null

    switch (stepId) {
      case "inicio":
        return {
          timestamp: "14:32:00",
          duracion: "8s",
          estado: "completado",
          input: {
            flujoId: persona.flujo,
            usuarioId: persona.id,
            dispositivo: persona.dispositivoInfo,
            geolocalizacion: persona.geolocalizacion,
            timestamp: persona.fecha,
          },
          output: {
            sesionId: `session_${persona.id}_${Date.now()}`,
            estado: "iniciado",
            siguientePaso: "ocr",
            configuracion: {
              tiempoLimite: 300,
              reintentos: 3,
            },
          },
        }
      case "ocr":
        return {
          timestamp: "14:32:42",
          duracion: "42s",
          estado: "completado",
          input: {
            imagenes: {
              anverso: "documento_anverso.jpg",
              reverso: "documento_reverso.jpg",
            },
            configuracion: {
              idioma: "es",
              tipoDocumento: "dni",
              validacionestrict: true,
            },
          },
          output: {
            documento: persona.datosOCR,
            resultado: persona.resultados.ocr,
            confianza: persona.resultados.ocr.confianza,
            camposExtraidos: {
              nombre: persona.datosOCR.nombre,
              apellidos: persona.datosOCR.apellidos,
              documento: persona.datosOCR.documento,
              fechaNacimiento: persona.datosOCR.fechaNacimiento,
              nacionalidad: persona.datosOCR.nacionalidad,
            },
          },
        }
      case "biometria":
        return {
          timestamp: "14:33:10",
          duracion: "28s",
          estado: "completado",
          input: {
            imagenes: {
              selfie: "selfie_usuario.jpg",
              documentoFoto: "foto_documento.jpg",
            },
            configuracion: {
              umbralSimilitud: 0.8,
              detectarDeepfake: true,
              validarLiveness: true,
            },
          },
          output: {
            resultado: persona.resultados.biometria,
            similitud: persona.resultados.biometria.confianza,
            hashBiometrico: persona.hashBiometrico,
            validaciones: {
              liveness: true,
              deepfakeDetection: !persona.blacklistBiometrico,
              calidadImagen: "alta",
            },
            blacklist: persona.blacklistBiometrico || false,
          },
        }
      case "fin":
        return {
          timestamp: "14:33:15",
          duracion: "5s",
          estado: "completado",
          input: {
            resultadosAnteriores: {
              ocr: persona.resultados.ocr.resultado,
              biometria: persona.resultados.biometria.resultado,
            },
            configuracion: {
              aprobarAutomatico: false,
              requiereRevision: true,
            },
          },
          output: {
            estadoFinal: persona.estado,
            progreso: persona.progreso,
            perfilRiesgo: persona.perfilRiesgo,
            motivoRechazo: persona.motivoRechazo || null,
            siguientesAcciones: ["revision_manual", "asignacion_analista"],
          },
        }
      default:
        return null
    }
  }

  // JSON formatting component
  const JsonViewer = ({ data, title }: { data: any; title: string }) => {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="bg-muted/50 border rounded-lg overflow-hidden text-xs">
          <div className="p-4 max-h-96 overflow-y-auto">
            <ReactJson
              src={data}
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
    )
  }

  const handleViewJson = (stepId: string, stepName: string) => {
    const stepData = getStepData(stepId)
    if (stepData) {
      setSelectedStepData(stepData)
      setSelectedStepName(stepName)
      setJsonModalOpen(true)
    }
  }

  // Calculate compliance progress
  const completedChecks = Object.values(complianceChecklist).filter(Boolean).length
  const totalChecks = Object.keys(complianceChecklist).length
  const complianceProgress = Math.round((completedChecks / totalChecks) * 100)

  if (loading) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  if (error || !persona) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/personas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a personas
            </Link>
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "No se pudo cargar la información de la persona"}</AlertDescription>
        </Alert>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Persona no encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              La persona que buscas no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link href="/personas">Volver a la lista</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{persona.nombre}</h2>
          <p className="text-muted-foreground">
            Detalles del proceso de onboarding
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(persona.estado)}
          <Badge variant={getStatusVariant(persona.estado)} className="font-medium">
            {getStatusText(persona.estado)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main panel - content */}
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="detalles" className="w-full">
            <TabsList
              className={`grid w-full ${shouldShowAnalystTab(persona.estado) ? "grid-cols-4" : "grid-cols-3"} mb-6`}
            >
              <TabsTrigger value="detalles">Detalles de onboarding</TabsTrigger>
              <TabsTrigger value="cronologia">Cronología del flujo</TabsTrigger>
              {shouldShowAnalystTab(persona.estado) && <TabsTrigger value="gestion">Gestión de analista</TabsTrigger>}
              <TabsTrigger value="historial">Historial de actividad</TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="space-y-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documento de identidad
                  </CardTitle>
                  <CardDescription>Resultados del procesamiento OCR</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoField
                          label="Nombre"
                          value={persona.datosOCR.nombre}
                        />
                        <InfoField
                          label="Apellidos"
                          value={persona.datosOCR.apellidos}
                        />
                        <InfoField
                          label="Documento"
                          value={persona.datosOCR.documento}
                          className="font-mono"
                        />
                        <InfoFieldWithBadge
                          label="Tipo de documento"
                          value={persona.datosOCR.tipoDocumento}
                          badgeText={persona.datosOCR.tipoDocumento}
                        />
                        <InfoField
                          label="Fecha de nacimiento"
                          value={persona.datosOCR.fechaNacimiento}
                          type="date"
                        />
                        <InfoField
                          label="Nacionalidad"
                          value={persona.datosOCR.nacionalidad}
                        />
                        <InfoField
                          label="País"
                          value={persona.geolocalizacion.pais}
                        />
                        <InfoField
                          label="Ciudad"
                          value={persona.geolocalizacion.ciudad}
                        />
                        <InfoField
                          label="Dispositivo"
                          value={`${persona.dispositivoInfo.tipo} - ${persona.dispositivoInfo.modelo}`}
                        />
                        <InfoField
                          label="Sistema Operativo"
                          value={persona.dispositivoInfo.sistemaOperativo}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <p className="font-semibold">Resultado OCR</p>
                        </div>
                        <div className="pl-6 space-y-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Resultado:</p>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {persona.resultados.ocr.resultado}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Confianza:</p>
                            <p className="text-sm font-semibold">{persona.resultados.ocr.confianza}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Observaciones:</p>
                            <p className="text-sm mt-1">{persona.resultados.ocr.observaciones}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <p className="font-semibold">Perfil de riesgo</p>
                        </div>
                        <div className="pl-6 space-y-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Nivel de riesgo:</p>
                            <Badge
                              variant={
                                persona.perfilRiesgo.nivelRiesgo === "Alto"
                                  ? "destructive"
                                  : persona.perfilRiesgo.nivelRiesgo === "Medio"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {persona.perfilRiesgo.nivelRiesgo}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Compliance:</p>
                            <Badge variant={persona.perfilRiesgo.compliance === "Aprobado" ? "default" : "destructive"}>
                              {persona.perfilRiesgo.compliance}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Perfil transaccional:</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1">
                                {editingProfile ? (
                                  <div className="space-y-4 bg-muted p-4 rounded-lg border animate-in fade-in duration-200">
                                    <div className="space-y-2">
                                      <label htmlFor="profile-select" className="text-sm font-medium">
                                        Seleccionar perfil
                                      </label>
                                      <Select
                                        value={selectedProfile}
                                        onValueChange={(value) => {
                                          setSelectedProfile(value)
                                          const newAmount =
                                            profileAmounts[value as keyof typeof profileAmounts] ||
                                            profileAmounts["Estándar"]
                                          setTransactionAmount(newAmount)
                                        }}
                                      >
                                        <SelectTrigger className="w-full" id="profile-select">
                                          <SelectValue placeholder="Seleccionar perfil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Estándar">Estándar</SelectItem>
                                          <SelectItem value="Premium">Premium</SelectItem>
                                          <SelectItem value="VIP">VIP</SelectItem>
                                          <SelectItem value="Corporativo">Corporativo</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <label htmlFor="amount-input" className="text-sm font-medium">
                                        Monto mensual (AR$)
                                      </label>
                                      <div className="flex items-center">
                                        <span className="text-sm mr-2 font-medium">AR$</span>
                                        <input
                                          id="amount-input"
                                          type="text"
                                          value={formatNumber(transactionAmount)}
                                          onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\./g, "")
                                            const numValue = Number.parseInt(rawValue) || 0
                                            setTransactionAmount(numValue)
                                          }}
                                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                      <Button size="sm" onClick={updateTransactionProfile}>
                                        Guardar cambios
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedProfile(persona.perfilRiesgo.perfilTransaccional)
                                          setTransactionAmount(
                                            profileAmounts[
                                              persona.perfilRiesgo.perfilTransaccional as keyof typeof profileAmounts
                                            ] || 5000000,
                                          )
                                          setEditingProfile(false)
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="animate-in fade-in duration-200">
                                    <p className="text-sm font-semibold">{selectedProfile}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Monto: AR${formatNumber(transactionAmount)} mensual
                                    </p>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProfile(!editingProfile)}
                                className={editingProfile ? "hidden" : ""}
                              >
                                Editar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <p className="font-semibold">Información de ubicación y dispositivo</p>
                        </div>
                        <div className="pl-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <InfoField
                              label="Coordenadas"
                              value={persona.geolocalizacion.coordenadas}
                              className="font-mono"
                            />
                            <InfoField
                              label="Dirección IP"
                              value={persona.geolocalizacion.direccionIP}
                              className="font-mono"
                            />
                            <InfoField
                              label="Proveedor ISP"
                              value={persona.geolocalizacion.proveedor}
                            />
                            <InfoField
                              label="Navegador"
                              value={persona.dispositivoInfo.navegador}
                            />
                            <InfoField
                              label="Resolución"
                              value={persona.dispositivoInfo.resolucion}
                              className="font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">User Agent</p>
                            <p className="text-xs text-muted-foreground break-all bg-muted/50 p-2 rounded">
                              {persona.dispositivoInfo.userAgent}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-muted p-3 text-sm font-medium">Anverso del documento</div>
                        <div className="p-6 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50">
                          <div className="relative h-48 w-full flex items-center justify-center">
                            <div className="text-center">
                              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Imagen del documento</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-muted p-3 text-sm font-medium">Reverso del documento</div>
                        <div className="p-6 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50">
                          <div className="relative h-48 w-full flex items-center justify-center">
                            <div className="text-center">
                              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Imagen del documento</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Validación biométrica
                  </CardTitle>
                  <CardDescription>Resultados de la comparación facial</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <p className="font-semibold">Resultado biometría</p>
                        </div>
                        <div className="pl-6 space-y-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Resultado:</p>
                            <Badge
                              variant={
                                persona.resultados.biometria.resultado === "Válido"
                                  ? "default"
                                  : persona.resultados.biometria.resultado === "Rechazado"
                                    ? "destructive"
                                    : "outline"
                              }
                              className={
                                persona.resultados.biometria.resultado === "En revisión" ||
                                persona.resultados.biometria.resultado === "Revisión manual"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : ""
                              }
                            >
                              {persona.resultados.biometria.resultado}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Similitud:</p>
                            <p className="text-sm font-semibold">{persona.resultados.biometria.confianza}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Observaciones:</p>
                            <p className="text-sm mt-1">{persona.resultados.biometria.observaciones}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <p className="font-semibold">Hash biométrico</p>
                        </div>
                        <div className="pl-6 space-y-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Hash:</p>
                            <p className="text-sm font-mono text-muted-foreground">
                              {persona.hashBiometrico || "No disponible"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Descripción:</p>
                            <p className="text-sm mt-1 text-muted-foreground">
                              Identificador único generado a partir de los datos biométricos del usuario para
                              verificación y control de duplicados.
                            </p>
                          </div>
                        </div>
                      </div>

                      {(persona.resultados.biometria.resultado === "En revisión" ||
                        persona.resultados.biometria.resultado === "Revisión manual") && (
                        <div className="pt-4 border-t">
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Motivo de revisión manual:</strong> La similitud entre la foto del documento y la
                              selfie está por debajo del umbral mínimo requerido (80%). Se requiere revisión manual para
                              confirmar que se trata de la misma persona.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}

                      {persona.blacklistBiometrico && (
                        <div className="pt-3 border-t">
                          <Badge variant="destructive" className="mb-2">
                            Blacklist biométrico
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Esta persona fue rechazada por no superar la validación biométrica (posible deepfake). Su
                            hash biométrico ha sido registrado en la lista de bloqueo.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-muted p-3 text-sm font-medium">Foto del documento</div>
                        <div className="p-6 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50">
                          <div className="relative h-48 w-full flex items-center justify-center">
                            <div className="text-center">
                              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Foto extraída del documento</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-muted p-3 text-sm font-medium">Selfie capturada</div>
                        <div className="p-6 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50">
                          <div className="relative h-48 w-full flex items-center justify-center">
                            <div className="text-center">
                              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Selfie del usuario</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cronologia" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Cronología del flujo</CardTitle>
                  <CardDescription>Seguimiento detallado de cada paso del proceso de onboarding</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {persona.pasos.map((paso, index) => (
                      <Card key={paso.id} className="border-l-4 border-l-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  paso.estado === "completado"
                                    ? "bg-green-500"
                                    : paso.estado === "revision"
                                      ? "bg-blue-500"
                                      : "bg-muted"
                                }`}
                              />
                              <h4 className="font-semibold text-base">{paso.nombre}</h4>
                              {paso.estado === "completado" && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {paso.estado === "revision" && <AlertCircle className="h-4 w-4 text-blue-500" />}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewJson(paso.id, paso.nombre)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Ver JSON
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Fecha y hora</p>
                              <p className="font-medium">{paso.timestamp}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duración</p>
                              <p className="font-medium">{paso.tiempo}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Estado</p>
                              <Badge
                                variant={
                                  paso.estado === "completado"
                                    ? "default"
                                    : paso.estado === "revision"
                                      ? "outline"
                                      : "secondary"
                                }
                                className="font-medium"
                              >
                                {paso.estado === "completado"
                                  ? "Completado"
                                  : paso.estado === "revision"
                                    ? "En revisión"
                                    : "Pendiente"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historial" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Historial de actividad</CardTitle>
                  <CardDescription>Registro cronológico de todas las acciones realizadas</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Aquí se mostraría el historial detallado de todas las acciones realizadas por el usuario y el
                      system durante el proceso de onboarding.
                    </p>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <p className="text-sm font-medium mb-2">Próximamente</p>
                      <p className="text-sm text-muted-foreground">
                        Esta sección incluirá logs detallados, cambios de estado, interacciones del usuario y eventos
                        del sistema.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {shouldShowAnalystTab(persona.estado) && (
              <TabsContent value="gestion" className="space-y-6">
                {/* Estado de revisión */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Estado de revisión
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Estado actual</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(persona.estado)}
                          <Badge variant={getStatusVariant(persona.estado)} className="font-medium">
                            {getStatusText(persona.estado)}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Analista responsable</p>
                        <p className="text-sm font-semibold">{selectedAnalyst}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Indicador de estado</p>
                        <Badge variant="outline" className="font-medium">
                          {selectedAnalyst === "Sin asignar" ? "Sin asignar" : "Asignado"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Asignación de analista */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Asignación de analista
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="analyst-select">Analista actual</Label>
                        <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
                          <SelectTrigger id="analyst-select">
                            <SelectValue placeholder="Seleccionar analista" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sin asignar">Sin asignar</SelectItem>
                            <SelectItem value="María García">María García</SelectItem>
                            <SelectItem value="Carlos López">Carlos López</SelectItem>
                            <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                            <SelectItem value="Luis Rodríguez">Luis Rodríguez</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Fecha de asignación</p>
                        <p className="text-sm">{persona.fecha}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Cambiar Analista
                      </Button>
                      <Button variant="outline" size="sm">
                        <History className="h-4 w-4 mr-2" />
                        Ver historial
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Acciones de revisión */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Acciones de revisión
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleFinalApproval} className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button variant="destructive" onClick={handleFinalApproval} className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4" />
                        Rechazar
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <MessageSquare className="h-4 w-4" />
                        Solicitar Información
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Comentarios y notas */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Comentarios y notas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="analyst-notes">Notas actuales</Label>
                      <Textarea
                        id="analyst-notes"
                        value={analystNotes}
                        onChange={(e) => setAnalystNotes(e.target.value)}
                        placeholder="Notas del analista..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-comment">Agregar comentario nuevo</Label>
                      <Textarea
                        id="new-comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribir nuevo comentario..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="internal-comment"
                        checked={isInternalComment}
                        onCheckedChange={setIsInternalComment}
                      />
                      <Label htmlFor="internal-comment" className="text-sm">
                        Comentario interno (no visible para el cliente)
                      </Label>
                    </div>
                    <Button onClick={handleAddComment} className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Agregar comentario
                    </Button>
                  </CardContent>
                </Card>

                {/* Comunicación con cliente */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Comunicación con cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-feedback">Campo de retroalimentación</Label>
                      <Textarea
                        id="client-feedback"
                        value={clientFeedback}
                        onChange={(e) => setClientFeedback(e.target.value)}
                        placeholder="Mensaje para el cliente..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mark-urgent" checked={isUrgent} onCheckedChange={setIsUrgent} />
                        <Label htmlFor="mark-urgent" className="text-sm">
                          Marcar como urgente
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="send-email" checked={sendByEmail} onCheckedChange={setSendByEmail} />
                        <Label htmlFor="send-email" className="text-sm">
                          Enviar por email
                        </Label>
                      </div>
                    </div>
                    <Button onClick={handleSendFeedback} className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar retroalimentación
                    </Button>
                  </CardContent>
                </Card>

                {/* Solicitar documentos */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileX className="h-5 w-5 text-primary" />
                      Solicitar documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="identity-doc"
                          checked={requiredDocuments.identityDocument}
                          onCheckedChange={(checked) =>
                            setRequiredDocuments({ ...requiredDocuments, identityDocument: checked as boolean })
                          }
                        />
                        <Label htmlFor="identity-doc" className="text-sm">
                          Documento de identidad
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="proof-address"
                          checked={requiredDocuments.proofOfAddress}
                          onCheckedChange={(checked) =>
                            setRequiredDocuments({ ...requiredDocuments, proofOfAddress: checked as boolean })
                          }
                        />
                        <Label htmlFor="proof-address" className="text-sm">
                          Comprobante de domicilio
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="income-proof"
                          checked={requiredDocuments.incomeProof}
                          onCheckedChange={(checked) =>
                            setRequiredDocuments({ ...requiredDocuments, incomeProof: checked as boolean })
                          }
                        />
                        <Label htmlFor="income-proof" className="text-sm">
                          Comprobante de ingresos
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="bank-statement"
                          checked={requiredDocuments.bankStatement}
                          onCheckedChange={(checked) =>
                            setRequiredDocuments({ ...requiredDocuments, bankStatement: checked as boolean })
                          }
                        />
                        <Label htmlFor="bank-statement" className="text-sm">
                          Estado de cuenta bancario
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="additional-docs"
                          checked={requiredDocuments.additionalDocuments}
                          onCheckedChange={(checked) =>
                            setRequiredDocuments({ ...requiredDocuments, additionalDocuments: checked as boolean })
                          }
                        />
                        <Label htmlFor="additional-docs" className="text-sm">
                          Documentos adicionales
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-observations">Observaciones adicionales</Label>
                      <Textarea
                        id="doc-observations"
                        value={documentObservations}
                        onChange={(e) => setDocumentObservations(e.target.value)}
                        placeholder="Especificar documentos adicionales o instrucciones..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <Button onClick={handleRequestDocuments} className="flex items-center gap-2">
                      <FileX className="h-4 w-4" />
                      Solicitar Documentos
                    </Button>
                  </CardContent>
                </Card>

                {/* Evaluación de riesgo */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      Evaluación de riesgo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="risk-level">Nivel de riesgo actual</Label>
                      <Select value={riskLevel} onValueChange={setRiskLevel}>
                        <SelectTrigger id="risk-level">
                          <SelectValue placeholder="Seleccionar nivel de riesgo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bajo">Bajo</SelectItem>
                          <SelectItem value="Medio">Medio</SelectItem>
                          <SelectItem value="Alto">Alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Factores de riesgo</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="high-value"
                            checked={riskFactors.highValueTransactions}
                            onCheckedChange={(checked) =>
                              setRiskFactors({ ...riskFactors, highValueTransactions: checked as boolean })
                            }
                          />
                          <Label htmlFor="high-value" className="text-sm">
                            Transacciones de alto valor
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="foreign-country"
                            checked={riskFactors.foreignCountry}
                            onCheckedChange={(checked) =>
                              setRiskFactors({ ...riskFactors, foreignCountry: checked as boolean })
                            }
                          />
                          <Label htmlFor="foreign-country" className="text-sm">
                            País extranjero
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="politically-exposed"
                            checked={riskFactors.politicallyExposed}
                            onCheckedChange={(checked) =>
                              setRiskFactors({ ...riskFactors, politicallyExposed: checked as boolean })
                            }
                          />
                          <Label htmlFor="politically-exposed" className="text-sm">
                            Persona políticamente expuesta (PEP)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="suspicious-activity"
                            checked={riskFactors.suspiciousActivity}
                            onCheckedChange={(checked) =>
                              setRiskFactors({ ...riskFactors, suspiciousActivity: checked as boolean })
                            }
                          />
                          <Label htmlFor="suspicious-activity" className="text-sm">
                            Actividad sospechosa
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="incomplete-docs"
                            checked={riskFactors.incompleteDocumentation}
                            onCheckedChange={(checked) =>
                              setRiskFactors({ ...riskFactors, incompleteDocumentation: checked as boolean })
                            }
                          />
                          <Label htmlFor="incomplete-docs" className="text-sm">
                            Documentación incompleta
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="inconsistent-info"
                            checked={riskFactors.inconsistentInformation}
                            onCheckedChange={(checked) =>
                              setRiskFactors({ ...riskFactors, inconsistentInformation: checked as boolean })
                            }
                          />
                          <Label htmlFor="inconsistent-info" className="text-sm">
                            Información inconsistente
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="risk-observations">Observaciones</Label>
                      <Textarea
                        id="risk-observations"
                        value={riskObservations}
                        onChange={(e) => setRiskObservations(e.target.value)}
                        placeholder="Observaciones sobre la evaluación de riesgo..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <Button onClick={handleUpdateRiskAssessment} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Actualizar evaluación
                    </Button>
                  </CardContent>
                </Card>

                {/* Lista de verificación de cumplimiento */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      Lista de verificación de cumplimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Documentación cumplida</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="identity-verified"
                            checked={complianceChecklist.identityVerified}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, identityVerified: checked as boolean })
                            }
                          />
                          <Label htmlFor="identity-verified" className="text-sm">
                            Identidad verificada
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="address-verified"
                            checked={complianceChecklist.addressVerified}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, addressVerified: checked as boolean })
                            }
                          />
                          <Label htmlFor="address-verified" className="text-sm">
                            Dirección verificada
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="biometric-verified"
                            checked={complianceChecklist.biometricVerified}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, biometricVerified: checked as boolean })
                            }
                          />
                          <Label htmlFor="biometric-verified" className="text-sm">
                            Biometría verificada
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="risk-assessment"
                            checked={complianceChecklist.riskAssessment}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, riskAssessment: checked as boolean })
                            }
                          />
                          <Label htmlFor="risk-assessment" className="text-sm">
                            Evaluación de riesgo completada
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Verificaciones completadas</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sanctions-check"
                            checked={complianceChecklist.sanctionsCheck}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, sanctionsCheck: checked as boolean })
                            }
                          />
                          <Label htmlFor="sanctions-check" className="text-sm">
                            Verificación de sanciones
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pep-check"
                            checked={complianceChecklist.pepCheck}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, pepCheck: checked as boolean })
                            }
                          />
                          <Label htmlFor="pep-check" className="text-sm">
                            Verificación PEP
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="adverse-media"
                            checked={complianceChecklist.adverseMediaCheck}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, adverseMediaCheck: checked as boolean })
                            }
                          />
                          <Label htmlFor="adverse-media" className="text-sm">
                            Verificación de medios adversos
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="final-approval"
                            checked={complianceChecklist.finalApproval}
                            onCheckedChange={(checked) =>
                              setComplianceChecklist({ ...complianceChecklist, finalApproval: checked as boolean })
                            }
                          />
                          <Label htmlFor="final-approval" className="text-sm">
                            Aprobación final
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Progreso de cumplimiento</p>
                        <span className="text-sm text-muted-foreground">
                          {completedChecks} de {totalChecks} completados
                        </span>
                      </div>
                      <Progress value={complianceProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Decisión final */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Decisión final
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Confirmación:</strong> Una vez que tomes una decisión final, el estado del caso cambiará
                        y no podrá ser modificado sin autorización adicional.
                      </AlertDescription>
                    </Alert>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleFinalApproval} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Aprobar Verificación
                      </Button>
                      <Button variant="destructive" onClick={handleFinalApproval} className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Rechazar Verificación
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSaveAndContinue}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Save className="h-4 w-4" />
                        Guardar y continuar más tarde
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Right sidebar panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Acciones disponibles</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {(persona.estado === "revision" || persona.estado === "en-progreso") && (
                <div className="space-y-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="w-full" onClick={() => setAprobacionModalOpen(true)}>
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Aprobar verificación
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Aprobar la verificación de identidad</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="destructive" className="w-full" onClick={() => setAprobacionModalOpen(true)}>
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Rechazar verificación
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rechazar la verificación de identidad</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {persona.estado !== "revision" && persona.estado !== "en-progreso" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Esta persona ya ha sido procesada. Estado actual: <strong>{getStatusText(persona.estado)}</strong>
                  </AlertDescription>
                </Alert>
              )}

              {persona.estado === "rechazado" && persona.motivoRechazo && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Motivo del rechazo</AlertTitle>
                  <AlertDescription>{persona.motivoRechazo}</AlertDescription>
                </Alert>
              )}

              <Separator />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleExport}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar datos JSON
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Descargar todos los datos en formato JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Información general</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Progreso</p>
                <div className="flex items-center gap-2">
                  <Progress value={persona.progreso} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">{persona.progreso}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Estado actual</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(persona.estado)}
                  <Badge variant={getStatusVariant(persona.estado)} className="font-medium">
                    {getStatusText(persona.estado)}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Flujo</p>
                <Badge variant="outline" className="font-medium">
                  {persona.flujo}
                </Badge>
              </div>
              <InfoField
                label="Documento"
                value={persona.documento}
                className="font-mono"
              />
              <InfoField
                label="Email"
                value={persona.email}
                type="email"
              />
              <InfoField
                label="Teléfono"
                value={persona.telefono}
                type="tel"
              />
              <InfoField
                label="Fecha de inicio"
                value={persona.fecha}
                type="text"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced JSON Modal with Input/Output tabs */}
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
              <Tabs defaultValue="input" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="input" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Entrada (Input)
                  </TabsTrigger>
                  <TabsTrigger value="output" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                    Salida (Output)
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="input" className="h-full overflow-auto mt-0">
                    {selectedStepData.input ? (
                      <JsonViewer data={selectedStepData.input} title="Datos de entrada procesados en este paso" />
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <FileX className="h-8 w-8 mx-auto mb-2" />
                          <p>No hay datos de entrada disponibles para este paso</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="output" className="h-full overflow-auto mt-0">
                    {selectedStepData.output ? (
                      <JsonViewer data={selectedStepData.output} title="Datos generados como resultado de este paso" />
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <FileX className="h-8 w-8 mx-auto mb-2" />
                          <p>No hay datos de salida disponibles para este paso</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              {/* Step metadata */}
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Timestamp</p>
                    <p className="font-medium">{selectedStepData.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duración</p>
                    <p className="font-medium">{selectedStepData.duracion}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estado</p>
                    <Badge variant="outline" className="font-medium">
                      {selectedStepData.estado}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AprobacionModal
        open={aprobacionModalOpen}
        onOpenChange={setAprobacionModalOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        personaName={persona.nombre}
      />
    </div>
  )
}
