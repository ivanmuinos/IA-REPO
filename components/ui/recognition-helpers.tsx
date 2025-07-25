import React from "react"
import { HelpCircle, Clock, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Tooltip explicativo para iconos y botones
export function HelpTooltip({
  children,
  content,
  side = "top",
  className,
}: {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center", className)}>
            {children}
            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Historial de elementos recientes
export function RecentItems({
  items,
  onSelect,
  maxItems = 5,
  className,
}: {
  items: Array<{ id: string; title: string; subtitle?: string; timestamp: string }>
  onSelect: (item: any) => void
  maxItems?: number
  className?: string
}) {
  const recentItems = items.slice(0, maxItems)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Elementos recientes</span>
      </div>
      <div className="space-y-1">
        {recentItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Campo de búsqueda con autocompletado
export function SearchWithAutocomplete({
  value,
  onChange,
  onSearch,
  suggestions = [],
  placeholder = "Buscar...",
  className,
}: {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  suggestions?: Array<{ id: string; title: string; subtitle?: string }>
  placeholder?: string
  className?: string
}) {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(value)
    setShowSuggestions(value.length > 0)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const suggestion = suggestions[selectedIndex]
        onChange(suggestion.title)
        onSearch(suggestion.title)
        setShowSuggestions(false)
      } else {
        onSearch(value)
        setShowSuggestions(false)
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    onChange(suggestion.title)
    onSearch(suggestion.title)
    setShowSuggestions(false)
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(value.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full text-left p-3 hover:bg-muted transition-colors",
                index === selectedIndex && "bg-muted"
              )}
            >
              <p className="text-sm font-medium">{suggestion.title}</p>
              {suggestion.subtitle && (
                <p className="text-xs text-muted-foreground">{suggestion.subtitle}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Filtros rápidos con estados guardados
export function QuickFilters({
  filters,
  activeFilters,
  onFilterChange,
  className,
}: {
  filters: Array<{ id: string; label: string; icon?: React.ReactNode }>
  activeFilters: string[]
  onFilterChange: (filterId: string, active: boolean) => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filtros:</span>
      </div>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id, !activeFilters.includes(filter.id))}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors",
            activeFilters.includes(filter.id)
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  )
}

// Estados guardados en localStorage
export function useSavedState<T>(key: string, defaultValue: T) {
  const [state, setState] = React.useState<T>(() => {
    if (typeof window === "undefined") return defaultValue
    
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const updateState = React.useCallback((newState: T) => {
    setState(newState)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(newState))
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [key])

  return [state, updateState] as const
}

// Componente para mostrar información contextual
export function ContextualInfo({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("p-4 bg-muted/50 rounded-lg", className)}>
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  )
} 