# Guía de Espaciado - Onboarding Platform

## Estructura de Layout

### Alturas de Componentes
- **TopBar**: `h-16` (64px)
- **BreadcrumbNav**: `py-1.5` (6px arriba + 6px abajo = 12px total)
- **Sidebar**: Altura completa del viewport
- **Main Content**: Flex-1 con scroll interno

### Espaciado Consistente

#### 1. TopBar → BreadcrumbNav
- **TopBar**: Altura fija de 64px
- **Espaciado**: El BreadcrumbNav tiene `py-1.5` (6px arriba y abajo)
- **Total**: 64px + 12px = 76px de navegación superior

#### 2. BreadcrumbNav → Contenido Principal
- **BreadcrumbNav**: `py-1.5` (6px arriba y abajo)
- **Contenido**: `p-4 md:p-8 pt-6` (patrón estándar de páginas)
- **Espaciado**: Consistente con el patrón shadcn/ui

### Clases CSS Estándar

```css
/* Layout principal */
.layout-full-height {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* Contenedor principal */
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Contenido principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Área de scroll del contenido */
.main-content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Espaciado del breadcrumb */
.breadcrumb-spacing {
  padding-top: 12px;
  padding-bottom: 12px;
}
```

### Patrón de Páginas

```tsx
// Estructura estándar para todas las páginas
<div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
  <div className="flex items-center justify-between space-y-2">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{titulo}</h2>
      <p className="text-muted-foreground">{descripcion}</p>
    </div>
    <div className="flex items-center gap-2">
      {/* Acciones */}
    </div>
  </div>
  
  {/* Contenido principal */}
</div>
```

### Reglas de Espaciado

1. **TopBar**: Siempre `h-16` (64px)
2. **BreadcrumbNav**: Siempre `py-1.5` (6px arriba y abajo)
3. **Contenido de páginas**: `p-4 md:p-8 pt-4`
4. **Espaciado entre secciones**: `space-y-4` o `space-y-6`
5. **Espaciado entre elementos**: `gap-4` o `gap-6`

### Responsive Design

- **Mobile**: `p-4` (16px padding)
- **Tablet**: `md:p-8` (32px padding)
- **Desktop**: `lg:p-8` (32px padding)

### Scroll Margins

Para navegación interna considerando la navegación fija:
- **TopBar + BreadcrumbNav**: 96px total
- **Solo TopBar**: 80px
- **Elementos con scroll**: `scroll-margin-top: 96px`

### Ejemplos de Uso

#### Página de Lista
```tsx
<div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
  {/* Header de página */}
  <div className="flex items-center justify-between space-y-2">
    <h2 className="text-3xl font-bold tracking-tight">Título</h2>
    <div className="flex items-center gap-2">
      {/* Botones */}
    </div>
  </div>
  
  {/* Contenido */}
  <div className="space-y-4">
    {/* Cards, tablas, etc. */}
  </div>
</div>
```

#### Página de Detalle
```tsx
<div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
  {/* Header con navegación */}
  <div className="flex items-center justify-between space-y-2">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{titulo}</h2>
      <p className="text-muted-foreground">{descripcion}</p>
    </div>
    <div className="flex items-center gap-2">
      {/* Acciones */}
    </div>
  </div>
  
  {/* Contenido en grid */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
    {/* Contenido principal */}
  </div>
</div>
```

## Mantenimiento

- ✅ **Consistencia**: Todos los componentes siguen el mismo patrón
- ✅ **Responsive**: Espaciado adaptativo para diferentes dispositivos
- ✅ **Accesibilidad**: Scroll margins apropiados para navegación
- ✅ **Performance**: Layout optimizado con flexbox 