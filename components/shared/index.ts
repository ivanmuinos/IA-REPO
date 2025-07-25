// Page Header Components
export { UnifiedPageHeader } from './PageHeader/UnifiedPageHeader'
export type { ActionConfig, StatusConfig, TabConfig } from './PageHeader/UnifiedPageHeader'

// Section Components
export { SectionCard } from './Sections/SectionCard'

// Navigation Components
export { BreadcrumbNav } from './Navigation/BreadcrumbNav'

// Error Handling Components
export { ErrorBoundary, ErrorFallback, useErrorHandler } from './ErrorBoundary/ErrorBoundary'

// Loading Components
export { 
  LoadingSpinner, 
  SectionLoading, 
  PageLoading, 
  TableLoading 
} from './LoadingStates/LoadingSpinner'

// Template Components
export { DetailPageTemplate } from '../templates/DetailPageTemplate'
export { DetailSidebar } from '../templates/DetailSidebar'
export type { SectionConfig, SidebarConfig } from '../templates/DetailPageTemplate'

// Module-specific Templates
export { PersonaDetailTemplate } from '../personas/PersonaDetailTemplate'
export { JuridicoDetailTemplate } from '../juridico/JuridicoDetailTemplate'

// Actions and Info Components
export { ActionsCard, type ActionItem } from './ActionsCard/ActionsCard'
export { InfoField, InfoGrid } from './InfoField/InfoField'

// Re-export common UI components for convenience
export { Button } from '../ui/button'
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
export { Badge } from '../ui/badge'
export { Progress } from '../ui/progress'
export { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
export { Alert, AlertDescription, AlertTitle } from '../ui/alert'
export { Skeleton } from '../ui/skeleton'
export { Separator } from '../ui/separator'
export { InfoField as InfoFieldLegacy, InfoFieldWithBadge } from '../ui/info-field' 