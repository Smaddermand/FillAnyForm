"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { WorkspaceShell } from "@/components/template-copilot/workspace-shell";
import { WorkspaceSkeleton } from "@/components/template-copilot/workspace-skeleton";
import { TemplateNotFound } from "@/components/template-copilot/template-not-found";

export default function TemplateWorkspacePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId: rawId } = use(params);
  const templateId = rawId as Id<"templates">;
  const data = useQuery(api.templates.getTemplateWorkspace, { templateId });

  if (data === undefined) return <WorkspaceSkeleton />;
  if (data.template === null) return <TemplateNotFound />;

  return (
    <WorkspaceShell
      template={data.template}
      slides={data.slides}
      fields={data.fields}
      chatMessages={data.chatMessages}
      latestGenerationJob={data.latestGenerationJob}
    />
  );
}
