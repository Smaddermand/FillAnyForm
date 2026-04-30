"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useMutation } from "convex/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

type ReviewUiStatus = "ready" | "needs-input" | "review";

function fieldStatusToReviewUi(
  status: Doc<"fields">["status"],
): ReviewUiStatus {
  if (status === "approved") return "ready";
  if (status === "needs_input") return "needs-input";
  return "review";
}

interface RightPanelProps {
  templateId: Id<"templates">;
  chatMessages: Doc<"chatMessages">[];
  fields: Doc<"fields">[];
}

export function RightPanel({
  templateId,
  chatMessages,
  fields,
}: RightPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFieldReviewOpen, setIsFieldReviewOpen] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const approveField = useMutation(api.fields.approveField);
  const updateFieldValue = useMutation(api.fields.updateFieldValue);
  const rejectField = useMutation(api.fields.rejectField);
  const bulkApproveFields = useMutation(api.fields.bulkApproveFields);
  const sendMessage = useMutation(api.chat.sendMessage);

  const [pendingFieldId, setPendingFieldId] = useState<Id<"fields"> | null>(
    null,
  );
  const [isBulkApproving, setIsBulkApproving] = useState(false);
  const [editingField, setEditingField] = useState<Doc<"fields"> | null>(
    null,
  );
  const [editValue, setEditValue] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

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

  const suggestedCount = useMemo(
    () =>
      fields.filter(
        (f) => f.status === "suggested" && Boolean(f.suggestedValue),
      ).length,
    [fields],
  );

  async function runRowAction(
    fieldId: Id<"fields">,
    action: () => Promise<unknown>,
  ) {
    setPendingFieldId(fieldId);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setPendingFieldId(null);
    }
  }

  function openEdit(field: Doc<"fields">) {
    setEditingField(field);
    setEditValue(field.approvedValue ?? field.suggestedValue ?? "");
    setActionError(null);
  }

  async function handleSaveEdit() {
    if (!editingField) return;
    setPendingFieldId(editingField._id);
    setActionError(null);
    try {
      await updateFieldValue({ fieldId: editingField._id, value: editValue });
      setEditingField(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setPendingFieldId(null);
    }
  }

  async function handleBulkApprove() {
    setIsBulkApproving(true);
    setActionError(null);
    try {
      await bulkApproveFields({ templateId });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBulkApproving(false);
    }
  }

  const rowActionBusy = pendingFieldId !== null || isBulkApproving;

  async function handleSendMessage() {
    const content = inputValue.trim();
    if (!content) return;
    setIsSendingMessage(true);
    setChatError(null);
    try {
      await sendMessage({ templateId, content });
      setInputValue("");
    } catch (err) {
      setChatError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSendingMessage(false);
    }
  }

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
            <div className="grid grid-cols-[1fr_1.2fr_80px_auto] gap-2 px-4 py-2 text-xs text-muted-foreground border-b border-border bg-muted/30 items-center">
              <span>Field</span>
              <span>Suggested value</span>
              <span>Status</span>
              <span className="sr-only">Actions</span>
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
                  const canApprove =
                    Boolean(item.suggestedValue) &&
                    (item.status === "suggested" ||
                      item.status === "rejected");
                  const showReject =
                    item.status === "suggested" ||
                    item.status === "approved" ||
                    item.status === "rejected";

                  return (
                    <div
                      key={item._id}
                      className="group grid grid-cols-[1fr_1.2fr_80px_auto] gap-2 px-4 py-2 text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors items-center"
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
                      <div className="flex justify-end w-8 shrink-0">
                        {pendingFieldId === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={rowActionBusy}
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground"
                                aria-label="Field actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              {canApprove ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    runRowAction(item._id, () =>
                                      approveField({ fieldId: item._id }),
                                    )
                                  }
                                >
                                  Approve
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem onClick={() => openEdit(item)}>
                                Edit value
                              </DropdownMenuItem>
                              {showReject ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    runRowAction(item._id, () =>
                                      rejectField({ fieldId: item._id }),
                                    )
                                  }
                                >
                                  Reject
                                </DropdownMenuItem>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border">
              <button
                type="button"
                disabled={isBulkApproving || suggestedCount === 0}
                onClick={handleBulkApprove}
                className="px-4 py-2 text-sm text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                {isBulkApproving ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : null}
                Approve all suggested ({suggestedCount})
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all fields
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {actionError ? (
              <p className="px-4 pb-2 text-xs text-destructive">{actionError}</p>
            ) : null}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Dialog
        open={editingField !== null}
        onOpenChange={(open) => {
          if (!open) setEditingField(null);
        }}
      >
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingField ? `Edit "${editingField.label}"` : "Edit field"}
            </DialogTitle>
          </DialogHeader>
          {editingField?.type === "longText" ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-28 text-sm"
              rows={5}
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
            />
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingField(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={pendingFieldId !== null}
            >
              {pendingFieldId !== null ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleSendMessage();
              }
            }}
            className="flex-1 h-9 text-sm"
            disabled={isSendingMessage}
          />
          <Button
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => void handleSendMessage()}
            disabled={isSendingMessage || inputValue.trim().length === 0}
          >
            {isSendingMessage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        {chatError ? (
          <p className="mt-2 text-xs text-destructive">{chatError}</p>
        ) : null}
      </div>
    </div>
  );
}
