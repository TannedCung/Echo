import Link from "next/link";

import { StatusScreen } from "@/components/shared/status-screen";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Not found" };

/**
 * In-shell not-found — what a missing or already-deleted report (or any stale
 * authed link) lands on. Keeps the top nav so the user can carry on.
 */
export default function AppNotFound() {
  return (
    <StatusScreen
      title="We can't find that"
      description="This session or page may have moved, or the link's gone stale. Let's pick up somewhere solid."
    >
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <Link href="/practice/speaking">Start practising</Link>
      </Button>
    </StatusScreen>
  );
}
