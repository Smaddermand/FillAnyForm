"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles, Download, MoreVertical } from "lucide-react"

export function ActionBar() {
  return (
    <footer className="h-20 border-t border-border bg-card px-6 flex items-center justify-between shrink-0">
      {/* Left: Safety note */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Only approved fields will be changed.</span>
          <span className="text-sm text-muted-foreground">Layout and branding preserved.</span>
        </div>
        <button className="text-sm text-primary hover:underline ml-2">
          Learn more
        </button>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-3">
        {/* Generate filled PowerPoint - Primary CTA */}
        <Button size="lg" className="gap-2 px-6 h-12 text-base font-medium">
          <Sparkles className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span>Generate filled PowerPoint</span>
            <span className="text-xs font-normal opacity-80">Creates a new file with filled fields</span>
          </div>
        </Button>

        {/* Download .pptx */}
        <Button variant="outline" size="lg" className="gap-2 px-5 h-12">
          <Download className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Download .pptx</span>
            <span className="text-xs text-muted-foreground">Download current filled file</span>
          </div>
        </Button>

        {/* More button */}
        <Button variant="outline" size="icon" className="h-12 w-12">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </footer>
  )
}
