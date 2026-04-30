"use client";

import { useEffect, useMemo, useState } from "react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Header } from "./header";
import { FileStatusBar } from "./file-status-bar";
import { NavSidebar } from "./nav-sidebar";
import { SlideThumbnails } from "./slide-thumbnails";
import { SlideCanvas } from "./slide-canvas";
import { RightPanel } from "./right-panel";
import { ActionBar } from "./action-bar";

interface Props {
  template: Doc<"templates">;
  slides: Doc<"slides">[];
  fields: Doc<"fields">[];
  chatMessages: Doc<"chatMessages">[];
}

export function WorkspaceShell({
  template,
  slides,
  fields,
  chatMessages,
}: Props) {
  const [activeSlideId, setActiveSlideId] = useState<Id<"slides"> | null>(
    slides[0]?._id ?? null,
  );
  const [activeFieldId, setActiveFieldId] = useState<Id<"fields"> | null>(
    null,
  );

  useEffect(() => {
    if (!activeSlideId && slides[0]) setActiveSlideId(slides[0]._id);
  }, [slides, activeSlideId]);

  const activeSlide =
    slides.find((s) => s._id === activeSlideId) ?? slides[0] ?? null;

  const slideFields = useMemo(() => {
    if (!activeSlide) return [];
    return fields
      .filter((f) => f.slideId === activeSlide._id)
      .sort((a, b) => a.order - b.order);
  }, [activeSlide, fields]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <FileStatusBar name={template.name} status={template.status} />
      <div className="flex-1 flex overflow-hidden">
        <NavSidebar />
        <SlideThumbnails
          slides={slides}
          activeSlideId={activeSlide?._id ?? null}
          onSlideSelect={setActiveSlideId}
        />
        <SlideCanvas
          fields={slideFields}
          activeFieldId={activeFieldId}
          onFieldSelect={setActiveFieldId}
          slideNumber={activeSlide?.slideNumber ?? 1}
          totalSlides={slides.length}
        />
        <RightPanel
          templateId={template._id}
          chatMessages={chatMessages}
          fields={fields}
        />
      </div>
      <ActionBar />
    </div>
  );
}
