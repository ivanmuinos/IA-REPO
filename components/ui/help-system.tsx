import React from "react"
import { HelpCircle, BookOpen, Video, FileText, ExternalLink, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Tooltip contextual mejorado
export function ContextualHelp({
  children,
  content,
  title,
  side = "top",
  className,
}: {
  children: React.ReactNode
  content: string
  title?: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center", className)}>
            {children}
            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {title && <p className="font-medium mb-1">{title}</p>}
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Centro de ayuda accesible
export function HelpCenter({
  sections,
  className,
}: {
  sections: Array<{
    id: string
    title: string
    description: string
    icon: React.ReactNode
    articles: Array<{ id: string; title: string; content: string }>
  }>
  className?: string
}) {
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = React.useState<string | null>(null)

  const currentSection = sections.find(s => s.id === selectedSection)
  const currentArticle = currentSection?.articles.find(a => a.id === selectedArticle)

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Centro de Ayuda</h2>
        <p className="text-muted-foreground">
          Encuentra respuestas a tus preguntas y aprende a usar la plataforma
        </p>
      </div>

      {!selectedSection ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                {section.icon}
                <h3 className="font-medium">{section.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </button>
          ))}
        </div>
      ) : !selectedArticle ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedSection(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Volver a secciones
          </button>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{currentSection?.title}</h3>
            <p className="text-muted-foreground">{currentSection?.description}</p>
          </div>

          <div className="space-y-2">
            {currentSection?.articles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article.id)}
                className="w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <h4 className="font-medium">{article.title}</h4>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Volver a artículos
          </button>
          
          <div className="prose prose-sm max-w-none">
            <h3 className="text-xl font-semibold">{currentArticle?.title}</h3>
            <div className="mt-4">
              {currentArticle?.content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Guía paso a paso para flujos complejos
export function StepByStepGuide({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  className,
}: {
  steps: Array<{
    id: string
    title: string
    description: string
    content: React.ReactNode
  }>
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => void
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Indicador de progreso */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Guía paso a paso</h3>
          <span className="text-sm text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                index <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium">{steps[currentStep]?.title}</h4>
          <p className="text-muted-foreground">{steps[currentStep]?.description}</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-muted/50">
          {steps[currentStep]?.content}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button onClick={onComplete}>
            Completar
          </Button>
        ) : (
          <Button onClick={() => onStepChange(currentStep + 1)}>
            Siguiente
          </Button>
        )}
      </div>
    </div>
  )
}

// Enlaces a documentación relevante
export function DocumentationLinks({
  links,
  className,
}: {
  links: Array<{
    title: string
    description: string
    url: string
    type: "guide" | "api" | "video" | "faq"
  }>
  className?: string
}) {
  const iconMap = {
    guide: BookOpen,
    api: FileText,
    video: Video,
    faq: HelpCircle,
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold">Documentación relacionada</h3>
      <div className="grid gap-3">
        {links.map((link, index) => {
          const Icon = iconMap[link.type]
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">{link.title}</h4>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          )
        })}
      </div>
    </div>
  )
}

// FAQ interactivo
export function FAQ({
  questions,
  className,
}: {
  questions: Array<{
    id: string
    question: string
    answer: string
  }>
  className?: string
}) {
  const [openQuestion, setOpenQuestion] = React.useState<string | null>(null)

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold">Preguntas frecuentes</h3>
      <div className="space-y-2">
        {questions.map((faq) => (
          <div key={faq.id} className="border rounded-lg">
            <button
              onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  openQuestion === faq.id && "rotate-90"
                )}
              />
            </button>
            {openQuestion === faq.id && (
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Botón de ayuda flotante
export function FloatingHelp({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center",
        className
      )}
      aria-label="Centro de ayuda"
    >
      <HelpCircle className="h-6 w-6" />
    </button>
  )
} 