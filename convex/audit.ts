import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

type AuditInput = {
  templateId: Id<"templates">;
  action: string;
  details?: Doc<"auditEvents">["details"];
};

export async function logAuditEvent(
  ctx: Pick<MutationCtx, "db">,
  { templateId, action, details }: AuditInput,
) {
  await ctx.db.insert("auditEvents", {
    templateId,
    action,
    details,
    createdAt: Date.now(),
  });
}

