"use client";

import { Header } from "./header";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceSkeleton() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="h-14 border-b border-border bg-card px-4 flex items-center gap-3 shrink-0">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-36 ml-auto hidden sm:block" />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-16 border-r border-border bg-card flex flex-col shrink-0 p-2 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-12 h-12 rounded-lg mx-auto" />
          ))}
        </div>
        <div className="w-56 border-r border-border bg-card flex flex-col shrink-0 p-3 gap-3">
          <Skeleton className="h-4 w-16" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-lg" />
          ))}
        </div>
        <div className="flex-1 bg-muted/30 flex flex-col min-w-0">
          <div className="flex-1 flex items-center justify-center p-6">
            <Skeleton className="w-full max-w-4xl aspect-video rounded-lg" />
          </div>
          <div className="h-12 border-t border-border bg-card px-4 flex items-center gap-2 shrink-0">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-7 w-24 ml-auto" />
          </div>
        </div>
        <div className="w-96 border-l border-border bg-card flex flex-col shrink-0">
          <div className="h-12 border-b border-border px-4 flex items-center shrink-0">
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex-1 p-4 space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 m-3 rounded-md" />
        </div>
      </div>
      <div className="h-20 border-t border-border bg-card px-6 flex items-center shrink-0 gap-4">
        <Skeleton className="h-10 flex-1 max-w-md" />
        <Skeleton className="h-12 w-56" />
      </div>
    </div>
  );
}
