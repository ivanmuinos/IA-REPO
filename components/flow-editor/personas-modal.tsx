"use client"

import { useState } from "react"
import { Clock, CheckCircle, AlertCircle, XCircle, Search, ChevronRight, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PersonasModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PersonasModal({ open, onOpenChange }: PersonasModalProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  // Datos de ejemplo
  const personas = [
    {
      id: 1,
      nombre: "Juan Pérez",
      documento: "12345678A",
      estado: "completado",
      fechaInicio: "15/05/2023 14:32",
      ultimaActividad: "15/05/2023 14:45",
      pasoAlcanzado: "Fin del flujo",
      progreso: 100,
    },
    {
      id: 2,
      nombre: "María López",
      documento: "87654321B",
      estado: "en-progreso",
      fechaInicio: "15/05/2023 16:45",
      ultimaActividad: "15/05/2023 16:55",
      pasoAlcanzado: "Validación biométrica",
      progreso: 60,
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      documento: "11223344C",
      estado: "revision",
      fechaInicio: "14/05/2023 10:15",
      ultimaActividad: "14/05/2023 10:30",
      pasoAlcanzado: "Validación biométrica",
      progreso: 80,
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      documento: "55667788D",
      estado: "completado",
      fechaInicio: "14/05/2023 09:30",
      ultimaActividad: "14/05/2023 09:45",
      pasoAlcanzado: "Fin del flujo",
      progreso: 100,
    },
    {
      id: 5,
      nombre: "Pedro Sánchez",
      documento: "99887766E",
      estado: "abandonado",
      fechaInicio: "13/05/2023 17:20",
      ultimaActividad: "13/05/2023 17:25",
      pasoAlcanzado: "OCR de documento",
      progreso: 40,
    },
  ]

  // Filtrar personas según búsqueda y filtro de estado
  const filteredPersonas = personas.filter((persona) => {
    const matchesSearch =
      searchTerm === "" ||
      persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.documento.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || persona.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  // Datos detallados de la persona seleccionada
  const getPersonaDetalle = (id: number) => {
    const persona = personas.find((p) => p.id === id)
    if (!persona) return null

    return {
      ...persona,
      email: `${persona.nombre.toLowerCase().replace(" ", ".")}@ejemplo.com`,
      telefono: "+34 612 345 678",
      pasos: [
        {
          id: "inicio",
          nombre: "Inicio",
          estado: "completado",
          tiempo: "10s",
          timestamp: "10:15:00",
        },
        {
          id: "ocr",
          nombre: "OCR de documento",
          estado: "completado",
          tiempo: "45s",
          timestamp: "10:15:45",
        },
        {
          id: "biometria",
          nombre: "Validación biométrica",
          estado: persona.estado === "en-progreso" ? "en-progreso" : "completado",
          tiempo: "30s",
          timestamp: "10:16:15",
        },
        {
          id: "fin",
          nombre: "Fin del flujo",
          estado: persona.estado === "completado" ? "completado" : "pendiente",
          tiempo: persona.estado === "completado" ? "15s" : "-",
          timestamp: persona.estado === "completado" ? "10:16:30" : "-",
        },
      ],
      datosOCR: {
        nombre: persona.nombre.split(" ")[0],
        apellidos: persona.nombre.split(" ")[1],
        documento: persona.documento,
        fechaNacimiento: "15/08/1985",
        fechaExpedicion: "20/03/2018",
        fechaCaducidad: "20/03/2028",
        nacionalidad: "Española",
      },
    }
  }

  // Función para obtener el icono según el estado
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "en-progreso":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "revision":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "abandonado":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (estado: string) => {
    switch (estado) {
      case "completado":
        return "Completado"
      case "en-progreso":
        return "En progreso"
      case "revision":
        return "Revisión manual"
      case "abandonado":
        return "Abandonado"
      default:
        return estado
    }
  }

  // Función para obtener la variante del badge según el estado
  const getStatusVariant = (estado: string) => {
    switch (estado) {
      case "completado":
        return "default"
      case "en-progreso":
        return "secondary"
      case "revision":
        return "outline"
      case "abandonado":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const personaDetalle = selectedPersonaId ? getPersonaDetalle(selectedPersonaId) : null

  // Exportar datos a CSV
  const exportToCSV = () => {
    const headers = ["Nombre", "Documento", "Estado", "Fecha de inicio", "Última actividad", "Progreso"]
    const csvData = filteredPersonas.map((p) => [
      p.nombre,
      p.documento,
      getStatusText(p.estado),
      p.fechaInicio,
      p.ultimaActividad,
      `${p.progreso}%`,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "personas_flujo.csv")
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Personas que realizaron este flujo</DialogTitle>
          <DialogDescription>
            Lista de todas las personas que han iniciado o completado este flujo de onboarding
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!selectedPersonaId ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nombre o documento..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar personas"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="en-progreso">En progreso</SelectItem>
                    <SelectItem value="revision">Revisión manual</SelectItem>
                    <SelectItem value="abandonado">Abandonado</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estado</TableHead>
                        <TableHead>Nombre / ID</TableHead>
                        <TableHead>Fecha de inicio</TableHead>
                        <TableHead>Última actividad</TableHead>
                        <TableHead>Paso alcanzado</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPersonas.length > 0 ? (
                        filteredPersonas.map((persona) => (
                          <TableRow key={persona.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(persona.estado)}
                                <Badge variant={getStatusVariant(persona.estado)}>
                                  {getStatusText(persona.estado)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                <div>{persona.nombre}</div>
                                <div className="text-xs text-muted-foreground">{persona.documento}</div>
                              </div>
                            </TableCell>
                            <TableCell>{persona.fechaInicio}</TableCell>
                            <TableCell>{persona.ultimaActividad}</TableCell>
                            <TableCell>{persona.pasoAlcanzado}</TableCell>
                            <TableCell>
                              <div className="w-[100px]">
                                <Progress value={persona.progreso} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPersonaId(persona.id)}
                                aria-label={`Ver recorrido de ${persona.nombre}`}
                              >
                                Ver recorrido
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No se encontraron resultados para la búsqueda
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          ) : personaDetalle ? (
            <ScrollArea className="h-[400px]">
              <div className="pr-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-4"
                  onClick={() => setSelectedPersonaId(null)}
                  aria-label="Volver a la lista"
                >
                  ← Volver a la lista
                </Button>

                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold">{personaDetalle.nombre}</h3>
                  <Badge variant={getStatusVariant(personaDetalle.estado)}>
                    {getStatusText(personaDetalle.estado)}
                  </Badge>
                </div>

                <Tabs defaultValue="recorrido">
                  <TabsList>
                    <TabsTrigger value="recorrido">Recorrido</TabsTrigger>
                    <TabsTrigger value="datos">Datos recolectados</TabsTrigger>
                  </TabsList>

                  <TabsContent value="recorrido" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Fecha de inicio</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{personaDetalle.fechaInicio}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Tiempo total</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{personaDetalle.estado === "completado" ? "1:45 min" : "En progreso"}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Progreso</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Progress value={personaDetalle.progreso} className="h-2 flex-1" />
                            <span>{personaDetalle.progreso}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative pl-6 space-y-6">
                      <div className="absolute top-0 bottom-0 left-2 border-l-2 border-dashed border-muted" />

                      {personaDetalle.pasos.map((paso, index) => (
                        <div key={paso.id} className="relative">
                          <div
                            className={`absolute -left-6 h-4 w-4 rounded-full ${
                              paso.estado === "completado"
                                ? "bg-green-500"
                                : paso.estado === "en-progreso"
                                  ? "bg-amber-500"
                                  : "bg-muted"
                            }`}
                          />
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{paso.nombre}</p>
                                {paso.estado === "completado" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {paso.estado === "en-progreso" && <Clock className="h-4 w-4 text-amber-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground">{paso.timestamp}</div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Duración: {paso.tiempo}</span>
                              <span>Estado: {getStatusText(paso.estado)}</span>
                            </div>

                            {/* Capturas de ejemplo para cada paso */}
                            {paso.id === "ocr" && paso.estado === "completado" && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="border rounded-md overflow-hidden">
                                  <div className="bg-muted p-1 text-xs">Anverso del documento</div>
                                  <div className="h-24 bg-muted/30 flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">Captura del documento</span>
                                  </div>
                                </div>
                                <div className="border rounded-md overflow-hidden">
                                  <div className="bg-muted p-1 text-xs">Reverso del documento</div>
                                  <div className="h-24 bg-muted/30 flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">Captura del documento</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {paso.id === "biometria" &&
                              (paso.estado === "completado" || paso.estado === "en-progreso") && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  <div className="border rounded-md overflow-hidden">
                                    <div className="bg-muted p-1 text-xs">Selfie</div>
                                    <div className="h-24 bg-muted/30 flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">Captura de selfie</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="datos" className="mt-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Datos extraídos del documento</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Nombre</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.datosOCR.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Apellidos</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.datosOCR.apellidos}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Documento</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.datosOCR.documento}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fecha de nacimiento</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.datosOCR.fechaNacimiento}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fecha de expedición</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.datosOCR.fechaExpedicion}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fecha de caducidad</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.datosOCR.fechaCaducidad}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Nacionalidad</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.datosOCR.nacionalidad}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-sm text-muted-foreground">{personaDetalle.telefono}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">No se encontró información para esta persona</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
