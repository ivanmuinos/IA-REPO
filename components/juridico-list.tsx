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
import { useToast } from "@/hooks/use-toast"

interface JuridicoListProps {
  filtro?: string
}

interface EmpresaData {
  id: number
  nombre: string
  documento: string
  flujo: string
  fecha: string
  estado: string
  progreso: number
  email: string
  telefono: string
  motivoRechazo?: string
}

// Demo data for juridical entities
export const empresasDemo: EmpresaData[] = [
  {
    id: 101,
    nombre: "Tecnología Avanzada S.A.",
    documento: "30-71234567-8",
    flujo: "KYB Empresas",
    fecha: "18/05/2023 10:15",
    estado: "completado",
    progreso: 100,
    email: "contacto@tecnologiaavanzada.com",
    telefono: "+54 11 4567-8900",
  },
  {
    id: 102,
    nombre: "Constructora del Sur S.R.L.",
    documento: "30-65432198-7",
    flujo: "KYB Premium",
    fecha: "19/05/2023 14:30",
    estado: "en-progreso",
    progreso: 65,
    email: "info@constructoradelsur.com",
    telefono: "+54 11 5678-9012",
  },
  {
    id: 103,
    nombre: "Inversiones Globales S.A.",
    documento: "30-87654321-9",
    flujo: "KYB Empresas",
    fecha: "20/05/2023 09:45",
    estado: "revision",
    progreso: 85,
    email: "contacto@inversionesglobales.com",
    telefono: "+54 11 6789-0123",
  },
  {
    id: 104,
    nombre: "Logística Integral S.A.",
    documento: "30-12345678-9",
    flujo: "KYB Básico",
    fecha: "17/05/2023 16:20",
    estado: "rechazado",
    progreso: 70,
    email: "info@logisticaintegral.com",
    telefono: "+54 11 7890-1234",
    motivoRechazo: "Documentación inconsistente",
  },
  {
    id: 105,
    nombre: "Consultora Financiera S.R.L.",
    documento: "30-98765432-1",
    flujo: "KYB Premium",
    fecha: "21/05/2023 11:30",
    estado: "aprobado",
    progreso: 100,
    email: "contacto@consultorafinanciera.com",
    telefono: "+54 11 8901-2345",
  },
  {
    id: 106,
    nombre: "Importadora del Este S.A.",
    documento: "30-23456789-0",
    flujo: "KYB Empresas",
    fecha: "22/05/2023 15:10",
    estado: "en-progreso",
    progreso: 40,
    email: "ventas@importadoradeleste.com",
    telefono: "+54 11 9012-3456",
  },
  {
    id: 107,
    nombre: "Servicios Digitales S.A.S.",
    documento: "30-34567890-1",
    flujo: "KYB Básico",
    fecha: "23/05/2023 13:45",
    estado: "revision",
    progreso: 90,
    email: "soporte@serviciosdigitales.com",
    telefono: "+54 11 0123-4567",
  },
]

const STATUS_CONFIG = {
  completado: { icon: CheckCircle, color: "text-green-600", variant: "default" as const },
  aprobado: { icon: CheckCircle, color: "text-green-600", variant: "default" as const },
  "en-progreso": { icon: Clock, color: "text-amber-600", variant: "secondary" as const },
  revision: { icon: AlertCircle, color: "text-blue-600", variant: "outline" as const },
  abandonado: { icon: XCircle, color: "text-red-600", variant: "destructive" as const },
  rechazado: { icon: XCircle, color: "text-red-600", variant: "destructive" as const },
} as const

const STATUS_LABELS = {
  completado: "Completado",
  "en-progreso": "En progreso",
  revision: "Revisión manual",
  abandonado: "Abandonado",
  rechazado: "Rechazado",
  aprobado: "Aprobado",
} as const

export function JuridicoList({ filtro }: JuridicoListProps) {
  const [empresas, setEmpresas] = useState<EmpresaData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(filtro || "todos")
  const { toast } = useToast()

  useEffect(() => {
    loadEmpresas()
  }, [])

  const loadEmpresas = async () => {
    try {
      setLoading(true)
      // In a real application, you would fetch this data from an API
      setEmpresas(empresasDemo)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const empresasFiltradas = empresas.filter((empresa) => {
    const matchesSearch =
      empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || empresa.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (estado: string) => {
    const config = STATUS_CONFIG[estado as keyof typeof STATUS_CONFIG]
    if (!config) return null
    const IconComponent = config.icon
    return <IconComponent className={`h-4 w-4 ${config.color}`} />
  }

  const getStatusText = (estado: string) => {
    return STATUS_LABELS[estado as keyof typeof STATUS_LABELS] || estado
  }

  const getStatusVariant = (estado: string) => {
    const config = STATUS_CONFIG[estado as keyof typeof STATUS_CONFIG]
    return config?.variant || "secondary"
  }

  const handleExportAll = async () => {
    try {
      const dataToExport = empresasFiltradas.map((empresa) => ({
        id: empresa.id,
        nombre: empresa.nombre,
        documento: empresa.documento,
        flujo: empresa.flujo,
        estado: empresa.estado,
        progreso: empresa.progreso,
        fecha: empresa.fecha,
        email: empresa.email,
        telefono: empresa.telefono,
      }))

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `empresas-kyb-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Exportación completada",
        description: `Se han exportado ${empresasFiltradas.length} registros`,
      })
    } catch (error) {
      toast({
        title: "Error en la exportación",
        description: "No se pudo exportar la información",
        variant: "destructive",
      })
    }
  }

  const handleEmpresaClick = (empresa: EmpresaData) => {
    if (!empresa.id || !empresa.nombre) {
      toast({
        title: "Error de datos",
        description: "Los datos de esta empresa están incompletos. Por favor, reporte este problema.",
        variant: "destructive",
      })
      return false
    }
    return true
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
            <CardTitle className="text-xl font-semibold">Lista de empresas</CardTitle>
            <CardDescription>Gestiona y revisa los procesos de onboarding de empresas (KYB)</CardDescription>
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
              {empresasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== "todos"
                      ? "No se encontraron empresas que coincidan con los filtros aplicados"
                      : "No hay empresas registradas"}
                  </TableCell>
                </TableRow>
              ) : (
                empresasFiltradas.map((empresa) => (
                  <TableRow key={empresa.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(empresa.estado)}
                        <Badge variant={getStatusVariant(empresa.estado)} className="font-medium">
                          {getStatusText(empresa.estado)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/juridico/${empresa.id}`}
                        className="hover:underline hover:text-primary transition-colors"
                        onClick={(e) => {
                          if (!handleEmpresaClick(empresa)) {
                            e.preventDefault()
                          }
                        }}
                      >
                        {empresa.nombre}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{empresa.documento}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {empresa.flujo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{empresa.fecha}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={empresa.progreso} className="h-2 w-20" />
                        <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                          {empresa.progreso}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/juridico/${empresa.id}`}>
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
            Mostrando {empresasFiltradas.length} de {empresas.length} empresas
            {(searchTerm || statusFilter !== "todos") && " (filtrado)"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
