import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const approveField = mutation({
  args: { fieldId: v.id("fields") },
  handler: async (ctx, { fieldId }) => {
    const field = await ctx.db.get("fields", fieldId);
    if (!field) throw new Error("Field not found");
    const value = field.suggestedValue;
    if (!value) throw new Error("Field has no suggested value to approve");
    await ctx.db.patch(fieldId, {
      status: "approved",
      approvedValue: value,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const updateFieldValue = mutation({
  args: { fieldId: v.id("fields"), value: v.string() },
  handler: async (ctx, { fieldId, value }) => {
    const field = await ctx.db.get("fields", fieldId);
    if (!field) throw new Error("Field not found");
    await ctx.db.patch(fieldId, {
      status: "approved",
      approvedValue: value,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const rejectField = mutation({
  args: { fieldId: v.id("fields") },
  handler: async (ctx, { fieldId }) => {
    const field = await ctx.db.get("fields", fieldId);
    if (!field) throw new Error("Field not found");
    await ctx.db.patch(fieldId, {
      status: "rejected",
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const bulkApproveFields = mutation({
  args: { templateId: v.id("templates") },
  handler: async (ctx, { templateId }) => {
    const candidates = await ctx.db
      .query("fields")
      .withIndex("by_templateId_and_status", (q) =>
        q.eq("templateId", templateId).eq("status", "suggested"),
      )
      .collect();
    const now = Date.now();
    let approved = 0;
    for (const f of candidates) {
      if (!f.suggestedValue) continue;
      await ctx.db.patch(f._id, {
        status: "approved",
        approvedValue: f.suggestedValue,
        updatedAt: now,
      });
      approved++;
    }
    return { approved };
  },
});
