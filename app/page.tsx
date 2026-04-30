"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/template-copilot/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";

function isValidPptx(f: File) {
  return f.name.toLowerCase().endsWith(".pptx");
}

export default function HomePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createTemplateFromUpload = useMutation(
    api.templates.createTemplateFromUpload,
  );
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<"idle" | "uploading" | "creating">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const isBusy = phase !== "idle";

  async function handleUpload() {
    if (!file) return;
    if (!isValidPptx(file)) {
      setError("Please choose a .pptx file.");
      return;
    }
    setError(null);
    try {
      setPhase("uploading");
      const url = await generateUploadUrl({});
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type":
            file.type ||
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        },
        body: file,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      setPhase("creating");
      const templateId = await createTemplateFromUpload({
        name: file.name,
        originalFileId: storageId,
      });
      router.push(`/templates/${templateId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("idle");
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Upload a PowerPoint template</CardTitle>
            <CardDescription>
              Select a .pptx file. We&apos;ll analyze it and open the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              type="file"
              accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              disabled={isBusy}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setError(
                  f && !isValidPptx(f) ? "Please choose a .pptx file." : null,
                );
              }}
            />
            <Button
              size="lg"
              className="gap-2 self-start"
              disabled={isBusy || !file || !isValidPptx(file)}
              onClick={() => void handleUpload()}
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {phase === "uploading"
                ? "Uploading..."
                : phase === "creating"
                  ? "Creating template..."
                  : "Upload .pptx"}
            </Button>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
