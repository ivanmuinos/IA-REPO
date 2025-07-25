"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function DesignSystemDemo() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Sistema de Diseño KYx Platform</h2>
        <p className="text-muted-foreground">
          Demostración de las variables CSS personalizadas y el sistema de diseño integrado.
        </p>
      </div>

      {/* Colores */}
      <Card>
        <CardHeader>
          <CardTitle>Paleta de Colores</CardTitle>
          <CardDescription>Variables CSS personalizadas para colores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-primary rounded-md border"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">var(--primary)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-secondary rounded-md border"></div>
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">var(--secondary)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-accent rounded-md border"></div>
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">var(--accent)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-destructive rounded-md border"></div>
              <p className="text-sm font-medium">Destructive</p>
              <p className="text-xs text-muted-foreground">var(--destructive)</p>
            </div>
          </div>

          {/* Colores de gráficos */}
          <div>
            <h4 className="font-medium mb-2">Colores de Gráficos</h4>
            <div className="grid grid-cols-5 gap-2">
              <div className="h-12 bg-chart-1 rounded-md"></div>
              <div className="h-12 bg-chart-2 rounded-md"></div>
              <div className="h-12 bg-chart-3 rounded-md"></div>
              <div className="h-12 bg-chart-4 rounded-md"></div>
              <div className="h-12 bg-chart-5 rounded-md"></div>
            </div>
          </div>

          {/* Colores del sidebar */}
          <div>
            <h4 className="font-medium mb-2">Colores del Sidebar</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-sidebar rounded-md border"></div>
                <p className="text-xs">Sidebar</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-sidebar-primary rounded-md border"></div>
                <p className="text-xs">Sidebar Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-sidebar-accent rounded-md border"></div>
                <p className="text-xs">Sidebar Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-sidebar-border rounded-md border"></div>
                <p className="text-xs">Sidebar Border</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sombras */}
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Sombras</CardTitle>
          <CardDescription>Variables CSS para sombras personalizadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-background border rounded-md shadow-2xs flex items-center justify-center">
              <span className="text-xs">shadow-2xs</span>
            </div>
            <div className="h-20 bg-background border rounded-md shadow-xs flex items-center justify-center">
              <span className="text-xs">shadow-xs</span>
            </div>
            <div className="h-20 bg-background border rounded-md shadow-sm flex items-center justify-center">
              <span className="text-xs">shadow-sm</span>
            </div>
            <div className="h-20 bg-background border rounded-md shadow flex items-center justify-center">
              <span className="text-xs">shadow</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-background border rounded-md shadow-md flex items-center justify-center">
              <span className="text-xs">shadow-md</span>
            </div>
            <div className="h-20 bg-background border rounded-md shadow-lg flex items-center justify-center">
              <span className="text-xs">shadow-lg</span>
            </div>
            <div className="h-20 bg-background border rounded-md shadow-xl flex items-center justify-center">
              <span className="text-xs">shadow-xl</span>
            </div>
            <div className="h-20 bg-background border rounded-md shadow-2xl flex items-center justify-center">
              <span className="text-xs">shadow-2xl</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bordes redondeados */}
      <Card>
        <CardHeader>
          <CardTitle>Bordes Redondeados</CardTitle>
          <CardDescription>Variables CSS para border-radius</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-16 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground text-xs">rounded-sm</span>
            </div>
            <div className="h-16 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground text-xs">rounded-md</span>
            </div>
            <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs">rounded-lg</span>
            </div>
            <div className="h-16 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground text-xs">rounded-xl</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipografía */}
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Tipografía</CardTitle>
          <CardDescription>Variables CSS para fuentes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-sans text-lg">Font Sans (Inter) - Texto principal</p>
            <p className="font-serif text-lg">Font Serif (Source Serif 4) - Títulos</p>
            <p className="font-mono text-lg">Font Mono (JetBrains Mono) - Código</p>
          </div>
        </CardContent>
      </Card>

      {/* Componentes con nuevas variantes */}
      <Card>
        <CardHeader>
          <CardTitle>Componentes con Nuevas Variantes</CardTitle>
          <CardDescription>Badges y alerts con variantes personalizadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="p-4 bg-background border border-input rounded-md">
              <p className="text-sm">Alert Default - Mensaje informativo</p>
            </div>
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
              <p className="text-sm">Alert Destructive - Mensaje de error</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
              <p className="text-sm">Alert Warning - Mensaje de advertencia</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de ejemplo */}
      <Card>
        <CardHeader>
          <CardTitle>Botones con Nuevo Sistema</CardTitle>
          <CardDescription>Botones usando las nuevas variables CSS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 