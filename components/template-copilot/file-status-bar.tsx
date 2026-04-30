"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown, ExternalLink } from "lucide-react"

export function FileStatusBar() {
  return (
    <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
      {/* Left: File info */}
      <div className="flex items-center gap-3">
        {/* PowerPoint icon */}
        <div className="w-10 h-10 rounded-lg bg-[#D24726]/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#D24726]">
            <path fill="currentColor" d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
            <path fill="white" d="M14 2l6 6h-6V2z" opacity="0.5"/>
            <text x="7" y="17" fontSize="7" fontWeight="bold" fill="white">P</text>
          </svg>
        </div>

        {/* File name with dropdown */}
        <button className="flex items-center gap-1.5 hover:bg-muted rounded-md px-2 py-1 -ml-1 transition-colors">
          <span className="font-medium text-foreground">Project Approval Template v3.pptx</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Upload status */}
        <div className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span>Uploaded successfully</span>
        </div>
      </div>

      {/* Right: Original file preserved badge + View button */}
      <div className="flex items-center gap-3">
        {/* Original file preserved badge */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-sm">Original file preserved</span>
            <span className="text-xs text-muted-foreground">No changes to your template</span>
          </div>
        </div>

        {/* View original file button */}
        <Button variant="outline" className="gap-2 text-sm">
          <ExternalLink className="w-4 h-4" />
          View original file
        </Button>
      </div>
    </div>
  )
}
