"use client"

import { useState } from "react"
import { Header } from "@/components/template-copilot/header"
import { FileStatusBar } from "@/components/template-copilot/file-status-bar"
import { NavSidebar } from "@/components/template-copilot/nav-sidebar"
import { SlideThumbnails } from "@/components/template-copilot/slide-thumbnails"
import { SlideCanvas } from "@/components/template-copilot/slide-canvas"
import { RightPanel } from "@/components/template-copilot/right-panel"
import { ActionBar } from "@/components/template-copilot/action-bar"

export default function TemplateCopilotPage() {
  const [activeSlide, setActiveSlide] = useState(1)
  const [activeField, setActiveField] = useState<string | null>(null)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top header with logo and user menu */}
      <Header />

      {/* File status bar */}
      <FileStatusBar />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation sidebar */}
        <NavSidebar />

        {/* Slide thumbnails panel */}
        <SlideThumbnails
          activeSlide={activeSlide}
          onSlideSelect={setActiveSlide}
        />

        {/* Center canvas */}
        <SlideCanvas
          activeField={activeField}
          onFieldSelect={setActiveField}
        />

        {/* Right panel with AI chat and field review */}
        <RightPanel />
      </div>

      {/* Bottom action bar */}
      <ActionBar />
    </div>
  )
}
