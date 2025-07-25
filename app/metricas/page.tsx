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
  Activity,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/ui/card-system"
import { SimpleProgressBar } from "@/components/ui/loading-states"

export default function MetricasPage() {
  const [periodoTiempo, setPeriodoTiempo] = useState("30d")
  const [tipoFlujo, setTipoFlujo] = useState("todos")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 scroll-section">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Métricas de Onboarding</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        Indicadores generales del desempeño de tus flujos
      </p>

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

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="validacion">Validación</TabsTrigger>
          <TabsTrigger value="abandono">Abandono</TabsTrigger>
          <TabsTrigger value="revision">Revisión</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4" id="metricas-generales">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              number="1,284"
              label="Personas que iniciaron el proceso"
              description="Total de usuarios que comenzaron el onboarding"
              trend={{ value: "+12%", isPositive: true }}
              icon={<Users className="h-4 w-4" />}
            />

            <MetricCard
              number="937"
              label="Personas que completaron el proceso"
              description="Usuarios que finalizaron exitosamente"
              trend={{ value: "+8%", isPositive: true }}
              icon={<UserCheck className="h-4 w-4" />}
            />

            <MetricCard
              number="812"
              label="Personas onboarded"
              description="Usuarios completamente verificados"
              trend={{ value: "+5%", isPositive: true }}
              icon={<UserCheck className="h-4 w-4" />}
            />

            <MetricCard
              number="72.9%"
              label="Porcentaje de conversión"
              description="Tasa de éxito del proceso completo"
              trend={{ value: "+3.2%", isPositive: true }}
              icon={<MoveDown className="h-4 w-4" />}
            />

            <MetricCard
              number="5"
              label="Flujos activos"
              description="3 KYC, 2 KYB"
              icon={<LayoutDashboard className="h-4 w-4" />}
            />

            <MetricCard
              number="2:47"
              label="Tiempo promedio de registro"
              description="Duración media del proceso"
              trend={{ value: "12% más rápido", isPositive: true }}
              icon={<Clock className="h-4 w-4" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por flujo</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <td className="p-3">156</td>
                      <td className="p-3">98</td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          62.8%
                        </Badge>
                      </td>
                      <td className="p-3">5 min 23 seg</td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="p-3 font-medium">KYC Express</td>
                      <td className="p-3">KYC</td>
                      <td className="p-3">165</td>
                      <td className="p-3">127</td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          77.0%
                        </Badge>
                      </td>
                      <td className="p-3">1 min 45 seg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validacion" className="space-y-4" id="metricas-validacion">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              number="8.6%"
              label="Tasa de error en validación"
              description="Documentos rechazados por el sistema"
              trend={{ value: "-2.1%", isPositive: true }}
              icon={<ThumbsDown className="h-4 w-4" />}
            />

            <MetricCard
              number="91.4%"
              label="Tasa de éxito en validación"
              description="Documentos aprobados automáticamente"
              trend={{ value: "+1.8%", isPositive: true }}
              icon={<FileCheck className="h-4 w-4" />}
            />

            <MetricCard
              number="2.3 min"
              label="Tiempo promedio de validación"
              description="Duración media del proceso de verificación"
              trend={{ value: "-0.5 min", isPositive: true }}
              icon={<Timer className="h-4 w-4" />}
            />

            <MetricCard
              number="1,247"
              label="Validaciones por hora"
              description="Volumen de procesamiento actual"
              trend={{ value: "+15%", isPositive: true }}
              icon={<Activity className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de documentos validados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>DNI</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <SimpleProgressBar value={45} />

                  <div className="flex items-center justify-between">
                    <span>Pasaporte</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <SimpleProgressBar value={32} />

                  <div className="flex items-center justify-between">
                    <span>Licencia de conducir</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <SimpleProgressBar value={18} />

                  <div className="flex items-center justify-between">
                    <span>Otros</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <SimpleProgressBar value={5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispositivos utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Móvil</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <SimpleProgressBar value={68} />

                  <div className="flex items-center justify-between">
                    <span>Desktop</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <SimpleProgressBar value={28} />

                  <div className="flex items-center justify-between">
                    <span>Tablet</span>
                    <span className="font-medium">4%</span>
                  </div>
                  <SimpleProgressBar value={4} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Errores más comunes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Documento borroso</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <SimpleProgressBar value={42} />

                  <div className="flex items-center justify-between">
                    <span>Documento expirado</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <SimpleProgressBar value={28} />

                  <div className="flex items-center justify-between">
                    <span>Información ilegible</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <SimpleProgressBar value={18} />

                  <div className="flex items-center justify-between">
                    <span>Otros</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <SimpleProgressBar value={12} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="abandono" className="space-y-4" id="metricas-abandono">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              number="163"
              label="Personas que abandonaron el flujo"
              description="Usuarios que no completaron el proceso"
              trend={{ value: "+8", isPositive: false }}
              icon={<UserMinus className="h-4 w-4" />}
            />

            <MetricCard
              number="42%"
              label="Paso en el que abandonaron"
              description="Validación biométrica - paso más problemático"
              icon={<X className="h-4 w-4" />}
            />

            <MetricCard
              number="38%"
              label="Motivo de abandono"
              description="No pudo subir selfie - problema principal"
              icon={<X className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Abandonos por paso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Validación biométrica</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <SimpleProgressBar value={42} />

                  <div className="flex items-center justify-between">
                    <span>OCR de documento</span>
                    <span className="font-medium">31%</span>
                  </div>
                  <SimpleProgressBar value={31} />

                  <div className="flex items-center justify-between">
                    <span>Formulario de datos</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <SimpleProgressBar value={18} />

                  <div className="flex items-center justify-between">
                    <span>Validación contra listas</span>
                    <span className="font-medium">9%</span>
                  </div>
                  <SimpleProgressBar value={9} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Motivos de abandono</CardTitle>
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
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: "18%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Problemas técnicos</span>
                    <span className="font-medium">17%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: "17%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispositivos con más abandonos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Android</span>
                    <span className="font-medium">52%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: "52%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>iOS</span>
                    <span className="font-medium">31%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: "31%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Desktop</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: "12%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tablet</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: "5%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revision" className="space-y-4" id="metricas-revision">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              number="47"
              label="Revisiones pendientes"
              description="Casos que requieren revisión manual"
              trend={{ value: "-12", isPositive: true }}
              icon={<Loader2 className="h-4 w-4" />}
            />

            <MetricCard
              number="4.2h"
              label="Tiempo promedio de revisión"
              description="Duración media del proceso manual"
              trend={{ value: "-0.8h", isPositive: true }}
              icon={<Clock className="h-4 w-4" />}
            />

            <MetricCard
              number="72%"
              label="Tasa de aprobación manual"
              description="Casos aprobados después de revisión"
              trend={{ value: "+5%", isPositive: true }}
              icon={<UserCheck className="h-4 w-4" />}
            />

            <MetricCard
              number="8.3"
              label="Revisiones por hora"
              description="Capacidad de procesamiento actual"
              trend={{ value: "+12%", isPositive: true }}
              icon={<Activity className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de revisión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Documento dudoso</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <SimpleProgressBar value={45} />

                  <div className="flex items-center justify-between">
                    <span>Verificación biométrica</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <SimpleProgressBar value={32} />

                  <div className="flex items-center justify-between">
                    <span>Coincidencia en listas</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <SimpleProgressBar value={15} />

                  <div className="flex items-center justify-between">
                    <span>Otros</span>
                    <span className="font-medium">8%</span>
                  </div>
                  <SimpleProgressBar value={8} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiempo de revisión por tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Verificación biométrica</span>
                    <span className="font-medium">2h 18min</span>
                  </div>
                  <SimpleProgressBar value={60} />

                  <div className="flex items-center justify-between">
                    <span>Documento dudoso</span>
                    <span className="font-medium">3h 42min</span>
                  </div>
                  <SimpleProgressBar value={80} />

                  <div className="flex items-center justify-between">
                    <span>Coincidencia en listas</span>
                    <span className="font-medium">8h 15min</span>
                  </div>
                  <SimpleProgressBar value={100} />

                  <div className="flex items-center justify-between">
                    <span>Otros</span>
                    <span className="font-medium">4h 30min</span>
                  </div>
                  <SimpleProgressBar value={70} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado de revisiones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Aprobadas</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <SimpleProgressBar value={72} />

                  <div className="flex items-center justify-between">
                    <span>Rechazadas</span>
                    <span className="font-medium">21%</span>
                  </div>
                  <SimpleProgressBar value={21} />

                  <div className="flex items-center justify-between">
                    <span>Solicitud de más información</span>
                    <span className="font-medium">7%</span>
                  </div>
                  <SimpleProgressBar value={7} />
                </div>
              </CardContent>
            </Card>
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
    </div>
  )
}
