"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Minus, Plus, Maximize2, ChevronLeft, ChevronRight, Maximize } from "lucide-react"

interface FieldCallout {
  id: string
  label: string
  placeholder: string
  position: { top: string; left: string; width: string }
  number: number
  icon: "folder" | "user" | "chart" | "alert" | "check"
}

const fieldCallouts: FieldCallout[] = [
  {
    id: "project-name",
    label: "Project name",
    placeholder: "Click to add Project name",
    position: { top: "48%", left: "5%", width: "45%" },
    number: 1,
    icon: "folder",
  },
  {
    id: "business-owner",
    label: "Business owner",
    placeholder: "Click to add Business owner",
    position: { top: "55%", left: "5%", width: "45%" },
    number: 2,
    icon: "user",
  },
  {
    id: "expected-benefit",
    label: "Expected benefit (yearly)",
    placeholder: "Click to add Expected benefit",
    position: { top: "62%", left: "5%", width: "45%" },
    number: 3,
    icon: "chart",
  },
  {
    id: "risks",
    label: "Risks",
    placeholder: "Click to add Risks",
    position: { top: "69%", left: "5%", width: "45%" },
    number: 4,
    icon: "alert",
  },
  {
    id: "decision-needed",
    label: "Decision needed",
    placeholder: "Click to add Decision needed",
    position: { top: "76%", left: "5%", width: "45%" },
    number: 5,
    icon: "check",
  },
]

function FieldIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4 text-muted-foreground"
  
  switch (type) {
    case "folder":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    case "user":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case "chart":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      )
    case "alert":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case "check":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    default:
      return null
  }
}

interface SlideCanvasProps {
  activeField: string | null
  onFieldSelect: (id: string) => void
}

export function SlideCanvas({ activeField, onFieldSelect }: SlideCanvasProps) {
  return (
    <div className="flex-1 bg-muted/30 flex flex-col overflow-hidden">
      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div className="relative w-full max-w-4xl">
          {/* Slide container */}
          <div className="relative bg-white rounded-lg shadow-lg border border-border overflow-hidden">
            {/* Slide aspect ratio container (16:9) */}
            <div className="aspect-video relative">
              {/* Blue header with company branding */}
              <div className="absolute top-0 left-0 right-0 h-[18%] bg-primary flex items-center px-6 gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm tracking-wide">NORTHRIDGE</span>
                  <span className="text-white/70 text-xs tracking-widest">CONSULTING</span>
                </div>

                {/* Decorative geometric shapes */}
                <div className="absolute top-0 right-0 w-[60%] h-full overflow-hidden">
                  <svg className="absolute right-0 top-0 h-full w-auto" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <polygon points="100,0 400,0 400,100 200,100" fill="rgba(255,255,255,0.1)" />
                    <polygon points="150,0 400,0 400,100 250,100" fill="rgba(255,255,255,0.05)" />
                  </svg>
                </div>
              </div>

              {/* Main content area */}
              <div className="absolute top-[18%] left-0 right-0 bottom-[8%] flex">
                {/* Left side - Title and fields */}
                <div className="w-[55%] p-6 flex flex-col">
                  {/* Main title */}
                  <h1 className="text-3xl font-bold text-primary leading-tight tracking-tight">
                    PROJECT APPROVAL<br />REQUEST
                  </h1>

                  {/* Form fields */}
                  <div className="mt-6 flex flex-col gap-2">
                    {fieldCallouts.map((field) => (
                      <button
                        key={field.id}
                        onClick={() => onFieldSelect(field.id)}
                        className={cn(
                          "flex items-center gap-3 text-left transition-all rounded",
                          activeField === field.id && "ring-2 ring-primary ring-offset-1"
                        )}
                      >
                        {/* Icon */}
                        <FieldIcon type={field.icon} />

                        {/* Label */}
                        <span className="text-sm text-muted-foreground w-36 shrink-0">
                          {field.label}
                        </span>

                        {/* Input field */}
                        <div className="flex-1 flex items-center">
                          <div className="flex-1 bg-rose-100/80 rounded px-3 py-1.5 text-sm text-rose-400">
                            {field.placeholder}
                          </div>
                          {/* Number badge */}
                          <div className="ml-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-white">{field.number}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right side - Building image placeholder */}
                <div className="w-[45%] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                    {/* Building illustration placeholder */}
                    <div className="w-full h-full relative overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
                        {/* Sky */}
                        <rect x="0" y="0" width="200" height="200" fill="#e0f2fe" />
                        {/* Buildings - simplified skyline */}
                        <rect x="10" y="80" width="40" height="120" fill="#0284c7" opacity="0.6" />
                        <rect x="55" y="50" width="50" height="150" fill="#0369a1" opacity="0.7" />
                        <rect x="110" y="70" width="35" height="130" fill="#0284c7" opacity="0.5" />
                        <rect x="150" y="90" width="45" height="110" fill="#0369a1" opacity="0.6" />
                        {/* Windows */}
                        <g fill="#bae6fd" opacity="0.8">
                          <rect x="60" y="60" width="8" height="6" />
                          <rect x="72" y="60" width="8" height="6" />
                          <rect x="84" y="60" width="8" height="6" />
                          <rect x="60" y="75" width="8" height="6" />
                          <rect x="72" y="75" width="8" height="6" />
                          <rect x="84" y="75" width="8" height="6" />
                          <rect x="60" y="90" width="8" height="6" />
                          <rect x="72" y="90" width="8" height="6" />
                          <rect x="84" y="90" width="8" height="6" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-muted/50 flex items-center justify-between px-6 text-xs text-muted-foreground">
                <span className="font-medium">CONFIDENTIAL</span>
                <span className="font-medium">NORTHRIDGE CONSULTING</span>
                <span>v3.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="h-12 border-t border-border bg-card px-4 flex items-center justify-between shrink-0">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground px-2 min-w-[40px] text-center">86%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Slide navigation */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">1</span> / 12
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Fit to width */}
        <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
          <Maximize className="w-4 h-4" />
          Fit to width
        </Button>
      </div>
    </div>
  )
}
