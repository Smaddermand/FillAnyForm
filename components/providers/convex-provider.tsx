"use client";

import { type ReactNode, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL. Set it in .env.local (run `npx convex dev` to populate it).",
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new ConvexReactClient(convexUrl!));
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
