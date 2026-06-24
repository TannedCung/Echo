import * as React from "react";

import { cn } from "@/lib/utils";

/** Friendly surface: rounded, soft border, gentle shadow. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-border bg-card rounded-2xl border p-6 shadow-sm", className)}
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
