import Link from "next/link";

import { StatusScreen } from "@/components/shared/status-screen";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page not found" };

/**
 * Root not-found for routes outside the authed shell (no top nav here, so we
 * frame the page ourselves and point home).
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <StatusScreen
        title="We can't find that page"
        description="The page you're after may have moved, or the link's gone stale. Let's get you back on track."
      >
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </StatusScreen>
    </main>
  );
}
