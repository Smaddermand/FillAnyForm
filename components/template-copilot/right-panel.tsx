"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Send,
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const messages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "I found 12 fields that need input. I can fill 8 from your description and need 4 clarifications.",
    timestamp: "10:22 AM",
  },
  {
    id: "2",
    role: "assistant",
    content: "What is the project name?",
    timestamp: "10:22 AM",
  },
  {
    id: "3",
    role: "user",
    content: "AI-Powered Customer Insights Platform",
    timestamp: "10:23 AM",
  },
  {
    id: "4",
    role: "assistant",
    content: "What yearly benefit is expected?\n(Example: $1.2M or 15% cost savings)",
    timestamp: "10:23 AM",
  },
]

interface FieldReviewItem {
  id: string
  number: number
  field: string
  suggestedValue: string
  status: "ready" | "needs-input" | "review"
}

const fieldReviewItems: FieldReviewItem[] = [
  { id: "1", number: 1, field: "Project name", suggestedValue: "AI-Powered Customer Insights Platform", status: "ready" },
  { id: "2", number: 2, field: "Business owner", suggestedValue: "Jane Doe, VP of Marketing", status: "ready" },
  { id: "3", number: 3, field: "Expected benefit (yearly)", suggestedValue: "—", status: "needs-input" },
  { id: "4", number: 4, field: "Risks", suggestedValue: "Data quality; user adoption", status: "review" },
  { id: "5", number: 5, field: "Decision needed", suggestedValue: "Approve budget & resources", status: "ready" },
]

export function RightPanel() {
  const [inputValue, setInputValue] = useState("")
  const [isFieldReviewOpen, setIsFieldReviewOpen] = useState(true)

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col shrink-0">
      {/* Header */}
      <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Template Copilot</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {message.role === "assistant" ? (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
              ) : (
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">JD</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground">{message.timestamp}</span>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm max-w-[260px]",
                    message.role === "assistant"
                      ? "bg-muted text-foreground"
                      : "bg-primary/10 text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Field Review Section */}
      <Collapsible open={isFieldReviewOpen} onOpenChange={setIsFieldReviewOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full h-10 border-t border-border px-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Field review</span>
              <span className="text-xs text-muted-foreground">(12 fields)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">8 ready • 4 need input</span>
              {isFieldReviewOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1.2fr_80px] gap-2 px-4 py-2 text-xs text-muted-foreground border-b border-border bg-muted/30">
              <span>Field</span>
              <span>Suggested value</span>
              <span>Status</span>
            </div>

            {/* Table rows */}
            <div className="max-h-48 overflow-y-auto">
              {fieldReviewItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_1.2fr_80px] gap-2 px-4 py-2 text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {item.number}
                    </span>
                    <span className="text-foreground truncate">{item.field}</span>
                  </div>
                  <span className="text-muted-foreground truncate">{item.suggestedValue}</span>
                  <div className="flex items-center gap-1.5">
                    {item.status === "ready" && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs text-green-600">Ready</span>
                      </>
                    )}
                    {item.status === "needs-input" && (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-xs text-rose-500">Needs input</span>
                      </>
                    )}
                    {item.status === "review" && (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs text-amber-500">Review</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View all fields link */}
            <button className="w-full px-4 py-2 text-sm text-primary hover:underline flex items-center gap-1">
              View all fields
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Chat input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 h-9 text-sm"
          />
          <Button size="sm" className="h-9 w-9 p-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
