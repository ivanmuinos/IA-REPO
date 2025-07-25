# Guía de Homogeneización de Layout KYC/KYB

## Resumen Ejecutivo

Este documento describe el sistema unificado de layout para las páginas de detalle de KYC (personas) y KYB (jurídico), que elimina inconsistencias y mejora la experiencia de usuario.

## Arquitectura del Sistema

### Componentes Base

```
components/
├── shared/
│   ├── PageHeader/
│   │   └── UnifiedPageHeader.tsx      # Header unificado con título, estado y acciones
│   └── Sections/
│       └── SectionCard.tsx            # Componente base para secciones
├── templates/
│   ├── DetailPageTemplate.tsx         # Template principal unificado
│   └── DetailSidebar.tsx              # Sidebar unificado
└── [module]/
    └── [Module]DetailTemplate.tsx     # Implementación específica del módulo
```

### Interfaces Principales

```typescript
// Configuración del header
interface UnifiedPageHeaderProps {
  title: string
  subtitle?: string
  status?: StatusConfig
  primaryActions: ActionConfig[]
  tabs?: TabConfig[]
  onTabChange?: (value: string) => void
  activeTab?: string
}

// Configuración del template
interface DetailPageTemplateProps {
  title: string
  subtitle?: string
  status?: StatusConfig
  primaryActions: ActionConfig[]
  tabs?: TabConfig[]
  sections: SectionConfig[]
  sidebarConfig: SidebarConfig
  activeTab?: string
  onTabChange?: (value: string) => void
}
```

## Patrones de Implementación

### 1. Módulo con Tabs (KYC - Personas)

```typescript
// PersonaDetailTemplate.tsx
export const PersonaDetailTemplate = ({ persona, onApprove, onReject }) => {
  const [activeTab, setActiveTab] = useState("detalles")

  const tabs: TabConfig[] = [
    { id: "detalles", label: "Detalles de onboarding" },
    { id: "cronologia", label: "Cronología del flujo" },
    { id: "gestion", label: "Gestión de analista" },
    { id: "historial", label: "Historial de actividad" }
  ]

  const sections: SectionConfig[] = [
    {
      id: "detalles-documento",
      component: DocumentoIdentidadSection,
      props: { data: persona.datosOCR }
    },
    // ... más secciones
  ]

  return (
    <DetailPageTemplate
      title={persona.nombre}
      subtitle="Detalles del proceso de onboarding"
      status={{ value: persona.progreso, label: "Progreso" }}
      primaryActions={[
        { label: "Aprobar", icon: ThumbsUp, onClick: onApprove },
        { label: "Rechazar", icon: ThumbsDown, onClick: onReject }
      ]}
      tabs={tabs}
      sections={sections}
      sidebarConfig={sidebarConfig}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}
```

### 2. Módulo sin Tabs (KYB - Jurídico)

```typescript
// JuridicoDetailTemplate.tsx
export const JuridicoDetailTemplate = ({ empresa, onCompletar, onEditar }) => {
  const sections: SectionConfig[] = [
    {
      id: "general",
      component: InformacionGeneralSection,
      props: { data: empresa.informacion }
    },
    {
      id: "actividad",
      component: ActividadEconomicaSection,
      props: { data: empresa.actividad }
    },
    // ... más secciones secuenciales
  ]

  return (
    <DetailPageTemplate
      title={empresa.nombre}
      subtitle="Información detallada del proceso de verificación"
      status={{ value: "Completado", variant: "success" }}
      primaryActions={[
        { label: "Completar", icon: CheckCircle, onClick: onCompletar },
        { label: "Editar", icon: Edit, onClick: onEditar }
      ]}
      sections={sections}
      sidebarConfig={sidebarConfig}
    />
  )
}
```

## Configuración del Sidebar

### Sidebar con Acciones y Resumen (KYC)

```typescript
const sidebarConfig: SidebarConfig = {
  quickActions: {
    title: "Acciones disponibles",
    actions: [
      { label: "Aprobar verificación", icon: ThumbsUp, onClick: onApprove },
      { label: "Rechazar verificación", icon: ThumbsDown, onClick: onReject },
      { label: "Exportar datos", icon: Download, onClick: onExport }
    ]
  },
  summary: {
    title: "Información general",
    data: [
      { label: "Progreso", value: persona.progreso, type: "progress" },
      { label: "Estado actual", value: persona.estado, type: "badge" },
      { label: "Email", value: persona.email, type: "email" }
    ]
  }
}
```

### Sidebar con Información Relacionada (KYB)

```typescript
const sidebarConfig: SidebarConfig = {
  relatedInfo: {
    title: "Representante legal",
    component: RepresentanteLegalCard,
    props: { data: empresa.representanteLegal }
  }
}
```

## Creación de Componentes de Sección

### Estructura Base

```typescript
const MiSeccionSection: React.FC<{ data: any }> = ({ data }) => (
  <SectionCard 
    title="Título de la sección" 
    description="Descripción opcional"
    icon={MiIcono}
  >
    {/* Contenido de la sección */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoField label="Campo 1" value={data.campo1} />
      <InfoField label="Campo 2" value={data.campo2} />
    </div>
  </SectionCard>
)
```

### Tipos de Contenido Soportados

```typescript
// En el sidebar summary
data: [
  { label: "Texto simple", value: "Valor", type: "text" },
  { label: "Email", value: "email@ejemplo.com", type: "email" },
  { label: "Teléfono", value: "+34 123 456 789", type: "tel" },
  { label: "Progreso", value: 75, type: "progress" },
  { label: "Estado", value: "Activo", type: "badge", variant: "success" }
]
```

## Migración de Páginas Existentes

### Paso 1: Crear el Template Específico

```bash
# Crear archivo para el módulo
touch components/[modulo]/[Modulo]DetailTemplate.tsx
```

### Paso 2: Definir las Secciones

```typescript
// Extraer componentes de sección del código existente
const SeccionExistente = ({ data }) => (
  <SectionCard title="Título" icon={Icono}>
    {/* Migrar contenido existente */}
  </SectionCard>
)
```

### Paso 3: Configurar el Template

```typescript
// Usar DetailPageTemplate con la configuración específica
return (
  <DetailPageTemplate
    title={entidad.nombre}
    subtitle="Descripción del proceso"
    status={statusConfig}
    primaryActions={actionsConfig}
    sections={sectionsConfig}
    sidebarConfig={sidebarConfig}
  />
)
```

### Paso 4: Actualizar la Página Principal

```typescript
// En la página existente
export default function EntidadDetailPage({ params }) {
  const entidad = useEntidadData(params.id)
  
  return (
    <EntidadDetailTemplate
      entidad={entidad}
      onAction1={handleAction1}
      onAction2={handleAction2}
    />
  )
}
```

## Beneficios del Sistema Unificado

### ✅ Consistencia Visual
- Headers idénticos en estructura y estilo
- Sidebars con patrones unificados
- Typography y spacing consistentes
- Button styles y estados uniformes

### ✅ Mantenibilidad
- Componentes reutilizables
- Props bien tipadas
- Lógica de negocio separada de presentación
- Fácil extensión para nuevos módulos

### ✅ Experiencia de Usuario
- Navegación más intuitiva
- Información más accesible
- Acciones más prominentes
- Consistencia entre módulos

### ✅ Performance
- Componentes optimizados
- Lazy loading de secciones
- Reutilización de código
- Menor bundle size

## Checklist de Implementación

### Antes de la Migración
- [ ] Analizar estructura actual de la página
- [ ] Identificar secciones y componentes
- [ ] Definir acciones principales
- [ ] Planificar configuración del sidebar

### Durante la Migración
- [ ] Crear template específico del módulo
- [ ] Migrar componentes de sección
- [ ] Configurar header y acciones
- [ ] Implementar sidebar apropiado

### Después de la Migración
- [ ] Verificar funcionalidad completa
- [ ] Validar consistencia visual
- [ ] Probar navegación y acciones
- [ ] Actualizar tests si es necesario

## Comandos Útiles

```bash
# Crear estructura de componentes
mkdir -p components/{shared/{PageHeader,Sections},templates}

# Generar template específico
touch components/[modulo]/[Modulo]DetailTemplate.tsx

# Verificar tipos TypeScript
npm run type-check

# Ejecutar tests
npm run test:unit
npm run test:e2e -- --spec="[modulo]-detail"
```

## Notas Importantes

1. **Preservar Lógica de Negocio**: Solo unificar elementos de presentación
2. **Flexibilidad**: El sistema soporta variaciones específicas por módulo
3. **Documentación**: Documentar decisiones de diseño para el equipo
4. **Testing**: Mantener cobertura de tests durante la migración

## Soporte y Contacto

Para dudas sobre la implementación del sistema unificado, consultar:
- Documentación de componentes en `components/`
- Ejemplos en `components/personas/` y `components/juridico/`
- Issues en el repositorio del proyecto 