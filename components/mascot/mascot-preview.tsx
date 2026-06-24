"use client";

import { useEffect, useState } from "react";

import { EchoMascot, type MascotSize, type MascotState } from "./echo-mascot";

const CYCLE: MascotState[] = ["idle", "speaking", "listening", "thinking"];

const CAPTION: Record<MascotState, string> = {
  idle: "Ready when you are",
  speaking: "Echo speaks (Hear it)",
  listening: "Echo listens (Say it)",
  thinking: "Echo scores (Own it)",
};

/**
 * Cycles Echo through its four states so the mascot can be previewed before the
 * live speaking pipeline (M3/M4) drives it for real.
 */
export function MascotPreview({ size = "lg" }: { size?: MascotSize }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % CYCLE.length), 2600);
    return () => clearInterval(timer);
  }, []);

  const state = CYCLE[index];

  return (
    <div className="flex flex-col items-center gap-4">
      <EchoMascot state={state} size={size} />
      <span
        aria-live="polite"
        className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
      >
        {CAPTION[state]}
      </span>
    </div>
  );
}
