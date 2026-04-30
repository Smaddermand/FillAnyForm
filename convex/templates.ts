import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const createTemplateManualSeed = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const templateId = await ctx.db.insert("templates", {
      name: "Project Approval Template v3.pptx",
      status: "ready",
      createdAt: now,
      updatedAt: now,
    });

    const slideSpecs = [
      { slideNumber: 1, title: "Project Approval Request" },
      { slideNumber: 2, title: "Business Case" },
      { slideNumber: 3, title: "Decision" },
    ] as const;

    const slideIds: Id<"slides">[] = [];
    for (const s of slideSpecs) {
      const id = await ctx.db.insert("slides", {
        templateId,
        slideNumber: s.slideNumber,
        title: s.title,
        createdAt: now,
      });
      slideIds.push(id);
    }

    const [slideTitle, slideBusinessCase, slideDecision] = slideIds;

    const fieldSeeds: Array<Omit<Doc<"fields">, "_id" | "_creationTime">> = [
      {
        templateId,
        slideId: slideTitle,
        key: "project-name",
        label: "Project name",
        type: "text",
        required: true,
        status: "approved",
        suggestedValue: undefined,
        approvedValue: "AI-Powered Customer Insights Platform",
        confidence: undefined,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideTitle,
        key: "business-owner",
        label: "Business owner",
        type: "text",
        required: true,
        status: "approved",
        suggestedValue: undefined,
        approvedValue: "Jane Doe, VP of Marketing",
        confidence: undefined,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideTitle,
        key: "expected-benefit",
        label: "Expected benefit (yearly)",
        type: "currency",
        required: true,
        status: "suggested",
        suggestedValue: "$1.2M annual revenue uplift",
        approvedValue: undefined,
        confidence: 0.82,
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideTitle,
        key: "risks",
        label: "Risks",
        type: "longText",
        required: false,
        status: "suggested",
        suggestedValue: "Data quality; user adoption",
        approvedValue: undefined,
        confidence: 0.71,
        order: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideTitle,
        key: "decision-needed",
        label: "Decision needed",
        type: "text",
        required: true,
        status: "needs_input",
        suggestedValue: undefined,
        approvedValue: undefined,
        confidence: undefined,
        order: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideBusinessCase,
        key: "project-sponsor",
        label: "Project sponsor",
        type: "text",
        required: true,
        status: "approved",
        suggestedValue: undefined,
        approvedValue: "Alex Rivera, CIO",
        confidence: undefined,
        order: 6,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideBusinessCase,
        key: "budget-requested",
        label: "Budget requested",
        type: "currency",
        required: true,
        status: "suggested",
        suggestedValue: "$450,000",
        approvedValue: undefined,
        confidence: 0.68,
        order: 7,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideBusinessCase,
        key: "success-metrics",
        label: "Success metrics",
        type: "text",
        required: false,
        status: "suggested",
        suggestedValue: "CSAT +12 pts; time-to-insight -40%",
        approvedValue: undefined,
        confidence: 0.74,
        order: 8,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideDecision,
        key: "target-launch-date",
        label: "Target launch date",
        type: "date",
        required: true,
        status: "needs_input",
        suggestedValue: undefined,
        approvedValue: undefined,
        confidence: undefined,
        order: 9,
        createdAt: now,
        updatedAt: now,
      },
      {
        templateId,
        slideId: slideDecision,
        key: "project-status",
        label: "Project status",
        type: "choice",
        required: true,
        status: "suggested",
        suggestedValue: "Draft / Pending approval",
        approvedValue: undefined,
        confidence: 0.65,
        order: 10,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await Promise.all(fieldSeeds.map((row) => ctx.db.insert("fields", row)));

    const chats: Array<Pick<Doc<"chatMessages">, "role" | "content">> = [
      {
        role: "assistant",
        content:
          "I found 10 fields that need input. I can fill 6 from your description and need 4 clarifications.",
      },
      {
        role: "assistant",
        content: "What is the project name?",
      },
      {
        role: "user",
        content: "AI-Powered Customer Insights Platform",
      },
    ];

    await Promise.all(
      chats.map((m, i) =>
        ctx.db.insert("chatMessages", {
          templateId,
          role: m.role,
          content: m.content,
          createdAt: now + i,
        }),
      ),
    );

    return templateId;
  },
});

export const getTemplateWorkspace = query({
  args: { templateId: v.id("templates") },
  handler: async (ctx, { templateId }) => {
    const template = await ctx.db.get("templates", templateId);
    if (!template) {
      return {
        template: null,
        slides: [] as Doc<"slides">[],
        fields: [] as Doc<"fields">[],
        chatMessages: [] as Doc<"chatMessages">[],
        latestGenerationJob: null as Doc<"generationJobs"> | null,
      };
    }

    const [slides, fields, chatMessages, latestGenerationJob] =
      await Promise.all([
        ctx.db
          .query("slides")
          .withIndex("by_templateId", (q) => q.eq("templateId", templateId))
          .collect(),
        ctx.db
          .query("fields")
          .withIndex("by_templateId", (q) => q.eq("templateId", templateId))
          .collect(),
        ctx.db
          .query("chatMessages")
          .withIndex("by_templateId", (q) => q.eq("templateId", templateId))
          .collect(),
        ctx.db
          .query("generationJobs")
          .withIndex("by_templateId", (q) => q.eq("templateId", templateId))
          .order("desc")
          .first(),
      ]);

    return {
      template,
      slides: [...slides].sort((a, b) => a.slideNumber - b.slideNumber),
      fields: [...fields].sort((a, b) => a.order - b.order),
      chatMessages: [...chatMessages].sort((a, b) => a.createdAt - b.createdAt),
      latestGenerationJob,
    };
  },
});
