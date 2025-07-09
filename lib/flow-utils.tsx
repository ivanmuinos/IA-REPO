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

export function getNodeIcon(type: string) {
  switch (type) {
    case "inicio":
      return <Play className="h-4 w-4 text-primary" />
    case "ocr":
      return <FileText className="h-4 w-4 text-primary" />
    case "biometria":
      return <UserCheck className="h-4 w-4 text-primary" />
    case "listas":
      return <FileCheck className="h-4 w-4 text-primary" />
    case "revision":
      return <AlertCircle className="h-4 w-4 text-primary" />
    case "decision":
      return <CircleCheck className="h-4 w-4 text-primary" />
    case "mensaje":
      return <MessageSquare className="h-4 w-4 text-primary" />
    case "fin":
      return <CheckCircle2 className="h-4 w-4 text-primary" />
    default:
      return <Play className="h-4 w-4 text-primary" />
  }
}
