"use client";

import Link from "next/link";
import { Header } from "./header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TemplateNotFound() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Template not found</CardTitle>
            <CardDescription>
              This template ID does not exist or was removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
