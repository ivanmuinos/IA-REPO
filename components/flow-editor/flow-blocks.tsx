"use client"

import { useState, useEffect } from "react"
import type React from "react"
import {
  AlertCircle,
  CheckCircle2,
  CircleCheck,
  FileCheck,
  FileText,
  MessageSquare,
  Play,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Mail,
  Bell,
  StopCircle,
  Database,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { clientStepLibraryService, type StepLibraryItem } from "@/lib/step-library-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FlowBlocksProps {
  onDragStart?: (blockType: string) => void
  allCollapsed?: boolean
  combineActionCategories?: boolean
  capitalizeCategories?: boolean
  enableDragForAllSteps?: boolean
}

// Mapeo de nombres de iconos a componentes de Lucide
const iconMap: Record<string, React.ElementType> = {
  Play: Play,
  CheckCircle2: CheckCircle2,
  FileText: FileText,
  UserCheck: UserCheck,
  FileCheck: FileCheck,
  AlertCircle: AlertCircle,
  CircleCheck: CircleCheck,
  MessageSquare: MessageSquare,
  Mail: Mail,
  Bell: Bell,
  StopCircle: StopCircle,
  Database: Database,
}

export function FlowBlocks({
  onDragStart,
  allCollapsed = false,
  combineActionCategories = false,
  capitalizeCategories = false,
  enableDragForAllSteps = false,
}: FlowBlocksProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blocksByCategory, setBlocksByCategory] = useState<Record<string, StepLibraryItem[]>>({})
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    // Si allCollapsed es true, todas las categorías estarán cerradas
    if (allCollapsed) {
      return {
        Sistema: false,
        Validaciones: false,
        Acciones: false,
        Actions: false,
        Integrations: false,
      }
    }

    // Estado por defecto si allCollapsed es false
    return {
      Sistema: true,
      Validaciones: true,
      Acciones: true,
      Actions: true,
      Integrations: true,
    }
  })

  // Cargar los bloques desde Supabase
  useEffect(() => {
    const loadStepLibrary = async () => {
      try {
        setLoading(true)
        const steps = await clientStepLibraryService.getStepLibrary()

        // Agrupar por categoría
        const groupedSteps: Record<string, StepLibraryItem[]> = {}
        steps.forEach((step) => {
          // Obtener la categoría original
          let category = step.category

          // Combinar "action" y "Actions" si se solicita
          if (
            combineActionCategories &&
            (category.toLowerCase() === "action" || category.toLowerCase() === "actions")
          ) {
            category = "Actions"
          }

          // Capitalizar la primera letra si se solicita
          if (capitalizeCategories) {
            category = category.charAt(0).toUpperCase() + category.slice(1)
          }

          if (!groupedSteps[category]) {
            groupedSteps[category] = []
          }
          groupedSteps[category].push(step)
        })

        setBlocksByCategory(groupedSteps)
        setError(null)
      } catch (err) {
        console.error("Error loading step library:", err)
        setError("No se pudieron cargar los bloques. Intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadStepLibrary()
  }, [combineActionCategories, capitalizeCategories])

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData("blockType", blockType)
    if (onDragStart) {
      onDragStart(blockType)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, blockType: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (onDragStart) {
        onDragStart(blockType)
      }
    }
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Renderizar un esqueleto de carga
  if (loading) {
    return (
      <div className="space-y-6">
        {["Sistema", "Validaciones", "Acciones"].map((category) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-[72px] w-full" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-sm text-primary hover:underline">
          Reintentar
        </button>
      </div>
    )
  }

  // Si no hay categorías, mostrar mensaje
  if (Object.keys(blocksByCategory).length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">No hay bloques disponibles.</p>
      </div>
    )
  }

  // Renderizar los bloques agrupados por categoría
  return (
    <div className="space-y-6">
      <TooltipProvider>
        {Object.entries(blocksByCategory).map(([category, blocks]) => (
          <Collapsible
            key={category}
            open={openCategories[category]}
            onOpenChange={() => toggleCategory(category)}
            className="space-y-3"
          >
            <CollapsibleTrigger className="flex items-center w-full text-left">
              {openCategories[category] ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3">
              {blocks.map((block) => {
                // Determinar si el bloque es fijo (como inicio o fin)
                const isFixed = enableDragForAllSteps ? false : block.is_template
                // Obtener el componente de icono correspondiente
                const IconComponent = iconMap[block.icon] || AlertCircle

                return (
                  <Card
                    key={block.id}
                    className={`cursor-grab hover:bg-muted/50 transition-colors ${isFixed ? "opacity-50" : ""}`}
                    draggable={!isFixed}
                    onDragStart={(e) => handleDragStart(e, block.type)}
                    onKeyDown={(e) => handleKeyDown(e, block.type)}
                    tabIndex={isFixed ? -1 : 0}
                    role="button"
                    aria-label={`Bloque ${block.title}`}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{block.title}</p>
                        <p className="text-xs text-muted-foreground">{block.description}</p>
                      </div>
                      {isFixed && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="ml-auto">
                              <CheckCircle2
                                className="h-4 w-4 text-muted-foreground"
                                aria-label="Este bloque ya está en el flujo"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Este bloque ya está en el flujo</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </TooltipProvider>
    </div>
  )
}
