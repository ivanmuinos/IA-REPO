import React, { useState } from "react"
import { CheckCircle, XCircle, Download, ThumbsUp, ThumbsDown } from "lucide-react"
import { DetailPageTemplate, SectionConfig, SidebarConfig } from "@/components/templates/DetailPageTemplate"
import { ActionConfig, StatusConfig, TabConfig } from "@/components/shared/PageHeader/UnifiedPageHeader"
import { SectionCard } from "@/components/shared/Sections/SectionCard"
import { InfoField } from "@/components/ui/info-field"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Componentes de sección específicos para KYC
const DocumentoIdentidadSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Documento de identidad" description="Resultados del procesamiento OCR" icon={CheckCircle}>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoField label="Nombre" value={data.nombre} />
          <InfoField label="Apellidos" value={data.apellidos} />
          <InfoField label="Documento" value={data.documento} className="font-mono" />
          <InfoField label="Tipo de documento" value={data.tipoDocumento} />
        </div>
      </div>
    </div>
  </SectionCard>
)

const PerfilRiesgoSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Perfil de riesgo" description="Evaluación de riesgo y compliance" icon={CheckCircle}>
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Nivel de riesgo:</span>
        <Badge variant="outline">{data.nivelRiesgo}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Compliance:</span>
        <Badge variant="success">{data.compliance}</Badge>
      </div>
    </div>
  </SectionCard>
)

const CronologiaSection: React.FC<{ events: any[] }> = ({ events }) => (
  <SectionCard title="Cronología del flujo" description="Historial de eventos del proceso" icon={CheckCircle}>
    <div className="space-y-4">
      {events?.map((event, index) => (
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

interface PersonaDetailTemplateProps {
  persona: any // Tipo específico de persona
  onApprove?: () => void
  onReject?: () => void
  onExport?: () => void
}

export const PersonaDetailTemplate: React.FC<PersonaDetailTemplateProps> = ({
  persona,
  onApprove,
  onReject,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState("detalles")

  // Configuración del header
  const status: StatusConfig = {
    value: persona.progreso,
    label: "Progreso",
    variant: "success"
  }

  const primaryActions: ActionConfig[] = [
    {
      label: "Aprobar verificación",
      variant: "default",
      icon: ThumbsUp,
      onClick: onApprove
    },
    {
      label: "Rechazar verificación",
      variant: "destructive",
      icon: ThumbsDown,
      onClick: onReject
    }
  ]

  const tabs: TabConfig[] = [
    { id: "detalles", label: "Detalles de onboarding" },
    { id: "cronologia", label: "Cronología del flujo" },
    { id: "gestion", label: "Gestión de analista" },
    { id: "historial", label: "Historial de actividad" }
  ]

  // Configuración de secciones
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
      props: { data: persona.perfilRiesgo }
    },
    {
      id: "cronologia-events",
      title: "Cronología",
      component: CronologiaSection,
      props: { events: persona.cronologia }
    }
  ]

  // Configuración del sidebar
  const sidebarConfig: SidebarConfig = {
    quickActions: {
      title: "Acciones disponibles",
      actions: [
        {
          label: "Aprobar verificación",
          variant: "default",
          icon: ThumbsUp,
          onClick: onApprove
        },
        {
          label: "Rechazar verificación",
          variant: "destructive",
          icon: ThumbsDown,
          onClick: onReject
        },
        {
          label: "Exportar datos JSON",
          variant: "outline",
          icon: Download,
          onClick: onExport
        }
      ]
    },
    summary: {
      title: "Información general",
      data: [
        { label: "Progreso", value: persona.progreso, type: "progress" },
        { label: "Estado actual", value: persona.estado, type: "badge" },
        { label: "Flujo", value: persona.flujo, type: "badge", variant: "outline" },
        { label: "Documento", value: persona.documento, type: "text" },
        { label: "Email", value: persona.email, type: "email" },
        { label: "Teléfono", value: persona.telefono, type: "tel" },
        { label: "Fecha de inicio", value: persona.fecha, type: "text" }
      ]
    }
  }

  return (
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
  )
} 