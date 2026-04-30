import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
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
    await ctx.scheduler.runAfter(1500, internal.jobs.finalizeJob, { jobId });

    return null;
  },
});

export const finalizeJob = internalAction({
  args: { jobId: v.id("generationJobs") },
  handler: async (ctx, { jobId }) => {
    const json = JSON.stringify(
      {
        jobId,
        generatedAt: new Date().toISOString(),
        note: "Placeholder generation output. Replace with real PPTX bytes once generation is implemented.",
      },
      null,
      2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const outputFileId = await ctx.storage.store(blob);
    await ctx.runMutation(internal.jobs.completeJob, { jobId, outputFileId });
    return null;
  },
});

export const completeJob = internalMutation({
  args: {
    jobId: v.id("generationJobs"),
    outputFileId: v.id("_storage"),
  },
  handler: async (ctx, { jobId, outputFileId }) => {
    const job = await ctx.db.get("generationJobs", jobId);
    if (!job) return null;

    await ctx.db.patch(jobId, {
      status: "complete",
      outputFileId,
      completedAt: Date.now(),
    });
    return null;
  },
});
