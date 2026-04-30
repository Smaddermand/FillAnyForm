import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const startGeneration = mutation({
  args: { templateId: v.id("templates") },
  handler: async (ctx, { templateId }) => {
    const latest = await ctx.db
      .query("generationJobs")
      .withIndex("by_templateId", (q) => q.eq("templateId", templateId))
      .order("desc")
      .first();
    if (
      latest &&
      (latest.status === "queued" || latest.status === "running")
    ) {
      throw new Error("A generation job is already in progress");
    }

    const now = Date.now();

    const jobId = await ctx.db.insert("generationJobs", {
      templateId,
      status: "queued",
      createdAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.jobs.runJob, { jobId });
    return jobId;
  },
});

export const runJob = internalMutation({
  args: { jobId: v.id("generationJobs") },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get("generationJobs", jobId);
    if (!job) return null;

    await ctx.db.patch(jobId, { status: "running" });
    await ctx.scheduler.runAfter(1500, internal.jobs.completeJob, { jobId });

    return null;
  },
});

export const completeJob = internalMutation({
  args: { jobId: v.id("generationJobs") },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get("generationJobs", jobId);
    if (!job) return null;

    await ctx.db.patch(jobId, { status: "complete", completedAt: Date.now() });
    return null;
  },
});

