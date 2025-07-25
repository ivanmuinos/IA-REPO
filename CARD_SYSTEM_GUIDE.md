# Sistema Unificado de Cards y Grid Layout - Guardline

## Descripción General

El sistema unificado de cards y grid layout de Guardline proporciona una estructura consistente y profesional para todas las secciones de contenido de la aplicación. Este sistema asegura coherencia visual, facilita el mantenimiento y mejora la experiencia de usuario.

## Componentes Principales

### 1. Sistema de Grid (`components/ui/grid-system.tsx`)

#### Componentes Base:
- **`Container`**: Contenedor principal con márgenes y padding consistentes
- **`Section`**: Sección de contenido con padding configurable
- **`SectionHeader`**: Encabezado de sección con título, subtítulo y descripción
- **`Grid`**: Grid base con diferentes configuraciones

#### Grids Especializados:
- **`MetricsGrid`**: Para cards de métricas (5 columnas responsivas)
- **`FeaturesGrid`**: Para cards de características (4 columnas responsivas)
- **`ProblemsGrid`**: Para cards de problemas (3 columnas responsivas)
- **`TestimonialsGrid`**: Para cards de testimonios (3 columnas responsivas)
- **`CountriesGrid`**: Para cards de países (5 columnas responsivas)

### 2. Sistema de Cards (`components/ui/card-system.tsx`)

#### Cards Especializadas:
- **`MetricCard`**: Para mostrar métricas y estadísticas
- **`FeatureCard`**: Para destacar funcionalidades
- **`ProblemCard`**: Para identificar desafíos
- **`TestimonialCard`**: Para mostrar feedback de clientes
- **`CountryCard`**: Para mostrar cobertura geográfica

#### Componentes de Card Base:
- **`Card`**: Card base con soporte para badges e iconos
- **`CardHeader`**: Encabezado de card
- **`CardBody`**: Cuerpo de card
- **`CardTitle`**: Título de card
- **`CardDescription`**: Descripción de card
- **`CardFooter`**: Pie de card

## Uso Básico

### Estructura de Página Estándar

```tsx
import { Container, Section, SectionHeader } from "@/components/ui/grid-system"
import { MetricCard } from "@/components/ui/card-system"

export default function MiPagina() {
  return (
    <Container>
      <PageHeader
        title="Título de la Página"
        description="Descripción de la página"
      />
      
      <Section>
        <SectionHeader 
          title="Métricas Principales" 
          description="Indicadores clave de rendimiento"
        />
        <MetricsGrid>
          <MetricCard
            number="2,847"
            label="Personas verificadas"
            description="+12% vs mes anterior"
            trend={{ value: "+12%", isPositive: true }}
            icon={<Users className="h-6 w-6" />}
          />
          {/* Más MetricCards... */}
        </MetricsGrid>
      </Section>
    </Container>
  )
}
```

### Cards con Badges e Iconos

```tsx
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "@/components/ui/card-system"

<Card 
  badge={{ text: "Nuevo", variant: "success" }} 
  icon={<Star className="h-6 w-6" />}
>
  <CardHeader>
    <CardTitle>Título de la Card</CardTitle>
    <CardDescription>Descripción de la card</CardDescription>
  </CardHeader>
  <CardBody>
    <p>Contenido de la card</p>
  </CardBody>
</Card>
```

## Tipos de Grid Disponibles

### Grid Base
```tsx
<Grid type="2" gap="md">  // 2 columnas, gap medio
<Grid type="3" gap="lg">  // 3 columnas, gap grande
<Grid type="4" gap="sm">  // 4 columnas, gap pequeño
<Grid type="auto">        // Auto-ajuste responsivo
```

### Grids Especializados
```tsx
<MetricsGrid>      // 5 columnas para métricas
<FeaturesGrid>     // 4 columnas para características
<ProblemsGrid>     // 3 columnas para problemas
<TestimonialsGrid> // 3 columnas para testimonios
<CountriesGrid>    // 5 columnas para países
```

## Props de Cards Especializadas

### MetricCard
```tsx
interface MetricCardProps {
  number: string | number
  label: string
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
}
```

### FeatureCard
```tsx
interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'destructive'
  }
  className?: string
}
```

### ProblemCard
```tsx
interface ProblemCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
}
```

### TestimonialCard
```tsx
interface TestimonialCardProps {
  quote: string
  author: {
    name: string
    role: string
    company?: string
  }
  className?: string
}
```

### CountryCard
```tsx
interface CountryCardProps {
  flag: string
  name: string
  regulator: string
  className?: string
}
```

## Configuración de Secciones

### Section Props
```tsx
interface SectionProps {
  className?: string
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'  // sm: py-8, md: py-12, lg: py-20
}
```

### SectionHeader Props
```tsx
interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
  centered?: boolean  // Por defecto: true
}
```

### Container Props
```tsx
interface ContainerProps {
  className?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  // sm: max-w-3xl, md: max-w-4xl, lg: max-w-6xl, xl: max-w-7xl, full: max-w-full
}
```

## Responsive Design

El sistema está diseñado para ser completamente responsivo:

- **Mobile**: 1 columna
- **Tablet**: 2-3 columnas
- **Desktop**: 3-5 columnas según el tipo de grid

### Breakpoints Utilizados
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

## Gaps Disponibles

- **`sm`**: `gap-4` (16px)
- **`md`**: `gap-8` (32px) - Por defecto
- **`lg`**: `gap-12` (48px)

## Variantes de Badge

- **`default`**: Badge estándar
- **`success`**: Verde para éxito
- **`warning`**: Amarillo para advertencias
- **`destructive`**: Rojo para errores

## Ejemplos de Implementación

### Página de Métricas
```tsx
<Container>
  <PageHeader title="Métricas" description="Indicadores de rendimiento" />
  
  <Section>
    <SectionHeader title="Métricas Generales" />
    <MetricsGrid>
      <MetricCard number="1,284" label="Usuarios" trend={{ value: "+12%", isPositive: true }} />
      <MetricCard number="94.2%" label="Tasa de éxito" trend={{ value: "+2.1%", isPositive: true }} />
      {/* ... */}
    </MetricsGrid>
  </Section>
</Container>
```

### Página de Características
```tsx
<Container>
  <PageHeader title="Características" description="Funcionalidades disponibles" />
  
  <Section>
    <SectionHeader title="Funcionalidades Principales" />
    <FeaturesGrid>
      <FeatureCard 
        title="Verificación Biométrica"
        description="Sistema avanzado de reconocimiento facial"
        icon={<Shield className="h-8 w-8" />}
        badge={{ text: "Nuevo", variant: "success" }}
      />
      {/* ... */}
    </FeaturesGrid>
  </Section>
</Container>
```

## Mejores Prácticas

1. **Siempre usar Container**: Envuelve toda la página en un `Container`
2. **Organizar en Secciones**: Usa `Section` para agrupar contenido relacionado
3. **Usar SectionHeader**: Proporciona contexto y estructura
4. **Elegir el Grid correcto**: Usa grids especializados cuando sea posible
5. **Mantener consistencia**: Usa los mismos tipos de cards en contextos similares
6. **Responsive first**: El sistema es responsivo por defecto, no necesitas configuraciones adicionales

## Migración de Código Existente

### Antes (Código Antiguo)
```tsx
<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <StatCard title="Usuarios" value="1,234" />
  </div>
</div>
```

### Después (Sistema Unificado)
```tsx
<Container>
  <Section>
    <SectionHeader title="Métricas" />
    <MetricsGrid>
      <MetricCard number="1,234" label="Usuarios" />
    </MetricsGrid>
  </Section>
</Container>
```

## Página de Demostración

Visita `/demo-cards` para ver todos los tipos de cards y grids en acción.

## Soporte

Para dudas o problemas con el sistema de cards y grid, consulta:
1. Este documento
2. La página de demostración (`/demo-cards`)
3. Los archivos de implementación en `components/ui/card-system.tsx` y `components/ui/grid-system.tsx` 