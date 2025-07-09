"use client"

import { useState } from "react"
import {
  BarChart3,
  Calendar,
  Clock,
  FileCheck,
  Filter,
  Laptop,
  LayoutDashboard,
  Loader2,
  MoveDown,
  Smartphone,
  ThumbsDown,
  Timer,
  UserCheck,
  UserMinus,
  Users,
  X,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function MetricasPage() {
  const [periodoTiempo, setPeriodoTiempo] = useState("30d")
  const [tipoFlujo, setTipoFlujo] = useState("todos")

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Métricas de Onboarding"
        description="Indicadores generales del desempeño de tus flujos"
        breadcrumbs={[{ label: "Métricas" }]}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex gap-4">
          <Select value={periodoTiempo} onValueChange={setPeriodoTiempo}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoFlujo} onValueChange={setTipoFlujo}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo de flujo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los flujos</SelectItem>
              <SelectItem value="kyc">KYC (Personas)</SelectItem>
              <SelectItem value="kyb">KYB (Empresas)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Tabs defaultValue="cards">
            <TabsList>
              <TabsTrigger value="cards">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="charts">
                <BarChart3 className="h-4 w-4 mr-2" />
                Gráficos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="validacion">Validación</TabsTrigger>
          <TabsTrigger value="abandono">Abandono</TabsTrigger>
          <TabsTrigger value="revision">Revisión</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-4">Métricas generales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <StatCard
                title="Personas que iniciaron el proceso"
                value="1,284"
                icon={Users}
                trend={{ value: 12, label: "vs. período anterior", positive: true }}
                valueClassName="text-primary"
              />

              <StatCard
                title="Personas que completaron el proceso"
                value="937"
                icon={UserCheck}
                trend={{ value: 8, label: "vs. período anterior", positive: true }}
              />

              <StatCard
                title="Personas onboarded"
                value="812"
                icon={UserCheck}
                trend={{ value: 5, label: "vs. período anterior", positive: true }}
              />

              <StatCard
                title="Porcentaje de conversión"
                value="72.9%"
                icon={MoveDown}
                trend={{ value: 3.2, label: "vs. período anterior", positive: true }}
                valueClassName="text-green-600 dark:text-green-400"
              />

              <StatCard title="Flujos activos" value="5" icon={LayoutDashboard} description="3 KYC, 2 KYB" />

              <StatCard
                title="Tiempo promedio de registro"
                value="2 min 47 seg"
                icon={Clock}
                trend={{ value: 12, label: "más rápido", positive: true }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mt-6 mb-4">Rendimiento por flujo</h2>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">Flujo</th>
                    <th className="text-left p-3 font-medium">Tipo</th>
                    <th className="text-left p-3 font-medium">Iniciados</th>
                    <th className="text-left p-3 font-medium">Completados</th>
                    <th className="text-left p-3 font-medium">Conversión</th>
                    <th className="text-left p-3 font-medium">Tiempo promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3 font-medium">KYC Básico</td>
                    <td className="p-3">KYC</td>
                    <td className="p-3">642</td>
                    <td className="p-3">498</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        77.6%
                      </Badge>
                    </td>
                    <td className="p-3">2 min 12 seg</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-medium">KYC Premium</td>
                    <td className="p-3">KYC</td>
                    <td className="p-3">321</td>
                    <td className="p-3">214</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        66.7%
                      </Badge>
                    </td>
                    <td className="p-3">3 min 45 seg</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 font-medium">KYB Empresas</td>
                    <td className="p-3">KYB</td>
                    <td className="p-3">198</td>
                    <td className="p-3">142</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        71.7%
                      </Badge>
                    </td>
                    <td className="p-3">4 min 32 seg</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-medium">KYC Simplificado</td>
                    <td className="p-3">KYC</td>
                    <td className="p-3">87</td>
                    <td className="p-3">71</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        81.6%
                      </Badge>
                    </td>
                    <td className="p-3">1 min 48 seg</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 font-medium">KYB Internacional</td>
                    <td className="p-3">KYB</td>
                    <td className="p-3">36</td>
                    <td className="p-3">12</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        33.3%
                      </Badge>
                    </td>
                    <td className="p-3">6 min 15 seg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="validacion" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-4">Métricas de validación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Tasa de rechazo de documentos"
                value="8.6%"
                icon={ThumbsDown}
                trend={{ value: 1.2, label: "vs. período anterior", positive: false }}
                valueClassName="text-amber-600 dark:text-amber-400"
              />

              <StatCard
                title="Validaciones exitosas"
                value="93.1%"
                icon={FileCheck}
                trend={{ value: 2.4, label: "vs. período anterior", positive: true }}
                valueClassName="text-green-600 dark:text-green-400"
              />

              <StatCard
                title="Dispositivos más usados"
                value="Mobile (82%)"
                icon={Smartphone}
                description="Desktop (18%)"
              />

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Distribución por dispositivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-primary" />
                        <span>Mobile</span>
                      </div>
                      <span className="font-medium">82%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "82%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-muted-foreground" />
                        <span>Desktop</span>
                      </div>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-muted-foreground" style={{ width: "18%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Tipos de documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>DNI</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "68%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Pasaporte</span>
                      <span className="font-medium">21%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "21%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Licencia de conducir</span>
                      <span className="font-medium">11%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "11%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Motivos de rechazo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Documento borroso</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "42%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Documento caducado</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "28%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Documento incompleto</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "18%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Otros</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="abandono" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-4">Métricas de abandono</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Personas que abandonaron el flujo"
                value="163"
                icon={UserMinus}
                trend={{ value: 8, label: "vs. período anterior", positive: false }}
                valueClassName="text-destructive"
              />

              <StatCard
                title="Paso en el que abandonaron"
                value="Validación biométrica"
                icon={X}
                description="42% de los abandonos"
              />

              <StatCard
                title="Motivo de abandono"
                value="No pudo subir selfie"
                icon={X}
                description="38% de los abandonos"
              />

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Abandonos por paso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Validación biométrica</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "42%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>OCR de documento</span>
                      <span className="font-medium">31%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "31%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Formulario de datos</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "18%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Validación contra listas</span>
                      <span className="font-medium">9%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "9%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Motivos de abandono</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>No pudo subir selfie</span>
                      <span className="font-medium">38%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "38%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Documento rechazado</span>
                      <span className="font-medium">27%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "27%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Proceso muy largo</span>
                      <span className="font-medium">21%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "21%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Otros / Desconocido</span>
                      <span className="font-medium">14%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "14%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Tasa de abandono por flujo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>KYC Básico</span>
                      <span className="font-medium">12.4%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: "12.4%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>KYC Premium</span>
                      <span className="font-medium">18.7%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: "18.7%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>KYB Empresas</span>
                      <span className="font-medium">15.2%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: "15.2%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>KYB Internacional</span>
                      <span className="font-medium">32.8%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "32.8%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="revision" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-4">Métricas de revisión</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Intentos fallidos de validación"
                value="51"
                icon={Loader2}
                trend={{ value: 12, label: "vs. período anterior", positive: false }}
                valueClassName="text-amber-600 dark:text-amber-400"
              />

              <StatCard
                title="Tasa de revisión manual"
                value="6.2%"
                icon={UserCheck}
                trend={{ value: 0.8, label: "vs. período anterior", positive: true }}
              />

              <StatCard
                title="Tiempo hasta aprobación"
                value="4 h 12 min"
                icon={Timer}
                trend={{ value: 15, label: "más rápido", positive: true }}
              />

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Revisiones manuales por tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Verificación biométrica</span>
                      <span className="font-medium">48%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "48%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Documento dudoso</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "32%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Coincidencia en listas</span>
                      <span className="font-medium">14%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "14%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Otros</span>
                      <span className="font-medium">6%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "6%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Tiempo de revisión por tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Verificación biométrica</span>
                      <span className="font-medium">2h 18min</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "60%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Documento dudoso</span>
                      <span className="font-medium">3h 42min</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "80%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Coincidencia en listas</span>
                      <span className="font-medium">8h 15min</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "100%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Otros</span>
                      <span className="font-medium">4h 30min</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Resultado de revisiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Aprobadas</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "72%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Rechazadas</span>
                      <span className="font-medium">21%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: "21%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Solicitud de más información</span>
                      <span className="font-medium">7%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: "7%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Datos actualizados: <span className="font-medium">16 de mayo de 2023, 07:14 AM</span>
        </p>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar datos
        </Button>
      </div>
    </main>
  )
}
