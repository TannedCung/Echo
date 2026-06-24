import * as React from "react";

import { cn } from "@/lib/utils";

/** Optional soft brand tint for highlight cards (no gradients — calm fills). */
type CardTint = "primary" | "accent" | "success" | "warning";

const TINTS: Record<CardTint, string> = {
  primary: "bg-primary-soft border-transparent",
  accent: "bg-accent-soft border-transparent",
  success: "bg-success-soft border-transparent",
  warning: "bg-warning-soft border-transparent",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tint?: CardTint;
}

/** Friendly surface: rounded, soft border, gentle shadow. Sits above paper. */
export function Card({ className, tint, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border-border bg-card rounded-2xl border p-6 shadow-sm",
        tint && TINTS[tint],
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-bold", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />;
}
