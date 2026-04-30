"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Doc, Id } from "@/convex/_generated/dataModel";

type DecorativeType = "title" | "summary" | "chart" | "list" | "decision";

const DECORATIVE_TYPES: readonly DecorativeType[] = [
  "title",
  "summary",
  "chart",
  "list",
  "decision",
];

interface SlideThumbnailPreviewProps {
  slideNumber: number;
  type: DecorativeType;
  isActive: boolean;
}

function SlideThumbnailPreview({
  slideNumber,
  type,
  isActive,
}: SlideThumbnailPreviewProps) {
  return (
    <div
      className={cn(
        "aspect-video bg-white rounded border relative overflow-hidden",
        isActive ? "border-primary" : "border-border",
      )}
    >
      {/* Blue header bar */}
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-primary/90" />

      {/* Slide number badge */}
      <div className="absolute top-1 left-1 w-4 h-4 rounded bg-primary flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">{slideNumber}</span>
      </div>

      {/* Content based on type */}
      {type === "title" && (
        <div className="absolute top-[35%] left-2 right-2">
          <div className="text-[6px] font-bold text-foreground leading-tight uppercase">
            Project Approval
          </div>
          <div className="text-[5px] font-bold text-foreground leading-tight uppercase">
            Request
          </div>
        </div>
      )}

      {type === "summary" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="h-1.5 w-3/4 bg-primary/20 rounded-sm" />
          <div className="text-[5px] font-semibold text-primary uppercase">
            Executive Summary
          </div>
          <div className="h-1 w-full bg-muted rounded-sm" />
          <div className="h-1 w-4/5 bg-muted rounded-sm" />
        </div>
      )}

      {type === "chart" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="text-[5px] font-semibold text-primary uppercase">
            Business Case
          </div>
          <div className="flex items-end gap-0.5 h-4 mt-1">
            <div className="w-1.5 h-2 bg-primary/40 rounded-t-sm" />
            <div className="w-1.5 h-3 bg-primary/60 rounded-t-sm" />
            <div className="w-1.5 h-4 bg-primary rounded-t-sm" />
            <div className="w-1.5 h-2.5 bg-primary/50 rounded-t-sm" />
          </div>
        </div>
      )}

      {type === "list" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="text-[5px] font-semibold text-primary uppercase">
            Risks & Mitigations
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="h-1 w-full bg-muted rounded-sm" />
            <div className="h-1 w-3/4 bg-muted rounded-sm" />
            <div className="h-1 w-5/6 bg-muted rounded-sm" />
          </div>
        </div>
      )}

      {type === "decision" && (
        <div className="absolute top-[35%] left-2 right-2 flex flex-col gap-0.5">
          <div className="text-[5px] font-semibold text-primary uppercase">
            Decision
          </div>
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
      {type === "title" && (
        <div className="absolute top-[30%] right-1 bottom-2 w-[40%] bg-muted/50 rounded" />
      )}
    </div>
  );
}

interface SlideThumbnailsProps {
  slides: Doc<"slides">[];
  activeSlideId: Id<"slides"> | null;
  onSlideSelect: (id: Id<"slides">) => void;
}

export function SlideThumbnails({
  slides,
  activeSlideId,
  onSlideSelect,
}: SlideThumbnailsProps) {
  return (
    <div className="w-56 border-r border-border bg-card flex flex-col shrink-0">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">Slides</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-3">
          {slides.length === 0 ? (
            <p className="text-xs text-muted-foreground px-1">No slides yet</p>
          ) : (
            slides.map((slide, index) => {
              const decorativeType = DECORATIVE_TYPES[index % DECORATIVE_TYPES.length]!;
              const caption =
                slide.title ?? `Slide ${slide.slideNumber}`;
              return (
                <button
                  key={slide._id}
                  type="button"
                  onClick={() => onSlideSelect(slide._id)}
                  className={cn(
                    "group relative rounded-lg transition-all text-left p-1",
                    activeSlideId === slide._id
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-muted",
                  )}
                >
                  <SlideThumbnailPreview
                    slideNumber={slide.slideNumber}
                    type={decorativeType}
                    isActive={activeSlideId === slide._id}
                  />
                  <div className="mt-1.5 px-0.5">
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {caption}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
