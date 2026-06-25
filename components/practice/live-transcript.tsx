"use client";

import { useEffect, useRef } from "react";

import type { ConversationTurn } from "@/lib/conversation/types";
import { cn } from "@/lib/utils";

/**
 * Renders the running conversation as chat bubbles in a bounded, auto-scrolling
 * panel: as new turns (or streaming text) arrive it sticks to the bottom so the
 * latest line is always visible without pushing the mascot off-screen. Interim
 * (still-transcribing) turns are shown dimmed and italic.
 */
export function LiveTranscript({
  turns,
  className,
}: {
  turns: ConversationTurn[];
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stick to the bottom whenever the conversation grows or the tail text changes.
  const lastText = turns[turns.length - 1]?.text ?? "";
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [turns.length, lastText]);

  if (turns.length === 0) {
    return (
      <p className={cn("text-muted-foreground text-center text-sm", className)}>
        Your conversation with Echo will appear here.
      </p>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn("max-h-[42vh] overflow-y-auto scroll-smooth pr-1", className)}
      role="log"
      aria-live="polite"
      aria-label="Conversation transcript"
    >
      <ul className="flex flex-col gap-3">
        {turns.map((turn, index) => (
          <li
            key={index}
            className={cn("flex", turn.role === "candidate" ? "justify-end" : "justify-start")}
          >
            <span
              className={cn(
                "max-w-[80%] rounded-[var(--radius)] px-4 py-2 text-sm leading-relaxed",
                turn.role === "candidate"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
                turn.partial && "italic opacity-60",
              )}
            >
              {turn.text || (turn.partial ? "…" : "")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
