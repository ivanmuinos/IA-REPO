"use client"

import { useState, use } from "react"
import Link from "next/link"
import { Download, CheckCircle, Clock, AlertCircle, XCircle, Edit, Save, X } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InfoField, InfoFieldWithBadge } from "@/components/ui/info-field"
import { useToast } from "@/hooks/use-toast"

interface JuridicoDetailPageProps {
  params: Promise<{ id: string }>
}

interface EmpresaData {
  id: string
  nombre: string
  documento: string
  flujo: string
  fecha: string
  estado: string
  progreso: number
  email: string
  telefono: string
  direccion: string
  representanteLegal: string
  documentoRepresentante: string
  fechaConstitucion: string
  actividad: string
}

interface FormData {
  general: {
    nombre: string
    documento: string
    email: string
    telefono: string
    direccion: string
    fechaConstitucion: string
    actividad: string
    tipoSocietario: string
    paisConstitucion: string
    sitioWeb: string
  }
  representante: {
    nombre: string
    documento: string
    cargo: string
  }
}

const STATUS_CONFIG = {
  completado: { icon: CheckCircle, color: "text-green-600", variant: "default" as const },
  "en-progreso": { icon: Clock, color: "text-amber-600", variant: "secondary" as const },
  revision: { icon: AlertCircle, color: "text-blue-600", variant: "outline" as const },
  abandonado: { icon: XCircle, color: "text-red-600", variant: "destructive" as const },
  rechazado: { icon: XCircle, color: "text-red-600", variant: "destructive" as const },
} as const

const STATUS_LABELS = {
  completado: "Completado",
  "en-progreso": "En progreso",
  revision: "Revisión manual",
  abandonado: "Abandonado",
  rechazado: "Rechazado",
} as const

export default function JuridicoDetailPage({ params }: JuridicoDetailPageProps) {
  const { id } = use(params)
  const { toast } = useToast()

  // Mock data - in a real application, this would be fetched based on the ID
  const empresa: EmpresaData = {
    id: id,
    nombre: "Empresa XYZ S.L.",
    documento: "B12345678",
    flujo: "KYB Empresas",
    fecha: "15/05/2023 14:32",
    estado: "completado",
    progreso: 100,
    email: "contacto@empresaxyz.com",
    telefono: "+34 912 345 678",
    direccion: "Calle Principal 123, 28001 Madrid",
    representanteLegal: "Ana García Martínez",
    documentoRepresentante: "12345678A",
    fechaConstitucion: "10/03/2010",
    actividad: "Servicios de consultoría tecnológica",
  }

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    general: {
      nombre: empresa.nombre,
      documento: empresa.documento,
      email: empresa.email,
      telefono: empresa.telefono,
      direccion: empresa.direccion,
      fechaConstitucion: empresa.fechaConstitucion,
      actividad: empresa.actividad,
      tipoSocietario: "S.A.",
      paisConstitucion: "España",
      sitioWeb: "empresa.com",
    },
    representante: {
      nombre: empresa.representanteLegal,
      documento: empresa.documentoRepresentante,
      cargo: "Administrador único",
    },
  })
  const [originalData, setOriginalData] = useState<FormData>(formData)

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
    if (!isEditing) {
      setOriginalData(formData)
    }
  }

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to save the data
      // console.log("Saving data:", formData)
      setIsEditing(false)
      toast({
        title: "Cambios guardados",
        description: "La información se ha actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const getStatusIcon = (estado: string) => {
    const config = STATUS_CONFIG[estado as keyof typeof STATUS_CONFIG]
    if (!config) return null
    const IconComponent = config.icon
    return <IconComponent className={`h-5 w-5 ${config.color}`} />
  }

  const getStatusText = (estado: string) => {
    return STATUS_LABELS[estado as keyof typeof STATUS_LABELS] || estado
  }

  const getStatusVariant = (estado: string) => {
    const config = STATUS_CONFIG[estado as keyof typeof STATUS_CONFIG]
    return config?.variant || "secondary"
  }

  const renderField = (
    label: string,
    value: string,
    section: keyof FormData,
    field: string,
    type = "text",
    className?: string,
  ) => (
    <div>
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      {isEditing ? (
        <Input
          type={type}
          value={value}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
          className={`mt-1 ${className || ""}`}
        />
      ) : (
        <p className={`text-base ${className || ""}`}>{value}</p>
      )}
    </div>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{empresa.nombre}</h2>
          <p className="text-muted-foreground">
            Información detallada del proceso de verificación de la empresa
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(empresa.estado)}
          <Badge variant={getStatusVariant(empresa.estado)} className="font-medium">
            {getStatusText(empresa.estado)}
          </Badge>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEditToggle}>
              <Edit className="h-4 w-4 mr-2" />
              Editar información
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información general</CardTitle>
            <CardDescription>Datos básicos de la empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderField(
                  "Nombre de la empresa",
                  formData.general.nombre,
                  "general",
                  "nombre",
                  "text",
                  "font-medium",
                )}
                {renderField("CIF/NIF", formData.general.documento, "general", "documento", "text", "font-mono")}
                {renderField("Email", formData.general.email, "general", "email", "email")}
                {renderField("Teléfono", formData.general.telefono, "general", "telefono")}
              </div>
              <div className="space-y-4">
                {renderField("Dirección", formData.general.direccion, "general", "direccion")}
                {renderField(
                  "Fecha de constitución",
                  formData.general.fechaConstitucion,
                  "general",
                  "fechaConstitucion",
                  "date",
                )}
                {renderField("Actividad principal", formData.general.actividad, "general", "actividad")}
                {renderField("Tipo societario", formData.general.tipoSocietario, "general", "tipoSocietario")}
                {renderField("País de constitución", formData.general.paisConstitucion, "general", "paisConstitucion")}
                {renderField("Sitio web", formData.general.sitioWeb, "general", "sitioWeb")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Representante legal</CardTitle>
            <CardDescription>Información del representante autorizado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField(
              "Nombre completo",
              formData.representante.nombre,
              "representante",
              "nombre",
              "text",
              "font-medium",
            )}
            {renderField(
              "Documento de identidad",
              formData.representante.documento,
              "representante",
              "documento",
              "text",
              "font-mono",
            )}
            {renderField("Cargo", formData.representante.cargo, "representante", "cargo")}
          </CardContent>
        </Card>
      </div>

      {/* Static information sections */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad económica</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoField
              label="Código de actividad (AFIP)"
              value="62010"
              className="font-mono"
            />
            <InfoField
              label="Giro comercial"
              value="Consultoría tecnológica"
            />
            <InfoField
              label="Sector o industria"
              value="Tecnología"
            />
          </div>
          <div className="space-y-4">
            <InfoField
              label="Países donde opera"
              value="Argentina, Brasil, España"
            />
            <InfoField
              label="Sectores de riesgo"
              value="Criptomonedas, Fintech"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Representantes y socios</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoField
              label="Socios con +5%"
              value="Juan Pérez - 25%, Laura Díaz - 10%"
            />
            <InfoField
              label="UBOs"
              value="Juan Pérez"
            />
            <InfoField
              label="PEPs"
              value="No se detectaron"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controles regulatorios</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoField
              label="Verificación de identidad"
              value="Aprobado"
            />
            <InfoField
              label="Listas restrictivas"
              value="Sin coincidencias"
            />
            <InfoField
              label="Declaración de fondos"
              value="Presentada"
            />
            <InfoField
              label="Evaluación de riesgo"
              value="Medio"
            />
          </div>
          <div className="space-y-4">
            <InfoField
              label="Jurisdicciones de riesgo"
              value="Ninguna"
            />
            <InfoField
              label="Normativas aplicables"
              value="UIF, BCRA, Ley 27.430"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentación</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Certificado de existencia</p>
              <p className="text-base">Válido</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CUIT vigente</p>
              <p className="text-base">Sí</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estatutos sociales</p>
              <p className="text-base">Recibidos</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estados financieros</p>
              <p className="text-base">2023 disponibles</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Documentos de identidad</p>
              <p className="text-base">Verificados</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Formulario diligencia</p>
              <p className="text-base">Firmado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen ejecutivo regulatorio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">
            La empresa cumple con los estándares mínimos de debida diligencia establecidos por la normativa argentina.
            Se detectaron operaciones en sectores sensibles como cripto, pero se cuenta con documentación válida, sin
            alertas en listas restrictivas.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verificación documental y autenticidad</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sellos y certificaciones</p>
              <p className="text-base">AFIP, Notariado verificados</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Códigos digitales</p>
              <p className="text-base">Validados</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de emisión</p>
              <p className="text-base">10/05/2023</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vigencia</p>
              <p className="text-base">Válido hasta 10/05/2025</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Título del PDF</p>
              <p className="text-base">CertificadoEmpresaXYZ</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Autor</p>
              <p className="text-base">Estudio Jurídico ABC</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de creación</p>
              <p className="text-base">10/05/2023</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última modificación</p>
              <p className="text-base">10/05/2023</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="verificacion">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verificacion">Proceso de verificación</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="historial">Historial de cambios</TabsTrigger>
        </TabsList>
        <TabsContent value="verificacion" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado del proceso</CardTitle>
              <CardDescription>Progreso de verificación KYB</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Progreso general</p>
                    <p className="text-sm font-medium">{empresa.progreso}%</p>
                  </div>
                  <Progress value={empresa.progreso} className="h-2" />
                </div>

                <div className="space-y-4">
                  {[
                    "Verificación de identidad empresarial",
                    "Verificación de documentos legales",
                    "Verificación de representante legal",
                    "Análisis de riesgo",
                  ].map((step) => (
                    <div key={step} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{step}</p>
                        <p className="text-sm text-muted-foreground">Completado el 15/05/2023</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documentos" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos aportados</CardTitle>
              <CardDescription>Documentación legal de la empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Escritura de constitución", size: "2.4 MB" },
                  { name: "CIF de la empresa", size: "0.8 MB" },
                  { name: "Poderes del representante", size: "1.5 MB" },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">PDF · {doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="historial" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de actividad</CardTitle>
              <CardDescription>Registro de cambios y acciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    title: "Verificación completada",
                    time: "15/05/2023 14:32",
                    description: "El proceso de verificación KYB ha sido completado satisfactoriamente.",
                    isFirst: true,
                  },
                  {
                    title: "Documentación aprobada",
                    time: "15/05/2023 14:30",
                    description: "Todos los documentos han sido revisados y aprobados.",
                    isFirst: false,
                  },
                  {
                    title: "Documentos subidos",
                    time: "15/05/2023 14:15",
                    description: "Se han subido los documentos requeridos para la verificación.",
                    isFirst: false,
                  },
                  {
                    title: "Proceso iniciado",
                    time: "15/05/2023 14:00",
                    description: "Se ha iniciado el proceso de verificación KYB para la empresa.",
                    isFirst: false,
                  },
                ].map((event) => (
                  <div key={event.title} className="flex gap-4">
                    <div className="w-1 bg-muted rounded-full relative">
                      <div
                        className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                          event.isFirst ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                      <p className="text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
