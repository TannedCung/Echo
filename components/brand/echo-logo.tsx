import { cn } from "@/lib/utils";

/**
 * Echo logo — the abstract "echo" mark (a source dot with two emanating waves)
 * in a friendly squircle, plus the wordmark. Variants cover the full lockup,
 * mark-only (favicon/avatar), and wordmark-only. `tone="mono"` renders the whole
 * lockup in a single currentColor (footers, dark grounds). Mirrors the Echo
 * Design System `EchoLogo`.
 */
export type EchoLogoVariant = "full" | "mark" | "wordmark";

interface EchoLogoProps {
  variant?: EchoLogoVariant;
  /** Mark size in px (the wordmark scales from it). */
  size?: number;
  tone?: "color" | "mono";
  title?: string;
  className?: string;
}

function Mark({ s, mono }: { s: number; mono: boolean }) {
  const badgeFill = mono ? "currentColor" : "var(--color-primary)";
  const glyph = mono ? "var(--color-card, #fff)" : "#fff";
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className="block flex-none"
    >
      <rect width="64" height="64" rx="18" fill={badgeFill} />
      <circle cx="23" cy="32" r="4.2" fill={glyph} />
      <path
        d="M33 22 Q41.5 32 33 42"
        stroke={glyph}
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 16 Q52 32 40 48"
        stroke={glyph}
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
    </svg>
  );
}

export function EchoLogo({
  variant = "full",
  size = 32,
  tone = "color",
  title = "Echo",
  className,
}: EchoLogoProps) {
  const mono = tone === "mono";
  const word = (
    <span
      className="leading-none font-extrabold tracking-tight"
      style={{
        fontSize: variant === "wordmark" ? size : size * 0.92,
        color: mono ? "currentColor" : "var(--color-foreground)",
      }}
    >
      Echo
    </span>
  );

  if (variant === "mark") {
    return (
      <span role="img" aria-label={title} className={cn("inline-flex", className)}>
        <Mark s={size} mono={mono} />
      </span>
    );
  }
  if (variant === "wordmark") {
    return (
      <span role="img" aria-label={title} className={cn("inline-flex", className)}>
        {word}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={title}
      className={cn("inline-flex items-center", className)}
      style={{ gap: size * 0.34 }}
    >
      <Mark s={size} mono={mono} />
      {word}
    </span>
  );
}
