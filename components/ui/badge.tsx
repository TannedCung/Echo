import * as React from "react";

import { cn } from "@/lib/utils";

/** Small status/category pill. Soft brand grounds keep it calm, not loud. */
export type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs leading-tight font-semibold",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
