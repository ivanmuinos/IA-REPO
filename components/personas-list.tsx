"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, CheckCircle, AlertCircle, XCircle, Search, Filter, Download, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { useToast } from "@/hooks/use-toast"

interface PersonasListProps {
  filtro?: string
}

export function PersonasList({ filtro }: PersonasListProps) {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(filtro || "todos")
  const { toast } = useToast()

  useEffect(() => {
    loadPersonas()
  }, [])

  const loadPersonas = async () => {
    try {
      setLoading(true)

      const data = await PersonasService.getAllPersonas()
      setPersonas(data)

      console.log(`Loaded ${data.length} validated personas`)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las personas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter personas based on search term and status
  const personasFiltradas = personas.filter((persona) => {
    const matchesSearch =
      persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || persona.estado === statusFilter

    const matchesType = true // Placeholder for matchesType variable

    return matchesSearch && matchesType && matchesStatus
  })

  // Function to get status icon
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "en-progreso":
        return <Clock className="h-4 w-4 text-amber-600" />
      case "revision":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "abandonado":
      case "rechazado":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "aprobado":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  // Function to get status text
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
      case "rechazado":
        return "Rechazado"
      case "aprobado":
        return "Aprobado"
      default:
        return estado
    }
  }

  // Function to get status variant
  const getStatusVariant = (estado: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (estado) {
      case "completado":
        return "default"
      case "en-progreso":
        return "secondary"
      case "revision":
        return "outline"
      case "abandonado":
      case "rechazado":
        return "destructive"
      case "aprobado":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleExportAll = async () => {
    try {
      const dataToExport = personasFiltradas.map((persona) => ({
        id: persona.id,
        nombre: persona.nombre,
        documento: persona.documento,
        flujo: persona.flujo,
        estado: persona.estado,
        progreso: persona.progreso,
        fecha: persona.fecha,
        email: persona.email,
        telefono: persona.telefono,
      }))

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `personas-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Exportación completada",
        description: `Se han exportado ${personasFiltradas.length} registros`,
      })
    } catch (error) {
      toast({
        title: "Error en la exportación",
        description: "No se pudo exportar la información",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Lista de personas</CardTitle>
            <CardDescription>Gestiona y revisa los procesos de onboarding de los usuarios</CardDescription>
          </div>
          <Button onClick={handleExportAll} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar datos
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, documento o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="en-progreso">En progreso</SelectItem>
                <SelectItem value="revision">Revisión manual</SelectItem>
                <SelectItem value="abandonado">Abandonado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="rounded-md border-x border-b">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Documento</TableHead>
                <TableHead className="font-semibold">Flujo</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Progreso</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== "todos"
                      ? "No se encontraron personas que coincidan con los filtros aplicados"
                      : "No hay personas registradas"}
                  </TableCell>
                </TableRow>
              ) : (
                personasFiltradas.map((persona) => (
                  <TableRow
                    key={persona.id}
                    className="hover:bg-muted/30 transition-colors"
                    onClick={() => {
                      // Log click for debugging
                      console.log(`Clicked persona: ID ${persona.id}, Name: ${persona.nombre}`)
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(persona.estado)}
                        <Badge variant={getStatusVariant(persona.estado)} className="font-medium">
                          {getStatusText(persona.estado)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/personas/${persona.id}`}
                        className="hover:underline hover:text-primary transition-colors"
                        onClick={(e) => {
                          // Verify data consistency before navigation
                          if (!persona.id || !persona.nombre) {
                            e.preventDefault()
                            toast({
                              title: "Error de datos",
                              description:
                                "Los datos de esta persona están incompletos. Por favor, reporte este problema.",
                              variant: "destructive",
                            })
                            return
                          }
                          console.log(`Navigating to persona: ID ${persona.id}, Name: ${persona.nombre}`)
                        }}
                      >
                        {persona.nombre}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{persona.documento}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {persona.flujo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{persona.fecha}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={persona.progreso} className="h-2 w-20" />
                        <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                          {persona.progreso}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/personas/${persona.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-6 py-4 border-t bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Mostrando {personasFiltradas.length} de {personas.length} personas
            {(searchTerm || statusFilter !== "todos") && " (filtrado)"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
