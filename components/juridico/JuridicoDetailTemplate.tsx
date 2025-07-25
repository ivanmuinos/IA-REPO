import React from "react"
import { CheckCircle, Edit, Building, Users, FileText, Shield } from "lucide-react"
import { DetailPageTemplate, SectionConfig, SidebarConfig } from "@/components/templates/DetailPageTemplate"
import { ActionConfig, StatusConfig } from "@/components/shared/PageHeader/UnifiedPageHeader"
import { SectionCard } from "@/components/shared/Sections/SectionCard"
import { InfoField } from "@/components/ui/info-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Componentes de sección específicos para KYB
const InformacionGeneralSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Información general" description="Datos básicos de la empresa" icon={Building}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoField label="Razón social" value={data.razonSocial} />
      <InfoField label="CIF/NIF" value={data.cif} className="font-mono" />
      <InfoField label="Fecha de constitución" value={data.fechaConstitucion} />
      <InfoField label="Forma jurídica" value={data.formaJuridica} />
      <InfoField label="Domicilio social" value={data.domicilio} />
      <InfoField label="Código postal" value={data.codigoPostal} />
    </div>
  </SectionCard>
)

const ActividadEconomicaSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Actividad económica" description="Información sobre el negocio" icon={Building}>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="CNAE principal" value={data.cnaePrincipal} />
        <InfoField label="Descripción CNAE" value={data.descripcionCnae} />
        <InfoField label="Sector económico" value={data.sectorEconomico} />
        <InfoField label="Actividad principal" value={data.actividadPrincipal} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Estado de actividad:</span>
        <Badge variant="success">{data.estadoActividad}</Badge>
      </div>
    </div>
  </SectionCard>
)

const RepresentantesSociosSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Representantes y socios" description="Información de personas clave" icon={Users}>
    <div className="space-y-4">
      {data.representantes?.map((rep: any, index: number) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Nombre" value={rep.nombre} />
            <InfoField label="Cargo" value={rep.cargo} />
            <InfoField label="DNI/NIE" value={rep.documento} className="font-mono" />
            <InfoField label="Porcentaje participación" value={`${rep.participacion}%`} />
          </div>
        </div>
      ))}
    </div>
  </SectionCard>
)

const ControlesRegulatoriosSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Controles regulatorios" description="Evaluación de compliance" icon={Shield}>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">PEP:</span>
          <Badge variant={data.esPEP ? "destructive" : "success"}>
            {data.esPEP ? "Sí" : "No"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sanción:</span>
          <Badge variant={data.tieneSancion ? "destructive" : "success"}>
            {data.tieneSancion ? "Sí" : "No"}
          </Badge>
        </div>
      </div>
      <InfoField label="Observaciones" value={data.observaciones} />
    </div>
  </SectionCard>
)

const DocumentacionSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Documentación" description="Documentos presentados" icon={FileText}>
    <div className="space-y-4">
      {data.documentos?.map((doc: any, index: number) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">{doc.nombre}</p>
            <p className="text-sm text-muted-foreground">{doc.descripcion}</p>
          </div>
          <Badge variant={doc.estado === "Aprobado" ? "success" : "outline"}>
            {doc.estado}
          </Badge>
        </div>
      ))}
    </div>
  </SectionCard>
)

const ResumenEjecutivoSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard title="Resumen ejecutivo regulatorio" description="Evaluación final" icon={CheckCircle}>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Riesgo regulatorio:</span>
          <Badge variant={data.riesgoRegulatorio === "Bajo" ? "success" : "destructive"}>
            {data.riesgoRegulatorio}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Recomendación:</span>
          <Badge variant={data.recomendacion === "Aprobar" ? "success" : "destructive"}>
            {data.recomendacion}
          </Badge>
        </div>
      </div>
      <InfoField label="Justificación" value={data.justificacion} />
    </div>
  </SectionCard>
)

// Componente para el representante legal en el sidebar
const RepresentanteLegalCard: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-primary" />
      <span className="font-medium">{data.nombre}</span>
    </div>
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-muted-foreground">Cargo:</span>
        <p className="font-medium">{data.cargo}</p>
      </div>
      <div>
        <span className="text-muted-foreground">DNI/NIE:</span>
        <p className="font-mono">{data.documento}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Participación:</span>
        <p className="font-medium">{data.participacion}%</p>
      </div>
    </div>
  </div>
)

interface JuridicoDetailTemplateProps {
  empresa: any // Tipo específico de empresa
  onCompletar?: () => void
  onEditar?: () => void
}

export const JuridicoDetailTemplate: React.FC<JuridicoDetailTemplateProps> = ({
  empresa,
  onCompletar,
  onEditar
}) => {
  // Configuración del header
  const status: StatusConfig = {
    value: "Completado",
    variant: "success"
  }

  const primaryActions: ActionConfig[] = [
    {
      label: "Completar",
      variant: "default",
      icon: CheckCircle,
      onClick: onCompletar
    },
    {
      label: "Editar información",
      variant: "outline",
      icon: Edit,
      onClick: onEditar
    }
  ]

  // Configuración de secciones (sin tabs - secuencial)
  const sections: SectionConfig[] = [
    {
      id: "general",
      title: "Información general",
      component: InformacionGeneralSection,
      props: { data: empresa.informacion }
    },
    {
      id: "actividad",
      title: "Actividad económica",
      component: ActividadEconomicaSection,
      props: { data: empresa.actividad }
    },
    {
      id: "representantes",
      title: "Representantes y socios",
      component: RepresentantesSociosSection,
      props: { data: empresa.representantes }
    },
    {
      id: "controles",
      title: "Controles regulatorios",
      component: ControlesRegulatoriosSection,
      props: { data: empresa.controles }
    },
    {
      id: "documentacion",
      title: "Documentación",
      component: DocumentacionSection,
      props: { data: empresa.documentacion }
    },
    {
      id: "resumen",
      title: "Resumen ejecutivo regulatorio",
      component: ResumenEjecutivoSection,
      props: { data: empresa.resumen }
    }
  ]

  // Configuración del sidebar
  const sidebarConfig: SidebarConfig = {
    relatedInfo: {
      title: "Representante legal",
      component: RepresentanteLegalCard,
      props: { data: empresa.representanteLegal }
    }
  }

  return (
    <DetailPageTemplate
      title={empresa.nombre}
      subtitle="Información detallada del proceso de verificación de la empresa"
      status={status}
      primaryActions={primaryActions}
      sections={sections}
      sidebarConfig={sidebarConfig}
    />
  )
} 