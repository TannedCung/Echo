import { EchoMascot } from "@/components/mascot/echo-mascot";

/**
 * Shown inside the authed shell while a route's server data is in flight
 * (dashboard stats, progress history, a saved report). Echo "thinks" so the
 * wait feels intentional rather than blank.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center"
    >
      <EchoMascot state="thinking" size="lg" />
      <p className="text-muted-foreground text-sm font-medium">Getting things ready…</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
