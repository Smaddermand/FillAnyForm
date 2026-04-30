"use client";

import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Download,
  Loader2,
  MoreVertical,
  Sparkles,
} from "lucide-react";

interface ActionBarProps {
  templateId: Id<"templates">;
  fields: Doc<"fields">[];
  latestGenerationJob: Doc<"generationJobs"> | null;
}

function getCtaLines(
  job: Doc<"generationJobs"> | null,
): { primary: string; subtitle: string } {
  const status = job?.status ?? null;
  if (!status) {
    return {
      primary: "Generate filled PowerPoint",
      subtitle: "Creates a new file with filled fields",
    };
  }
  if (status === "queued") {
    return { primary: "Generating...", subtitle: "Queued" };
  }
  if (status === "running") {
    return { primary: "Generating...", subtitle: "Running" };
  }
  if (status === "complete" && job) {
    const completedAt = job.completedAt;
    const when =
      completedAt !== undefined
        ? formatDistanceToNow(new Date(completedAt), { addSuffix: true })
        : "just now";
    return {
      primary: "Regenerate filled PowerPoint",
      subtitle: `Last run completed ${when}`,
    };
  }
  if (status === "failed") {
    return {
      primary: "Generate filled PowerPoint",
      subtitle: "Last run failed — try again",
    };
  }
  return {
    primary: "Generate filled PowerPoint",
    subtitle: "Creates a new file with filled fields",
  };
}

export function ActionBar({
  templateId,
  fields,
  latestGenerationJob,
}: ActionBarProps) {
  const startGeneration = useMutation(api.jobs.startGeneration);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missingRequired = fields.some(
    (f) => f.required && f.status !== "approved",
  );
  const jobStatus = latestGenerationJob?.status ?? null;
  const isJobActive =
    jobStatus === "queued" || jobStatus === "running";

  const { primary, subtitle: baseSubtitle } = getCtaLines(
    latestGenerationJob,
  );
  const subtitle =
    missingRequired && !isJobActive
      ? "Approve all required fields first"
      : baseSubtitle;

  const ctaDisabled = isStarting || isJobActive || missingRequired;
  const showSpinner = isJobActive || isStarting;
  const downloadDisabled =
    !latestGenerationJob || latestGenerationJob.status !== "complete";

  async function handleGenerate() {
    setIsStarting(true);
    setError(null);
    try {
      await startGeneration({ templateId });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <footer className="h-20 border-t border-border bg-card px-6 flex items-center justify-between shrink-0">
      {/* Left: Safety note */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Only approved fields will be changed.
              </span>
              <span className="text-sm text-muted-foreground">
                Layout and branding preserved.
              </span>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:underline ml-2"
            >
              Learn more
            </button>
          </div>
          {error ? (
            <p className="text-destructive text-xs mt-1">{error}</p>
          ) : null}
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="lg"
          className="gap-2 px-6 h-12 text-base font-medium"
          disabled={ctaDisabled}
          onClick={handleGenerate}
        >
          {showSpinner ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <div className="flex flex-col items-start">
            <span>{primary}</span>
            <span className="text-xs font-normal opacity-80">{subtitle}</span>
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="gap-2 px-5 h-12"
          disabled={downloadDisabled}
        >
          <Download className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Download .pptx</span>
            <span className="text-xs text-muted-foreground">
              Download current filled file
            </span>
          </div>
        </Button>

        <Button variant="outline" size="icon" className="h-12 w-12">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </footer>
  );
}
