import type { ConversationTurn } from "@/lib/conversation/types";
import { cn } from "@/lib/utils";

/**
 * Renders the running conversation as chat bubbles. Interim (still-transcribing)
 * turns are shown dimmed and italic. Presentational only — the engine owns state.
 */
export function LiveTranscript({
  turns,
  className,
}: {
  turns: ConversationTurn[];
  className?: string;
}) {
  if (turns.length === 0) {
    return (
      <p className={cn("text-muted-foreground text-center text-sm", className)}>
        Your conversation with Echo will appear here.
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-3", className)}>
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
  );
}
