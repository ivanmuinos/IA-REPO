# 📋 Documentación Técnica - Guardline Platform

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

- **Frontend**: Next.js 15.2.4 (App Router)
- **UI Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Flow Editor**: ReactFlow

### Patrones de Arquitectura

#### 1. Componentes Funcionales
```typescript
// Ejemplo de componente funcional
export function PersonaCard({ persona, onEdit }: PersonaCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleEdit = async () => {
    setIsLoading(true)
    try {
      await onEdit(persona)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{persona.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleEdit} disabled={isLoading}>
          {isLoading ? "Editando..." : "Editar"}
        </Button>
      </CardContent>
    </Card>
  )
}
```

#### 2. Servicios de Negocio
```typescript
// Ejemplo de servicio
export class PersonasService {
  private supabase: SupabaseClient
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  async getPersonas(): Promise<Persona[]> {
    const { data, error } = await this.supabase
      .from('personas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}
```

#### 3. Validación con Zod
```typescript
// Ejemplo de schema de validación
export const PersonaSchema = z.object({
  nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  dni: z.string().regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos"),
  estado: z.enum(["pendiente", "verificado", "rechazado"])
})

export type PersonaFormData = z.infer<typeof PersonaSchema>
```

## 🎨 Sistema de Componentes

### Jerarquía de Componentes

```
components/
├── ui/                    # Componentes base (shadcn/ui)
│   ├── button.tsx        # Botón base
│   ├── card.tsx          # Card base
│   ├── input.tsx         # Input base
│   └── ...
├── flow-editor/          # Componentes específicos del editor
│   ├── flow-canvas.tsx   # Canvas principal
│   ├── flow-blocks.tsx   # Bloques de flujo
│   └── flow-properties.tsx # Panel de propiedades
├── configuracion/        # Componentes de configuración
└── [otros]/              # Componentes específicos
```

### Componentes de Usabilidad (Nielsen Heuristics)

#### 1. LoadingButton
```typescript
interface LoadingButtonProps {
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
  // ... otras props de Button
}

export function LoadingButton({ 
  loading, 
  loadingText = "Cargando...", 
  children, 
  ...props 
}: LoadingButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {loading ? loadingText : children}
    </Button>
  )
}
```

#### 2. ValidatedInput
```typescript
interface ValidatedInputProps {
  value: string
  onChange: (value: string) => void
  onValidation?: (isValid: boolean, message?: string) => void
  rules?: ValidationRule[]
  required?: boolean
}

export function ValidatedInput({ 
  value, 
  onChange, 
  onValidation, 
  rules = [], 
  required = false 
}: ValidatedInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string>("")
  
  // Lógica de validación en tiempo real
  // ...
}
```

## 🔧 APIs y Endpoints

### Supabase Tables

#### 1. Personas
```sql
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  datos_adicionales JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Flujos
```sql
CREATE TABLE flujos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL,
  estado VARCHAR(50) DEFAULT 'borrador',
  configuracion JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Pasos de Flujo
```sql
CREATE TABLE pasos_flujo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flujo_id UUID REFERENCES flujos(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  posicion_x INTEGER NOT NULL,
  posicion_y INTEGER NOT NULL,
  configuracion JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### RPC Functions

#### 1. Validar Persona
```sql
CREATE OR REPLACE FUNCTION validar_persona(
  persona_id UUID,
  nuevo_estado VARCHAR(50)
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE personas 
  SET estado = nuevo_estado, updated_at = NOW()
  WHERE id = persona_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

#### 2. Obtener Métricas
```sql
CREATE OR REPLACE FUNCTION obtener_metricas_generales()
RETURNS TABLE (
  total_personas BIGINT,
  personas_verificadas BIGINT,
  personas_pendientes BIGINT,
  flujos_activos BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_personas,
    COUNT(*) FILTER (WHERE estado = 'verificado') as personas_verificadas,
    COUNT(*) FILTER (WHERE estado = 'pendiente') as personas_pendientes,
    (SELECT COUNT(*) FROM flujos WHERE estado = 'activo') as flujos_activos
  FROM personas;
END;
$$ LANGUAGE plpgsql;
```

## 🔐 Autenticación y Autorización

### Supabase Auth

```typescript
// Configuración de autenticación
export const authConfig = {
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      wellKnown: 'https://accounts.google.com/.well-known/openid_configuration',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  }
}
```

### Roles y Permisos

```typescript
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

export const permissions = {
  [UserRole.ADMIN]: ['*'],
  [UserRole.MANAGER]: ['read', 'write', 'approve'],
  [UserRole.OPERATOR]: ['read', 'write'],
  [UserRole.VIEWER]: ['read']
} as const
```

## 📊 Estado y Gestión de Datos

### React Query Setup

```typescript
// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

// Custom hooks para queries
export function usePersonas() {
  return useQuery({
    queryKey: ['personas'],
    queryFn: () => personasService.getPersonas(),
  })
}

export function useCreatePersona() {
  return useMutation({
    mutationFn: (data: PersonaFormData) => personasService.createPersona(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
    },
  })
}
```

### Zustand Store

```typescript
interface AppState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  notifications: Notification[]
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (notification) => 
    set((state) => ({ notifications: [...state.notifications, notification] })),
  removeNotification: (id) => 
    set((state) => ({ 
      notifications: state.notifications.filter(n => n.id !== id) 
    })),
}))
```

## 🎯 Editor de Flujos

### ReactFlow Configuration

```typescript
// Configuración del editor
export const flowConfig = {
  nodeTypes: {
    start: StartNode,
    process: ProcessNode,
    decision: DecisionNode,
    end: EndNode,
  },
  edgeTypes: {
    default: DefaultEdge,
    conditional: ConditionalEdge,
  },
  defaultEdgeOptions: {
    type: 'default',
    animated: true,
  },
  connectionMode: ConnectionMode.Loose,
  snapToGrid: true,
  snapGrid: [15, 15],
}

// Custom nodes
export function StartNode({ data }: NodeProps) {
  return (
    <div className="start-node">
      <div className="node-header">Inicio</div>
      <div className="node-content">{data.label}</div>
    </div>
  )
}
```

### Validación de Flujos

```typescript
export function validateFlow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Verificar nodo de inicio
  const startNodes = nodes.filter(node => node.type === 'start')
  if (startNodes.length === 0) {
    errors.push('El flujo debe tener un nodo de inicio')
  } else if (startNodes.length > 1) {
    errors.push('El flujo solo puede tener un nodo de inicio')
  }
  
  // Verificar nodo de fin
  const endNodes = nodes.filter(node => node.type === 'end')
  if (endNodes.length === 0) {
    errors.push('El flujo debe tener al menos un nodo de fin')
  }
  
  // Verificar conexiones
  const disconnectedNodes = nodes.filter(node => {
    const hasIncoming = edges.some(edge => edge.target === node.id)
    const hasOutgoing = edges.some(edge => edge.source === node.id)
    return !hasIncoming && !hasOutgoing
  })
  
  if (disconnectedNodes.length > 0) {
    warnings.push(`Hay ${disconnectedNodes.length} nodos sin conectar`)
  }
  
  return { errors, warnings, isValid: errors.length === 0 }
}
```

## 🔧 Configuraciones Importantes

### Tailwind CSS

```typescript
// tailwind.config.ts
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... más colores
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Next.js Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
}

export default nextConfig
```

## 📈 Performance y Optimización

### Code Splitting

```typescript
// Lazy loading de componentes pesados
const FlowEditor = lazy(() => import('@/components/flow-editor/FlowEditor'))
const MetricsChart = lazy(() => import('@/components/MetricsChart'))

// Suspense boundaries
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
```

### Image Optimization

```typescript
// Optimización de imágenes
import Image from 'next/image'

export function OptimizedImage({ src, alt, ...props }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
      {...props}
    />
  )
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// __tests__/PersonasService.test.ts
import { PersonasService } from '@/lib/personas-service'

describe('PersonasService', () => {
  let service: PersonasService
  
  beforeEach(() => {
    service = new PersonasService()
  })
  
  it('should create a new persona', async () => {
    const personaData = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678'
    }
    
    const result = await service.createPersona(personaData)
    
    expect(result).toHaveProperty('id')
    expect(result.nombre).toBe(personaData.nombre)
  })
})
```

### Integration Tests

```typescript
// __tests__/integration/personas.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PersonasList } from '@/components/personas-list'

describe('PersonasList Integration', () => {
  it('should display personas and handle search', async () => {
    render(<PersonasList />)
    
    // Esperar a que carguen los datos
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    })
    
    // Probar búsqueda
    const searchInput = screen.getByPlaceholderText('Buscar personas...')
    fireEvent.change(searchInput, { target: { value: 'Juan' } })
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
      expect(screen.queryByText('María García')).not.toBeInTheDocument()
    })
  })
})
```

## 🔍 Debugging y Monitoreo

### Error Boundaries

```typescript
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Enviar a servicio de monitoreo
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Hemos detectado un error y lo estamos investigando.</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### Performance Monitoring

```typescript
// hooks/usePerformance.ts
export function usePerformance() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.startTime}ms`)
          
          // Enviar métricas a servicio de monitoreo
          if (entry.name === 'LCP') {
            // Largest Contentful Paint
            analytics.track('performance.lcp', { value: entry.startTime })
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
      
      return () => observer.disconnect()
    }
  }, [])
}
```

---

**Documentación generada**: $(date)  
**Versión**: 1.0.0  
**Mantenido por**: Equipo Guardline 