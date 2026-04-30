"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Slide {
  id: number
  title: string
  type: "title" | "summary" | "chart" | "list" | "decision"
}

const slides: Slide[] = [
  { id: 1, title: "Slide 1", type: "title" },
  { id: 2, title: "Slide 2", type: "summary" },
  { id: 3, title: "Slide 3", type: "chart" },
  { id: 4, title: "Slide 4", type: "list" },
  { id: 5, title: "Slide 5", type: "decision" },
]

interface SlideThumbnailsProps {
  activeSlide: number
  onSlideSelect: (id: number) => void
}

function SlideThumbnailPreview({ slide, isActive }: { slide: Slide; isActive: boolean }) {
  return (
    <div className={cn(
      "aspect-video bg-white rounded border relative overflow-hidden",
      isActive ? "border-primary" : "border-border"
    )}>
      {/* Blue header bar */}
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-primary/90" />
      
      {/* Slide number badge */}
      <div className="absolute top-1 left-1 w-4 h-4 rounded bg-primary flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">{slide.id}</span>
      </div>

      {/* Content based on type */}
      {slide.type === "title" && (
        <div className="absolute top-[35%] left-2 right-2">
          <div className="text-[6px] font-bold text-foreground leading-tight uppercase">
            Project Approval
          </div>
          <div className="text-[5px] font-bold text-foreground leading-tight uppercase">
            Request
          </div>
        </div>
      )}

      {slide.type === "summary" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="h-1.5 w-3/4 bg-primary/20 rounded-sm" />
          <div className="text-[5px] font-semibold text-primary uppercase">Executive Summary</div>
          <div className="h-1 w-full bg-muted rounded-sm" />
          <div className="h-1 w-4/5 bg-muted rounded-sm" />
        </div>
      )}

      {slide.type === "chart" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="text-[5px] font-semibold text-primary uppercase">Business Case</div>
          <div className="flex items-end gap-0.5 h-4 mt-1">
            <div className="w-1.5 h-2 bg-primary/40 rounded-t-sm" />
            <div className="w-1.5 h-3 bg-primary/60 rounded-t-sm" />
            <div className="w-1.5 h-4 bg-primary rounded-t-sm" />
            <div className="w-1.5 h-2.5 bg-primary/50 rounded-t-sm" />
          </div>
        </div>
      )}

      {slide.type === "list" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="text-[5px] font-semibold text-primary uppercase">Risks & Mitigations</div>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="h-1 w-full bg-muted rounded-sm" />
            <div className="h-1 w-3/4 bg-muted rounded-sm" />
            <div className="h-1 w-5/6 bg-muted rounded-sm" />
          </div>
        </div>
      )}

      {slide.type === "decision" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="text-[5px] font-semibold text-primary uppercase">Decision</div>
          <div className="flex gap-1 mt-1">
            <div className="w-3 h-3 rounded bg-muted flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="w-3 h-3 rounded bg-muted flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="w-3 h-3 rounded bg-muted flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
        </div>
      )}

      {/* Right side image placeholder for title slide */}
      {slide.type === "title" && (
        <div className="absolute top-[30%] right-1 bottom-2 w-[40%] bg-muted/50 rounded" />
      )}
    </div>
  )
}

export function SlideThumbnails({ activeSlide, onSlideSelect }: SlideThumbnailsProps) {
  return (
    <div className="w-56 border-r border-border bg-card flex flex-col shrink-0">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">Slides</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-3">
          {slides.map((slide) => (
            <button
              key={slide.id}
              onClick={() => onSlideSelect(slide.id)}
              className={cn(
                "group relative rounded-lg transition-all text-left p-1",
                activeSlide === slide.id
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-muted"
              )}
            >
              <SlideThumbnailPreview slide={slide} isActive={activeSlide === slide.id} />
              <div className="mt-1.5 px-0.5">
                <span className="text-xs text-muted-foreground">{slide.title}</span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
