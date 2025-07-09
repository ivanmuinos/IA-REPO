"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertCircle, Eye, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { empresasDemo } from "@/components/juridico-list"

interface ApprovalQueueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "personas" | "juridico"
}

interface ApprovalItem {
  id: number
  nombre: string
  documento: string
  flujo: string
  fecha: string
}

export function ApprovalQueueModal({ open, onOpenChange, type }: ApprovalQueueModalProps) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ApprovalItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open, type])

  const loadData = async () => {
    setLoading(true)
    try {
      if (type === "personas") {
        // For personas, we would use the PersonasService
        // const allPersonas = await PersonasService.getAllPersonas()
        // const pendingReview = allPersonas.filter((p) => p.estado === "revision")
        // setItems(pendingReview)
        setItems([]) // Placeholder until PersonasService is properly implemented
      } else {
        // For juridico, use the demo data
        const pendingReview = empresasDemo.filter((e) => e.estado === "revision")
        setItems(pendingReview)
      }
    } catch (error) {
      console.error("Error loading approval queue data:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los casos pendientes",
        variant: "destructive",
      })
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const getModalConfig = () => {
    return type === "personas"
      ? {
          title: "Cola de aprobación de personas",
          description: "Casos de verificación de identidad que requieren revisión manual",
          entityLabel: "Nombre",
        }
      : {
          title: "Cola de aprobación de empresas",
          description: "Casos de verificación de empresas que requieren revisión manual",
          entityLabel: "Empresa",
        }
  }

  const getDetailsPath = (id: number) => {
    return type === "personas" ? `/personas/${id}` : `/juridico/${id}`
  }

  const config = getModalConfig()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No hay casos pendientes</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              No hay casos que requieran revisión manual en este momento. Los nuevos casos aparecerán aquí cuando estén
              listos para revisión.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">{config.entityLabel}</TableHead>
                  <TableHead className="font-semibold">Documento</TableHead>
                  <TableHead className="font-semibold">Flujo</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="font-mono text-sm">{item.documento}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {item.flujo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.fecha}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={getDetailsPath(item.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Revisar
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "caso" : "casos"} pendientes de revisión manual
          </p>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
