# Correcciones de Scroll - Documentación

## Descripción

Este documento explica las correcciones de scroll implementadas para evitar que el header fijo (TopBar) y la navegación (BreadcrumbNav) bloqueen el contenido al hacer scroll o navegación interna.

## Estructura del Layout

- **TopBar**: `h-16` (64px) - Fijo en la parte superior
- **BreadcrumbNav**: `py-4` (32px) - Dentro del main
- **Total de navegación**: 96px

## Clases CSS Disponibles

### Clases Principales

```css
/* Para elementos que necesitan scroll-margin considerando toda la navegación */
.scroll-section {
  scroll-margin-top: 96px;
}

/* Para navegación interna considerando TopBar + BreadcrumbNav */
.scroll-target-with-nav {
  scroll-margin-top: 96px;
}

/* Ajuste para elementos que necesitan estar visibles bajo la navegación */
.visible-under-nav {
  padding-top: 96px;
}
```

### Clases Específicas

```css
/* Para navegación interna con TopBar fijo */
.scroll-target {
  scroll-margin-top: 80px;
}

/* Correcciones específicas para el layout con TopBar + BreadcrumbNav */
.scroll-with-breadcrumb {
  scroll-margin-top: 96px;
}
```

## Uso en Componentes

### 1. Páginas Principales

```tsx
// Aplicar a la página principal
<div className="flex-1 space-y-4 p-4 md:p-8 pt-6 scroll-section">
  {/* Contenido de la página */}
</div>
```

### 2. Secciones con IDs

```tsx
// Para secciones que pueden ser navegadas internamente
<section id="metricas-generales" className="scroll-target-with-nav">
  {/* Contenido de la sección */}
</section>
```

### 3. Elementos de Navegación

```tsx
// Para enlaces que navegan a secciones específicas
<Link href="#metricas-generales" className="scroll-target">
  Ir a Métricas Generales
</Link>
```

## Configuración Global

### Smooth Scroll

El smooth scroll está configurado globalmente:

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 96px;
}
```

### Elementos con IDs

Todos los elementos con IDs tienen scroll-margin automático:

```css
section[id],
div[id] {
  scroll-margin-top: 80px;
}
```

## Ejemplos de Implementación

### Página de Métricas

```tsx
export default function MetricasPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 scroll-section">
      {/* Header de la página */}
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="validacion">Validación</TabsTrigger>
          <TabsTrigger value="abandono">Abandono</TabsTrigger>
          <TabsTrigger value="revision">Revisión</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4" id="metricas-generales">
          {/* Contenido de métricas generales */}
        </TabsContent>

        <TabsContent value="validacion" className="space-y-4" id="metricas-validacion">
          {/* Contenido de validación */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### Navegación Interna

```tsx
// Enlaces que navegan a secciones específicas
<div className="flex gap-4">
  <Link href="#metricas-generales" className="scroll-target">
    Métricas Generales
  </Link>
  <Link href="#metricas-validacion" className="scroll-target">
    Validación
  </Link>
</div>
```

## Consideraciones

1. **TopBar fijo**: Siempre visible en la parte superior
2. **BreadcrumbNav**: Aparece cuando hay navegación
3. **Scroll-margin**: Asegura que el contenido no se oculte bajo la navegación
4. **Smooth scroll**: Navegación suave entre secciones

## Troubleshooting

### Si el contenido se oculta bajo el header:

1. Verificar que se esté usando la clase `scroll-section` o `scroll-target-with-nav`
2. Asegurar que los elementos tengan IDs únicos
3. Verificar que el TopBar tenga `z-index: 50`

### Si el smooth scroll no funciona:

1. Verificar que `scroll-behavior: smooth` esté habilitado
2. Asegurar que `scroll-padding-top: 96px` esté configurado
3. Verificar que los enlaces usen `href="#id"` correctamente 