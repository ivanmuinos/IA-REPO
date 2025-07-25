"use client"

import { useState, use } from "react"
import Link from "next/link"
import { Download, CheckCircle, Clock, AlertCircle, XCircle, Edit, Save, X, Building, Users, FileText, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InfoField, InfoFieldWithBadge } from "@/components/ui/info-field"
import { useToast } from "@/hooks/use-toast"

// Importar el nuevo sistema unificado
import { DetailPageTemplate, SectionConfig, SidebarConfig } from "@/components/templates/DetailPageTemplate"
import { ActionConfig, StatusConfig } from "@/components/shared/PageHeader/UnifiedPageHeader"
import { SectionCard } from "@/components/shared/Sections/SectionCard"
import { ActionsCard, type ActionItem } from "@/components/shared/ActionsCard/ActionsCard"
import { InfoField as InfoFieldNew, InfoGrid } from "@/components/shared/InfoField/InfoField"

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

// Componentes de sección específicos para KYB
const InformacionGeneralSection: React.FC<{ 
  data: any, 
  isEditing: boolean, 
  onInputChange: (section: string, field: string, value: string) => void 
}> = ({ data, isEditing, onInputChange }) => (
  <SectionCard title="Información general" description="Datos básicos de la empresa" icon={Building}>
    <div className="space-y-6">
      <InfoGrid>
        <InfoFieldNew 
          label="Nombre de la empresa" 
          value={data.general.nombre} 
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "nombre", value) : undefined}
        />
        <InfoFieldNew 
          label="CIF/NIF" 
          value={data.general.documento} 
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "documento", value) : undefined}
        />
        <InfoFieldNew 
          label="Email" 
          value={data.general.email} 
          type="email"
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "email", value) : undefined}
        />
        <InfoFieldNew 
          label="Teléfono" 
          value={data.general.telefono} 
          type="tel"
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "telefono", value) : undefined}
        />
        <InfoFieldNew 
          label="Dirección" 
          value={data.general.direccion} 
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "direccion", value) : undefined}
        />
        <InfoFieldNew 
          label="Fecha de constitución" 
          value={data.general.fechaConstitucion} 
          type="date"
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "fechaConstitucion", value) : undefined}
        />
        <InfoFieldNew 
          label="Actividad principal" 
          value={data.general.actividad} 
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "actividad", value) : undefined}
        />
        <InfoFieldNew 
          label="Tipo societario" 
          value={data.general.tipoSocietario} 
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "tipoSocietario", value) : undefined}
        />
        <InfoFieldNew 
          label="País de constitución" 
          value={data.general.paisConstitucion} 
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "paisConstitucion", value) : undefined}
        />
        <InfoFieldNew 
          label="Sitio web" 
          value={data.general.sitioWeb} 
          readonly={!isEditing}
          onChange={isEditing ? (value) => onInputChange("general", "sitioWeb", value) : undefined}
        />
      </InfoGrid>
    </div>
  </SectionCard>
)

const ActividadEconomicaSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Actividad económica" description="Información sobre el negocio" icon={Building}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  </SectionCard>
)

const RepresentantesSociosSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Representantes y socios" description="Información de personas clave" icon={Users}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  </SectionCard>
)

const ControlesRegulatoriosSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Controles regulatorios" description="Evaluación de compliance" icon={Shield}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  </SectionCard>
)

const DocumentacionSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Documentación" description="Documentos presentados" icon={FileText}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Certificado de existencia</p>
          <p className="text-base">Válido</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Estatutos sociales</p>
          <p className="text-base">Presentados</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Acta de asamblea</p>
          <p className="text-base">Presentada</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Balance de situación</p>
          <p className="text-base">Presentado</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Certificado de cumplimiento</p>
          <p className="text-base">Válido</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Declaración jurada</p>
          <p className="text-base">Presentada</p>
        </div>
      </div>
    </div>
  </SectionCard>
)

const ResumenEjecutivoSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Resumen ejecutivo regulatorio" description="Evaluación final" icon={CheckCircle}>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Riesgo regulatorio:</span>
          <Badge variant="outline">Medio</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Recomendación:</span>
          <Badge variant="success">Aprobar</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Justificación</p>
        <p className="text-sm">
          La empresa cumple con todos los requisitos regulatorios establecidos. 
          La documentación presentada es completa y válida. 
          No se detectaron riesgos significativos en las verificaciones realizadas.
        </p>
      </div>
    </div>
  </SectionCard>
)

// Componente para el representante legal en el sidebar
const RepresentanteLegalCard: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-primary" />
      <span className="font-medium">{data.representante.nombre}</span>
    </div>
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-muted-foreground">Cargo:</span>
        <p className="font-medium">{data.representante.cargo}</p>
      </div>
      <div>
        <span className="text-muted-foreground">DNI/NIE:</span>
        <p className="font-mono">{data.representante.documento}</p>
      </div>
    </div>
  </div>
)

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
      tipoSocietario: "Sociedad Limitada",
      paisConstitucion: "España",
      sitioWeb: "www.empresaxyz.com",
    },
    representante: {
      nombre: empresa.representanteLegal,
      documento: empresa.documentoRepresentante,
      cargo: "Administrador Único",
    },
  })

  // Preservar toda la lógica de negocio existente
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      // Aquí iría la lógica real de guardado
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular API call
      setIsEditing(false)
      toast({
        title: "Cambios guardados",
        description: "La información ha sido actualizada exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      general: {
        nombre: empresa.nombre,
        documento: empresa.documento,
        email: empresa.email,
        telefono: empresa.telefono,
        direccion: empresa.direccion,
        fechaConstitucion: empresa.fechaConstitucion,
        actividad: empresa.actividad,
        tipoSocietario: "Sociedad Limitada",
        paisConstitucion: "España",
        sitioWeb: "www.empresaxyz.com",
      },
      representante: {
        nombre: empresa.representanteLegal,
        documento: empresa.documentoRepresentante,
        cargo: "Administrador Único",
      },
    })
    setIsEditing(false)
  }

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "en-progreso":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "revision":
        return <AlertCircle className="h-5 w-5 text-blue-600" />
      case "abandonado":
      case "rechazado":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (estado: string) => {
    const STATUS_LABELS = {
      completado: "Completado",
      "en-progreso": "En progreso",
      revision: "Revisión manual",
      abandonado: "Abandonado",
      rechazado: "Rechazado",
    } as const
    return STATUS_LABELS[estado as keyof typeof STATUS_LABELS] || "Pendiente"
  }

  const getStatusVariant = (estado: string): "default" | "secondary" | "destructive" | "outline" => {
    const STATUS_CONFIG = {
      completado: "default" as const,
      "en-progreso": "secondary" as const,
      revision: "outline" as const,
      abandonado: "destructive" as const,
      rechazado: "destructive" as const,
    } as const
    return STATUS_CONFIG[estado as keyof typeof STATUS_CONFIG] || "outline"
  }

  // Configuración del nuevo sistema unificado
  const status: StatusConfig = {
    value: "Completado",
    variant: "success"
  }

  // Acciones en el header
  const primaryActions: ActionConfig[] = [
    {
      label: isEditing ? "Guardar cambios" : "Editar información",
      variant: isEditing ? "default" : "outline",
      icon: isEditing ? Save : Edit,
      onClick: isEditing ? handleSave : handleEditToggle
    }
  ]

  // Configuración de acciones para el sidebar
  const sidebarActions: ActionItem[] = [
    {
      label: "Aprobar verificación",
      variant: "default",
      icon: CheckCircle,
      onClick: () => {
        toast({
          title: "Verificación aprobada",
          description: "La verificación de la empresa ha sido aprobada exitosamente.",
        })
      }
    },
    {
      label: "Rechazar verificación",
      variant: "destructive",
      icon: XCircle,
      onClick: () => {
        toast({
          title: "Verificación rechazada",
          description: "La verificación de la empresa ha sido rechazada.",
          variant: "destructive",
        })
      }
    },
    {
      label: "Exportar datos JSON",
      variant: "outline",
      icon: Download,
      onClick: () => {
        toast({
          title: "Datos exportados",
          description: "Los datos de la empresa han sido exportados en formato JSON.",
        })
      }
    }
  ]

  // Configuración de secciones (sin tabs - secuencial)
  const sections: SectionConfig[] = [
    {
      id: "general",
      title: "Información general",
      component: InformacionGeneralSection,
      props: { 
        data: formData, 
        isEditing, 
        onInputChange: handleInputChange 
      }
    },
    {
      id: "actividad",
      title: "Actividad económica",
      component: ActividadEconomicaSection,
      props: { data: empresa }
    },
    {
      id: "representantes",
      title: "Representantes y socios",
      component: RepresentantesSociosSection,
      props: { data: empresa }
    },
    {
      id: "controles",
      title: "Controles regulatorios",
      component: ControlesRegulatoriosSection,
      props: { data: empresa }
    },
    {
      id: "documentacion",
      title: "Documentación",
      component: DocumentacionSection,
      props: { data: empresa }
    },
    {
      id: "resumen",
      title: "Resumen ejecutivo regulatorio",
      component: ResumenEjecutivoSection,
      props: { data: empresa }
    }
  ]

  // Configuración del sidebar
  const sidebarConfig: SidebarConfig = {
    quickActions: {
      title: "Acciones disponibles",
      actions: sidebarActions
    },
    relatedInfo: {
      title: "Representante legal",
      component: RepresentanteLegalCard,
      props: { data: formData }
    }
  }

  return (
    <>
      <DetailPageTemplate
        title={empresa.nombre}
        subtitle="Información detallada del proceso de verificación de la empresa"
        status={status}
        primaryActions={primaryActions}
        sections={sections}
        sidebarConfig={sidebarConfig}
      />

      {/* Modal de confirmación para cancelar edición */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Cancelar edición</CardTitle>
              <CardDescription>
                ¿Estás seguro de que quieres cancelar los cambios? Se perderán todas las modificaciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={() => setIsEditing(false)} className="flex-1">
                Continuar editando
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
