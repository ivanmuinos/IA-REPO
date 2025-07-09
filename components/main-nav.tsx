import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Onboarding Platform
      </Link>
    </div>
  )
}
