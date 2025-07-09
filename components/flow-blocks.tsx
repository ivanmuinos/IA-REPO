import {
  AlertCircle,
  CheckCircle2,
  CircleCheck,
  FileCheck,
  FileText,
  MessageSquare,
  Play,
  UserCheck,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function FlowBlocks() {
  const blocks = [
    {
      id: "inicio",
      name: "Inicio",
      description: "Punto de entrada del flujo",
      icon: Play,
      fixed: true,
    },
    {
      id: "ocr",
      name: "OCR de documento",
      description: "Escaneo y validación de documentos",
      icon: FileText,
    },
    {
      id: "biometria",
      name: "Validación biométrica",
      description: "Verificación facial y prueba de vida",
      icon: UserCheck,
    },
    {
      id: "listas",
      name: "Validación contra listas",
      description: "Verificación en listas restrictivas",
      icon: FileCheck,
    },
    {
      id: "revision",
      name: "Revisión manual",
      description: "Revisión por un operador humano",
      icon: AlertCircle,
    },
    {
      id: "decision",
      name: "Decisión automática",
      description: "Aprobación o rechazo basado en reglas",
      icon: CircleCheck,
    },
    {
      id: "mensaje",
      name: "Mensaje personalizado",
      description: "Comunicación con el usuario",
      icon: MessageSquare,
    },
    {
      id: "fin",
      name: "Fin del flujo",
      description: "Punto de salida del flujo",
      icon: CheckCircle2,
      fixed: true,
    },
  ]

  return (
    <div className="space-y-3">
      {blocks.map((block) => (
        <Card key={block.id} className="cursor-grab hover:bg-muted/50 transition-colors">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <block.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{block.name}</p>
              <p className="text-xs text-muted-foreground">{block.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
