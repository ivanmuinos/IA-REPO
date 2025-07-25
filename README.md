# 🛡️ Guardline Platform

Plataforma de gestión de flujos de onboarding con verificación de identidad y cumplimiento normativo.

## 🚀 Quick Start

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd KYx-Platform

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
pnpm dev
```

### Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo (localhost:3000)
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linting con ESLint
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
KYx Platform/
├── app/                    # Next.js App Router
│   ├── conectores/         # Gestión de conectores e integraciones
│   ├── configuracion/      # Configuración del sistema
│   ├── editor-flujo/       # Editor visual de flujos
│   ├── flujos/            # Gestión de flujos de onboarding
│   ├── juridico/          # Entidades jurídicas y compliance
│   ├── metricas/          # Analytics y reportes
│   ├── personas/          # Gestión de usuarios/personas
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard principal
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base (shadcn/ui)
│   ├── flow-editor/      # Componentes específicos del editor
│   ├── configuracion/    # Componentes de configuración
│   └── [otros]/          # Componentes específicos de funcionalidad
├── lib/                  # Servicios y utilidades
│   ├── validation/       # Validaciones y schemas
│   ├── flow-service.ts   # Servicio de gestión de flujos
│   ├── personas-service.ts # Servicio de gestión de personas
│   ├── supabase.ts       # Configuración de Supabase
│   └── utils.ts          # Utilidades generales
├── hooks/                # Custom React hooks
├── types/                # Definiciones TypeScript
├── public/               # Assets estáticos
└── styles/               # Estilos adicionales
```

## 🎨 Sistema de Diseño

### Componentes UI
El proyecto utiliza **shadcn/ui** como base de componentes con personalizaciones específicas:

- **Componentes Base**: Button, Card, Input, Select, etc.
- **Componentes de Usabilidad**: Implementación de las 10 heurísticas de Nielsen
- **Componentes de Flujo**: Editor visual, bloques, canvas
- **Componentes de Negocio**: Listas, modales, formularios específicos

### Heurísticas de Nielsen Implementadas

1. **Visibilidad del Estado del Sistema**
   - Indicadores de carga (`LoadingButton`, `ProgressBar`)
   - Estados del sistema (`SystemStatusIndicator`)
   - Feedback visual (`ActionFeedback`)

2. **Prevención de Errores**
   - Validación en tiempo real (`ValidatedInput`)
   - Campos requeridos (`RequiredField`)
   - Confirmaciones para acciones destructivas

3. **Ayuda a Reconocer Errores**
   - Mensajes específicos (`ErrorMessage`)
   - Sugerencias de corrección
   - Hook de manejo de errores (`useErrorHandler`)

4. **Reconocimiento vs Recordar**
   - Tooltips contextuales (`HelpTooltip`)
   - Historial de elementos (`RecentItems`)
   - Autocompletado (`SearchWithAutocomplete`)

5. **Control y Libertad del Usuario**
   - Botones de cancelar (`CancelButton`)
   - Funcionalidad deshacer (`UndoAction`)
   - Navegación con breadcrumbs (`BreadcrumbNav`)

6. **Flexibilidad y Eficiencia**
   - Atajos de teclado (`useKeyboardShortcuts`)
   - Acciones en lote (`BatchSelector`)
   - Búsqueda avanzada (`AdvancedSearch`)

7. **Diseño Estético Minimalista**
   - Espacios generosos (`SpaciousContainer`)
   - Jerarquía visual (`VisualHierarchy`)
   - Componentes limpios (`MinimalCard`)

8. **Ayuda y Documentación**
   - Centro de ayuda (`HelpCenter`)
   - Guías paso a paso (`StepByStepGuide`)
   - FAQ interactivo (`FAQ`)

## 🔧 Configuración

### Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=Guardline
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Configuración de Tailwind CSS

El proyecto usa Tailwind CSS con configuración personalizada en `tailwind.config.ts`:

- Colores del tema personalizados
- Animaciones personalizadas
- Breakpoints responsivos
- Plugins adicionales

## 📊 Funcionalidades Principales

### 1. Gestión de Flujos
- **Editor Visual**: Drag & drop de bloques
- **Validación**: Verificación de flujos completos
- **Templates**: Flujos predefinidos
- **Versionado**: Control de versiones de flujos

### 2. Gestión de Personas
- **Verificación de Identidad**: KYC/AML
- **Estados**: Tracking de progreso
- **Documentos**: Gestión de archivos
- **Historial**: Auditoría completa

### 3. Entidades Jurídicas
- **Empresas**: Gestión de entidades
- **Compliance**: Verificación normativa
- **Aprobaciones**: Workflow de aprobación
- **Reportes**: Documentación legal

### 4. Métricas y Analytics
- **Dashboard**: KPIs principales
- **Reportes**: Exportación de datos
- **Tendencias**: Análisis temporal
- **Alertas**: Notificaciones automáticas

### 5. Conectores e Integraciones
- **APIs**: Conexiones externas
- **Webhooks**: Notificaciones
- **Sincronización**: Datos en tiempo real
- **Monitoreo**: Estado de conectores

## 🛠️ Desarrollo

### Patrones de Diseño

1. **Componentes Funcionales**: React hooks y composición
2. **Servicios**: Separación de lógica de negocio
3. **Validación**: Zod schemas para type safety
4. **Estado**: React Query para server state
5. **UI**: shadcn/ui para consistencia

### Convenciones de Código

- **TypeScript**: Tipado estricto
- **ESLint**: Linting automático
- **Prettier**: Formateo de código
- **Conventional Commits**: Mensajes de commit

### Testing

```bash
# Ejecutar tests
pnpm test

# Tests de integración
pnpm test:integration

# Coverage
pnpm test:coverage
```

## 🚀 Deployment

### Build de Producción

```bash
# Build optimizado
pnpm build

# Verificar build
pnpm start
```

### Variables de Entorno de Producción

```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=prod_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_key
```

## 📈 Monitoreo y Mantenimiento

### Logs
- **Aplicación**: Console logs estructurados
- **Errores**: Error tracking con contexto
- **Performance**: Métricas de rendimiento

### Backup
- **Base de datos**: Backup automático en Supabase
- **Archivos**: Storage redundante
- **Configuración**: Versionado en Git

## 🔒 Seguridad

- **Autenticación**: Supabase Auth
- **Autorización**: Roles y permisos
- **Validación**: Input sanitization
- **Auditoría**: Logs de seguridad

## 📞 Soporte

### Documentación Adicional
- `DESIGN_SYSTEM.md` - Guía del sistema de diseño
- `SCROLL_CORRECTIONS.md` - Correcciones de navegación
- `CARD_SYSTEM_GUIDE.md` - Guía de componentes de cards

### Contacto
- **Desarrollo**: Equipo técnico
- **Soporte**: help@guardline.com
- **Documentación**: docs.guardline.com

---

**Versión**: 1.0.0  
**Última actualización**: $(date)  
**Mantenido por**: Equipo Guardline
