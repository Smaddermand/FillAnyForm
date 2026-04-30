"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Doc } from "@/convex/_generated/dataModel";

type ReviewUiStatus = "ready" | "needs-input" | "review";

function fieldStatusToReviewUi(
  status: Doc<"fields">["status"],
): ReviewUiStatus {
  if (status === "approved") return "ready";
  if (status === "needs_input") return "needs-input";
  return "review";
}

interface RightPanelProps {
  chatMessages: Doc<"chatMessages">[];
  fields: Doc<"fields">[];
}

export function RightPanel({ chatMessages, fields }: RightPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFieldReviewOpen, setIsFieldReviewOpen] = useState(true);

  const sortedFields = useMemo(
    () => [...fields].sort((a, b) => a.order - b.order),
    [fields],
  );

  const approvedCount = useMemo(
    () => fields.filter((f) => f.status === "approved").length,
    [fields],
  );

  const needsInputCount = useMemo(
    () => fields.filter((f) => f.status === "needs_input").length,
    [fields],
  );

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col shrink-0">
      {/* Header */}
      <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Template Copilot</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">
          {chatMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message._id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse",
                )}
              >
                {message.role === "system" ? (
                  <div className="w-8 shrink-0" aria-hidden />
                ) : message.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                ) : (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      JD
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(message.createdAt), "h:mm a")}
                  </span>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm max-w-[260px]",
                      message.role === "assistant" || message.role === "system"
                        ? "bg-muted text-foreground"
                        : "bg-primary/10 text-foreground",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Field Review Section */}
      <Collapsible open={isFieldReviewOpen} onOpenChange={setIsFieldReviewOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full h-10 border-t border-border px-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Field review
              </span>
              <span className="text-xs text-muted-foreground">
                ({fields.length} fields)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {approvedCount} ready • {needsInputCount} need input
              </span>
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
              {sortedFields.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No fields yet.
                </div>
              ) : (
                sortedFields.map((item) => {
                  const uiStatus = fieldStatusToReviewUi(item.status);
                  const displayValue =
                    item.approvedValue ?? item.suggestedValue ?? "—";
                  return (
                    <div
                      key={item._id}
                      className="grid grid-cols-[1fr_1.2fr_80px] gap-2 px-4 py-2 text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors items-center"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {item.order}
                        </span>
                        <span className="text-foreground truncate">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-muted-foreground truncate">
                        {displayValue}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {uiStatus === "ready" && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs text-green-600">Ready</span>
                          </>
                        )}
                        {uiStatus === "needs-input" && (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-xs text-rose-500">
                              Needs input
                            </span>
                          </>
                        )}
                        {uiStatus === "review" && (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs text-amber-500">Review</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* View all fields link */}
            <button
              type="button"
              className="w-full px-4 py-2 text-sm text-primary hover:underline flex items-center gap-1"
            >
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
  );
}
