import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  templates: defineTable({
    name: v.string(),
    status: v.union(
      v.literal("uploaded"),
      v.literal("analyzing"),
      v.literal("ready"),
      v.literal("failed"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    error: v.optional(v.string()),
  }).index("by_createdAt", ["createdAt"]),

  slides: defineTable({
    templateId: v.id("templates"),
    slideNumber: v.number(),
    title: v.optional(v.string()),
    thumbnailFileId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  }).index("by_templateId", ["templateId"]),

  fields: defineTable({
    templateId: v.id("templates"),
    slideId: v.optional(v.id("slides")),
    key: v.string(),
    label: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("number"),
      v.literal("currency"),
      v.literal("date"),
      v.literal("choice"),
      v.literal("longText"),
    ),
    required: v.boolean(),
    status: v.union(
      v.literal("needs_input"),
      v.literal("suggested"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    suggestedValue: v.optional(v.string()),
    approvedValue: v.optional(v.string()),
    confidence: v.optional(v.number()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_templateId", ["templateId"])
    .index("by_templateId_and_status", ["templateId", "status"]),

  chatMessages: defineTable({
    templateId: v.id("templates"),
    role: v.union(
      v.literal("assistant"),
      v.literal("user"),
      v.literal("system"),
    ),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_templateId", ["templateId"]),

  generationJobs: defineTable({
    templateId: v.id("templates"),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("complete"),
      v.literal("failed"),
    ),
    outputFileId: v.optional(v.id("_storage")),
    error: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_templateId", ["templateId"]),

  auditEvents: defineTable({
    templateId: v.id("templates"),
    actorId: v.optional(v.string()),
    action: v.string(),
    details: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_templateId", ["templateId"]),
});
