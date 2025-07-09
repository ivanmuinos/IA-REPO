"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface SidebarNavItem {
  title: string
  href: string
  icon: LucideIcon
  description: string
  name?: string
}

interface SidebarNavItemProps {
  item: SidebarNavItem
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.title || item.name}
    </Link>
  )
}
