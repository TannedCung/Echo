"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { StatusScreen } from "@/components/shared/status-screen";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the authed shell. Catches a thrown render/data error in
 * any practice/dashboard/report route and offers a recovery path instead of a
 * blank screen — keeping the top nav so the user is never stranded.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in Vercel logs (the digest correlates to the server-side trace).
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      title="Something tripped us up"
      description="That's on us, not you — your progress is safe. Give it another go, or head back and start fresh."
    >
      <Button onClick={reset}>
        <RotateCcw className="size-4" aria-hidden /> Try again
      </Button>
      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </StatusScreen>
  );
}
