"use client"

import { cn } from "@/lib/utils"
import { Layers, FormInput, MessageSquare, History, Settings, ChevronRight } from "lucide-react"

interface NavItem {
  icon: React.ElementType
  label: string
  active?: boolean
}

const navItems: NavItem[] = [
  { icon: Layers, label: "Slides", active: true },
  { icon: FormInput, label: "Fields" },
  { icon: MessageSquare, label: "Chat" },
  { icon: History, label: "History" },
  { icon: Settings, label: "Settings" },
]

export function NavSidebar() {
  return (
    <nav className="w-16 border-r border-border bg-card flex flex-col shrink-0">
      {/* Main nav items */}
      <div className="flex-1 flex flex-col items-center py-3 gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom expand button */}
      <div className="pb-3 flex justify-center">
        <button className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}
