import Link from "next/link"
import { Book, Headphones } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-muted bg-muted mt-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Administrador de Flujos de Onboarding. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/documentacion"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Acceder a la documentación del sistema"
            >
              <Book className="h-4 w-4" />
              <span>Documentación</span>
            </Link>
            <Link
              href="/soporte"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Contactar al soporte técnico"
            >
              <Headphones className="h-4 w-4" />
              <span>Soporte</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
