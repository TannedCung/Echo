import { cn } from "@/lib/utils";

/**
 * Echo's animation states. The chained speaking pipeline maps to these:
 * idle (waiting) → speaking (examiner TTS) → listening (candidate STT) →
 * thinking (LLM/scoring). Motion lives in globals.css, keyed by `data-state`,
 * so a richer Rive/Lottie asset can later swap in behind this same component.
 */
export type MascotState = "idle" | "listening" | "thinking" | "speaking";

export type MascotSize = "sm" | "md" | "lg";

const SIZE_PX: Record<MascotSize, number> = { sm: 72, md: 120, lg: 184 };

const STATE_LABEL: Record<MascotState, string> = {
  idle: "ready when you are",
  listening: "listening to you",
  thinking: "thinking",
  speaking: "speaking",
};

export interface EchoMascotProps {
  state?: MascotState;
  size?: MascotSize;
  className?: string;
  /** Overrides the default accessible label (otherwise derived from state). */
  label?: string;
}

export function EchoMascot({ state = "idle", size = "md", className, label }: EchoMascotProps) {
  const px = SIZE_PX[size];
  return (
    <div
      role="img"
      aria-label={label ?? `Echo — ${STATE_LABEL[state]}`}
      data-state={state}
      className={cn("echo-mascot", className)}
      style={{ width: px, height: px }}
    >
      <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
        {/* listening — concentric echo rings */}
        <g className="echo-rings">
          <circle className="echo-ring" cx="60" cy="62" r="34" />
          <circle className="echo-ring" cx="60" cy="62" r="34" />
          <circle className="echo-ring" cx="60" cy="62" r="34" />
        </g>

        {/* body */}
        <g className="echo-face-group">
          <circle className="echo-face-fill" cx="60" cy="62" r="34" />
          <ellipse className="echo-highlight" cx="48" cy="48" rx="16" ry="12" />

          {/* eyes */}
          <ellipse className="echo-eye echo-ink" cx="49" cy="58" rx="3.2" ry="4.4" />
          <ellipse className="echo-eye echo-ink" cx="71" cy="58" rx="3.2" ry="4.4" />

          {/* smiling mouth (hidden while speaking) */}
          <path className="echo-mouth" d="M48 70 Q60 80 72 70" />

          {/* speaking — equalizer bars */}
          <g className="echo-bars">
            <rect className="echo-bar echo-ink" x="42" y="62" width="4" height="16" rx="2" />
            <rect className="echo-bar echo-ink" x="50" y="62" width="4" height="16" rx="2" />
            <rect className="echo-bar echo-ink" x="58" y="62" width="4" height="16" rx="2" />
            <rect className="echo-bar echo-ink" x="66" y="62" width="4" height="16" rx="2" />
            <rect className="echo-bar echo-ink" x="74" y="62" width="4" height="16" rx="2" />
          </g>
        </g>

        {/* thinking — bouncing dots above the head */}
        <g className="echo-dots">
          <circle className="echo-dot" cx="50" cy="16" r="3.2" />
          <circle className="echo-dot" cx="60" cy="16" r="3.2" />
          <circle className="echo-dot" cx="70" cy="16" r="3.2" />
        </g>
      </svg>
    </div>
  );
}
