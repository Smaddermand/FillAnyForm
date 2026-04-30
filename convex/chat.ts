import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: { templateId: v.id("templates"), content: v.string() },
  handler: async (ctx, { templateId, content }) => {
    const now = Date.now();

    await ctx.db.insert("chatMessages", {
      templateId,
      role: "user",
      content,
      createdAt: now,
    });

    await ctx.db.insert("chatMessages", {
      templateId,
      role: "assistant",
      content: `Got it: ${content}`,
      createdAt: now + 1,
    });

    return null;
  },
});

