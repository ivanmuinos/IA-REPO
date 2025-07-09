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
  ArrowLeft,
  AlertCircle,
  XCircle,
} from "lucide-react"

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
import Link from "next/link"

export default function PersonaDetallePage() {
  const params = useParams()
  const personaId = Number(params.id)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aprobacionModalOpen, setAprobacionModalOpen] = useState(false)
  const { toast } = useToast()

  const [editingProfile, setEditingProfile] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState("Estándar")
  const [transactionAmount, setTransactionAmount] = useState(5000000)

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

  useEffect(() => {
    loadPersona()
  }, [personaId])

  useEffect(() => {
    if (persona) {
      setSelectedProfile(persona.perfilRiesgo.perfilTransaccional)
      setTransactionAmount(
        profileAmounts[persona.perfilRiesgo.perfilTransaccional as keyof typeof profileAmounts] || 5000000,
      )
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
      console.log(`Successfully loaded persona: ID ${data.id}, Name: ${data.nombre}`)
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
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title={persona.nombre}
        breadcrumbs={[{ label: "Personas", href: "/personas" }, { label: persona.nombre }]}
        actions={
          <div className="flex items-center gap-2">
            {getStatusIcon(persona.estado)}
            <Badge variant={getStatusVariant(persona.estado)} className="font-medium">
              {getStatusText(persona.estado)}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main panel - content */}
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="detalles" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="detalles">Detalles de onboarding</TabsTrigger>
              <TabsTrigger value="informacion">Información general</TabsTrigger>
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
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                          <p className="text-sm font-semibold">{persona.datosOCR.nombre}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Apellidos</p>
                          <p className="text-sm font-semibold">{persona.datosOCR.apellidos}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Documento</p>
                          <p className="text-sm font-mono">{persona.datosOCR.documento}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Tipo de documento</p>
                          <Badge variant="outline">{persona.datosOCR.tipoDocumento}</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Fecha de nacimiento</p>
                          <p className="text-sm">{persona.datosOCR.fechaNacimiento}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Nacionalidad</p>
                          <p className="text-sm">{persona.datosOCR.nacionalidad}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">País</p>
                          <p className="text-sm">{persona.geolocalizacion.pais}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Ciudad</p>
                          <p className="text-sm">{persona.geolocalizacion.ciudad}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Dispositivo</p>
                          <p className="text-sm">
                            {persona.dispositivoInfo.tipo} - {persona.dispositivoInfo.modelo}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Sistema Operativo</p>
                          <p className="text-sm">{persona.dispositivoInfo.sistemaOperativo}</p>
                        </div>
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
                                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border animate-in fade-in duration-200">
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
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Coordenadas</p>
                              <p className="text-sm font-mono">{persona.geolocalizacion.coordenadas}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Dirección IP</p>
                              <p className="text-sm font-mono">{persona.geolocalizacion.direccionIP}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Proveedor ISP</p>
                              <p className="text-sm">{persona.geolocalizacion.proveedor}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Navegador</p>
                              <p className="text-sm">{persona.dispositivoInfo.navegador}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Resolución</p>
                              <p className="text-sm font-mono">{persona.dispositivoInfo.resolucion}</p>
                            </div>
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
                <CardContent className="p-8">
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

            <TabsContent value="informacion" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Información general</CardTitle>
                  <CardDescription>Datos adicionales del usuario</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm font-semibold">{persona.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                        <p className="text-sm font-semibold">{persona.telefono}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Flujo utilizado</p>
                        <Badge variant="outline">{persona.flujo}</Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Fecha de inicio</p>
                        <p className="text-sm">{persona.fecha}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Estado actual</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(persona.estado)}
                          <Badge variant={getStatusVariant(persona.estado)}>{getStatusText(persona.estado)}</Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Progreso</p>
                        <div className="flex items-center gap-2">
                          <Progress value={persona.progreso} className="h-2 flex-1" />
                          <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                            {persona.progreso}%
                          </span>
                        </div>
                      </div>
                    </div>
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
          </Tabs>
        </div>

        {/* Right sidebar panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Información general</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Flujo</p>
                <Badge variant="outline" className="font-medium">
                  {persona.flujo}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Documento</p>
                <p className="text-sm font-mono">{persona.documento}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{persona.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p className="text-sm">{persona.telefono}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Fecha de inicio</p>
                <p className="text-sm">{persona.fecha}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Progreso</p>
                <div className="flex items-center gap-2">
                  <Progress value={persona.progreso} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">{persona.progreso}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Cronología del proceso</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="relative pl-6 space-y-6">
                <div className="absolute top-0 bottom-0 left-2 border-l-2 border-dashed border-muted" />

                {persona.pasos.map((paso, index) => (
                  <div key={paso.id} className="relative">
                    <div
                      className={`absolute -left-6 h-4 w-4 rounded-full border-2 bg-background ${
                        paso.estado === "completado"
                          ? "border-green-500 bg-green-500"
                          : paso.estado === "revision"
                            ? "border-blue-500 bg-blue-500"
                            : "border-muted bg-muted"
                      }`}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{paso.nombre}</p>
                        {paso.estado === "completado" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {paso.estado === "revision" && <Clock className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{paso.timestamp}</span>
                        <span>Duración: {paso.tiempo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                    <Button variant="outline" className="w-full" onClick={handleExport}>
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
        </div>
      </div>

      <AprobacionModal
        open={aprobacionModalOpen}
        onOpenChange={setAprobacionModalOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        personaName={persona.nombre}
      />
    </main>
  )
}
