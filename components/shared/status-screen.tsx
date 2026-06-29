import type { ReactNode } from "react";

import { EchoMascot, type MascotState } from "@/components/mascot/echo-mascot";

export interface StatusScreenProps {
  /** Which mascot mood to show — defaults to a calm idle. */
  mascotState?: MascotState;
  title: string;
  description: ReactNode;
  /** Action buttons / links rendered below the copy. */
  children?: ReactNode;
}

/**
 * A centered, on-brand full-screen state — used for the App Router error,
 * not-found, and loading boundaries so a stumble still feels like Echo and
 * never blames the learner. Pure presentational (no hooks), so it renders in
 * both Server Components and the "use client" error boundaries.
 */
export function StatusScreen({
  mascotState = "idle",
  title,
  description,
  children,
}: StatusScreenProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 text-center">
      <EchoMascot state={mascotState} size="lg" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children && (
        <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
      )}
    </div>
  );
}
