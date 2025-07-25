# Sistema de Diseño KYx Platform

## Descripción General

El sistema de diseño de KYx Platform está basado en shadcn/ui y utiliza variables CSS personalizadas para mantener consistencia visual en toda la aplicación. El sistema incluye colores, tipografía, sombras, bordes redondeados y componentes reutilizables.

## Variables CSS Principales

### Colores Base

```css
:root {
  --background: #ffffff;
  --foreground: #333333;
  --card: #ffffff;
  --card-foreground: #333333;
  --popover: #ffffff;
  --popover-foreground: #333333;
  --primary: #1855a3;
  --primary-foreground: #ffffff;
  --secondary: #e8f0f8;
  --secondary-foreground: #3a4a5b;
  --muted: #f9fafb;
  --muted-foreground: #6b7280;
  --accent: #ddebf7;
  --accent-foreground: #12427e;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e5e7eb;
  --input: #e5e7eb;
  --ring: #1855a3;
}
```

### Colores de Gráficos

```css
--chart-1: #1855a3;
--chart-2: #4a7bbf;
--chart-3: #7ba1db;
--chart-4: #aec8f7;
--chart-5: #103d7a;
```

### Colores del Sidebar

```css
--sidebar: #f9fafb;
--sidebar-foreground: #333333;
--sidebar-primary: #1855a3;
--sidebar-primary-foreground: #ffffff;
--sidebar-accent: #ddebf7;
--sidebar-accent-foreground: #12427e;
--sidebar-border: #e5e7eb;
--sidebar-ring: #1855a3;
```

### Tipografía

```css
--font-sans: Inter, sans-serif;
--font-serif: Source Serif 4, serif;
--font-mono: JetBrains Mono, monospace;
```

### Sombras

```css
--shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
--shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
--shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
--shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
```

### Bordes Redondeados

```css
--radius: 0.375rem;
```

## Uso en Tailwind CSS

### Colores

```tsx
// Colores base
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-secondary text-secondary-foreground">Secondary</div>
<div className="bg-accent text-accent-foreground">Accent</div>
<div className="bg-destructive text-destructive-foreground">Destructive</div>

// Colores de gráficos
<div className="bg-chart-1">Chart Color 1</div>
<div className="bg-chart-2">Chart Color 2</div>
<div className="bg-chart-3">Chart Color 3</div>
<div className="bg-chart-4">Chart Color 4</div>
<div className="bg-chart-5">Chart Color 5</div>

// Colores del sidebar
<div className="bg-sidebar text-sidebar-foreground">Sidebar</div>
<div className="bg-sidebar-primary text-sidebar-primary-foreground">Sidebar Primary</div>
<div className="bg-sidebar-accent text-sidebar-accent-foreground">Sidebar Accent</div>
```

### Sombras

```tsx
<div className="shadow-2xs">Sombra muy pequeña</div>
<div className="shadow-xs">Sombra extra pequeña</div>
<div className="shadow-sm">Sombra pequeña</div>
<div className="shadow">Sombra por defecto</div>
<div className="shadow-md">Sombra media</div>
<div className="shadow-lg">Sombra grande</div>
<div className="shadow-xl">Sombra extra grande</div>
<div className="shadow-2xl">Sombra muy grande</div>
```

### Tipografía

```tsx
<p className="font-sans">Texto con Inter (por defecto)</p>
<p className="font-serif">Texto con Source Serif 4</p>
<p className="font-mono">Texto con JetBrains Mono</p>
```

### Bordes Redondeados

```tsx
<div className="rounded-sm">Borde muy pequeño</div>
<div className="rounded-md">Borde pequeño</div>
<div className="rounded-lg">Borde grande</div>
<div className="rounded-xl">Borde extra grande</div>
```

## Componentes con Variantes Personalizadas

### Badge

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
```

### Alert

```tsx
<Alert variant="default">Mensaje informativo</Alert>
<Alert variant="destructive">Mensaje de error</Alert>
<Alert variant="warning">Mensaje de advertencia</Alert>
```

## Modo Oscuro

El sistema incluye automáticamente variables para el modo oscuro:

```css
.dark {
  --background: #171717;
  --foreground: #e5e5e5;
  --primary: #4a85d9;
  --primary-foreground: #f0f5ff;
  /* ... más variables */
}
```

## Integración con shadcn/ui

El sistema está completamente integrado con shadcn/ui. Todos los componentes utilizan las variables CSS personalizadas:

- **Button**: Usa `--primary`, `--primary-foreground`, etc.
- **Card**: Usa `--card`, `--card-foreground`
- **Input**: Usa `--input`, `--border`
- **Dialog**: Usa `--popover`, `--popover-foreground`

## Componente de Demostración

Para ver todas las variables en acción, puedes usar el componente `DesignSystemDemo`:

```tsx
import { DesignSystemDemo } from "@/components/ui/design-system-demo"

export default function DemoPage() {
  return <DesignSystemDemo />
}
```

## Mejores Prácticas

1. **Usar variables CSS**: Siempre usa las variables CSS en lugar de colores hardcodeados
2. **Consistencia**: Mantén consistencia usando las clases de Tailwind definidas
3. **Accesibilidad**: Las variables están diseñadas para mantener buen contraste
4. **Modo oscuro**: El sistema maneja automáticamente el modo oscuro
5. **Componentes**: Usa los componentes de shadcn/ui que ya están configurados

## Personalización

Para personalizar el sistema:

1. Modifica las variables en `app/globals.css`
2. Actualiza `tailwind.config.ts` si agregas nuevas variables
3. Mantén la compatibilidad con shadcn/ui
4. Prueba en modo claro y oscuro

## Archivos de Configuración

- `app/globals.css`: Variables CSS principales
- `tailwind.config.ts`: Configuración de Tailwind CSS
- `components.json`: Configuración de shadcn/ui
- `components/ui/`: Componentes base del sistema 