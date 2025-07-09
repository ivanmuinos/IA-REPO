"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Copy, MoreHorizontal, Search, Trash, Filter } from "lucide-react"
import { clientFlowService, type Flow } from "@/lib/flow-service"

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FlowDeleteDialog } from "@/components/flow-delete-dialog"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/components/empty-state"
import { FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FlowListProps {
  initialFlows: Flow[]
}

export function FlowList({ initialFlows }: FlowListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [flows, setFlows] = useState<Flow[]>(initialFlows)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Función para formatear la fecha relativa
  const formatRelativeDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diffInSeconds < 60) return "Hace unos segundos"
      if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`
      if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`
      if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`
      if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 604800)} semanas`

      return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Fecha no válida"
    }
  }, [])

  // Filtrar flujos según los criterios de búsqueda y filtros
  const filteredFlows = useMemo(() => {
    return flows.filter((flow) => {
      const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "todos" || flow.type === typeFilter
      const matchesStatus = statusFilter === "todos" || flow.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [flows, searchTerm, typeFilter, statusFilter])

  // Manejar la eliminación de un flujo
  const handleDeleteClick = useCallback((flow: Flow) => {
    setSelectedFlow(flow)
    setDeleteDialogOpen(true)
  }, [])

  // Confirmar eliminación
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedFlow) return

    setIsLoading(true)
    try {
      await clientFlowService.deleteFlow(selectedFlow.id)
      setFlows(flows.filter((f) => f.id !== selectedFlow.id))
      toast({
        title: "Flujo eliminado",
        description: `El flujo "${selectedFlow.name}" ha sido eliminado correctamente.`,
      })
    } catch (error) {
      console.error("Error deleting flow:", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el flujo. Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
      setSelectedFlow(null)
    }
  }, [selectedFlow, flows, toast])

  // Manejar la duplicación de un flujo
  const handleDuplicateClick = useCallback(
    async (flow: Flow) => {
      setIsLoading(true)
      try {
        // Crear un nuevo flujo con los datos del flujo seleccionado
        const newFlow = await clientFlowService.createFlow({
          name: `${flow.name} (Copia)`,
          type: flow.type,
          status: "draft",
        })

        // Obtener los pasos del flujo original
        const { nodes, connections } = await clientFlowService.getFlowSteps(flow.id)

        // Guardar los pasos en el nuevo flujo
        if (nodes.length > 0) {
          await clientFlowService.saveFlowSteps(newFlow.id, { nodes, connections })
        }

        // Actualizar la lista de flujos
        setFlows([newFlow, ...flows])
        toast({
          title: "Flujo duplicado",
          description: `Se ha creado una copia del flujo "${flow.name}".`,
        })
      } catch (error) {
        console.error("Error duplicating flow:", error)
        toast({
          title: "Error al duplicar",
          description: "No se pudo duplicar el flujo. Inténtalo nuevamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [flows, toast],
  )

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
      case "draft":
        return <Badge variant="secondary">Borrador</Badge>
      case "archived":
        return <Badge variant="outline">Archivado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }, [])

  if (flows.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No hay flujos configurados"
        description="Comienza creando tu primer flujo de onboarding para gestionar el registro y verificación de usuarios."
        action={{
          label: "Crear Primer Flujo",
          onClick: () => router.push("/flujos/nuevo"),
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="search-input" className="text-sm font-medium">
            Buscar flujos
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-input"
              type="search"
              placeholder="Buscar por nombre del flujo..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="type-filter" className="text-sm font-medium">
            Tipo de flujo
          </label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="kyc">KYC (Personas)</SelectItem>
              <SelectItem value="kyb">KYB (Empresas)</SelectItem>
              <SelectItem value="onboarding">Onboarding General</SelectItem>
              <SelectItem value="verification">Verificación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Estado
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredFlows.length} de {flows.length} flujos
        </p>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
            Limpiar búsqueda
          </Button>
        )}
      </div>

      {/* Tabla de flujos */}
      {filteredFlows.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No se encontraron flujos"
          description="No hay flujos que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda."
          action={{
            label: "Limpiar Filtros",
            onClick: () => {
              setSearchTerm("")
              setTypeFilter("todos")
              setStatusFilter("todos")
            },
          }}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Nombre del Flujo</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Última Edición</TableHead>
                <TableHead className="font-semibold">Última Actividad</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlows.map((flujo) => (
                <TableRow key={flujo.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/editor-flujo/${flujo.id}`} className="hover:underline text-primary">
                      {flujo.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {flujo.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(flujo.status)}</TableCell>
                  <TableCell className="text-sm">{formatRelativeDate(flujo.last_edited || flujo.updated_at)}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {flujo.last_activity || "Sin actividad reciente"}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={isLoading}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menú de opciones para {flujo.name}</span>
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Más opciones</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/editor-flujo/${flujo.id}`}>Editar Flujo</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateClick(flujo)} disabled={isLoading}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar Flujo
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/flujos/${flujo.id}/metricas`}>Ver Métricas</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(flujo)}
                            disabled={isLoading}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar Flujo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedFlow && (
        <FlowDeleteDialog
          flowId={selectedFlow.id}
          flowName={selectedFlow.name}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          loading={isLoading}
        />
      )}
    </div>
  )
}
