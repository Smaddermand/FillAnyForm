"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/template-copilot/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export default function HomePage() {
  const seed = useMutation(api.templates.createTemplateManualSeed);
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  async function handleSeed() {
    setIsSeeding(true);
    setSeedError(null);
    try {
      const id = await seed({});
      router.push(`/templates/${id}`);
    } catch (err) {
      setSeedError(String(err));
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              Real uploads aren&apos;t wired up yet. Seed an example template to
              explore the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="gap-2"
              disabled={isSeeding}
              onClick={handleSeed}
            >
              {isSeeding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isSeeding
                ? "Creating example template..."
                : "Seed example template"}
            </Button>
            {seedError ? (
              <p className="mt-3 text-sm text-destructive">{seedError}</p>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
