import React from "react"
import { Keyboard, CheckSquare, Square, Trash2, Copy, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Hook para atajos de teclado
export function useKeyboardShortcuts(shortcuts: Array<{
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}>) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}

// Componente para mostrar atajos de teclado
export function KeyboardShortcuts({
  shortcuts,
  className,
}: {
  shortcuts: Array<{ key: string; description: string; ctrl?: boolean; shift?: boolean; alt?: boolean }>
  className?: string
}) {
  const formatKey = (shortcut: any) => {
    const parts = []
    if (shortcut.ctrl) parts.push("Ctrl")
    if (shortcut.shift) parts.push("Shift")
    if (shortcut.alt) parts.push("Alt")
    parts.push(shortcut.key.toUpperCase())
    return parts.join(" + ")
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Keyboard className="h-4 w-4" />
        <span>Atajos de teclado</span>
      </div>
      <div className="space-y-1">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <kbd className="px-2 py-1 text-xs bg-muted rounded border">
              {formatKey(shortcut)}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}

// Selección múltiple para acciones en lote
export function BatchSelector<T extends { id: string }>({
  items,
  selectedItems,
  onSelectionChange,
  onBatchAction,
  className,
}: {
  items: T[]
  selectedItems: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onBatchAction: (action: string, selectedItems: T[]) => void
  className?: string
}) {
  const allSelected = items.length > 0 && selectedItems.length === items.length
  const someSelected = selectedItems.length > 0 && !allSelected

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(items.map(item => item.id))
    }
  }

  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId))
    } else {
      onSelectionChange([...selectedItems, itemId])
    }
  }

  const selectedItemsData = items.filter(item => selectedItems.includes(item.id))

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barra de acciones en lote */}
      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedItems.length} elemento{selectedItems.length !== 1 ? 's' : ''} seleccionado{selectedItems.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchAction("delete", selectedItemsData)}
              className="h-8 px-3 text-sm"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Eliminar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchAction("copy", selectedItemsData)}
              className="h-8 px-3 text-sm"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchAction("export", selectedItemsData)}
              className="h-8 px-3 text-sm"
            >
              <Download className="h-3 w-3 mr-1" />
              Exportar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de elementos con checkboxes */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <button
              onClick={() => handleSelectItem(item.id)}
              className="flex items-center justify-center w-5 h-5"
            >
              {selectedItems.includes(item.id) ? (
                <CheckSquare className="h-5 w-5 text-primary" />
              ) : (
                <Square className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1">
              {/* Aquí puedes renderizar el contenido del item */}
              <div className="text-sm font-medium">
                {item.id} {/* Reemplaza con la propiedad correcta */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkbox "Seleccionar todo" */}
      {items.length > 0 && (
        <div className="flex items-center gap-3 p-3 border-t">
          <button
            onClick={handleSelectAll}
            className="flex items-center justify-center w-5 h-5"
          >
            {allSelected ? (
              <CheckSquare className="h-5 w-5 text-primary" />
            ) : someSelected ? (
              <div className="w-5 h-5 border-2 border-primary rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-sm" />
              </div>
            ) : (
              <Square className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <span className="text-sm font-medium">
            {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
          </span>
        </div>
      )}
    </div>
  )
}

// Búsqueda avanzada con filtros
export function AdvancedSearch({
  onSearch,
  filters,
  className,
}: {
  onSearch: (query: string, filters: Record<string, any>) => void
  filters: Array<{ id: string; label: string; type: "text" | "select" | "date" }>
  className?: string
}) {
  const [query, setQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, any>>({})

  const handleSearch = () => {
    onSearch(query, activeFilters)
  }

  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }))
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 px-3 py-2 border rounded-md"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>
          Buscar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm font-medium">{filter.label}</label>
            {filter.type === "text" && (
              <input
                type="text"
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            )}
            {filter.type === "select" && (
              <select
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            )}
            {filter.type === "date" && (
              <input
                type="date"
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Vistas personalizables
export function CustomizableView({
  views,
  currentView,
  onViewChange,
  onSaveView,
  className,
}: {
  views: Array<{ id: string; name: string; icon?: React.ReactNode }>
  currentView: string
  onViewChange: (viewId: string) => void
  onSaveView: (viewName: string) => void
  className?: string
}) {
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [newViewName, setNewViewName] = React.useState("")

  const handleSaveView = () => {
    if (newViewName.trim()) {
      onSaveView(newViewName.trim())
      setNewViewName("")
      setShowSaveDialog(false)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              currentView === view.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {view.icon}
            {view.name}
          </button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          className="h-8 px-3 text-sm"
        >
          Guardar vista
        </Button>
      </div>

      {showSaveDialog && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="text-sm font-medium mb-2">Guardar vista actual</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder="Nombre de la vista"
              className="flex-1 px-3 py-2 border rounded-md"
              onKeyDown={(e) => e.key === "Enter" && handleSaveView()}
            />
            <Button size="sm" onClick={handleSaveView}>
              Guardar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 