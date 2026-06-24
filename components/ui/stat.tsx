import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** A single dashboard metric: an icon halo, a big value, a label and a hint. */
export type StatTone = "primary" | "accent" | "success" | "warning";

const HALOS: Record<StatTone, string> = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

interface StatProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: StatTone;
  className?: string;
}

export function Stat({ icon: Icon, label, value, hint, tone = "primary", className }: StatProps) {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <span className={cn("flex size-10 items-center justify-center rounded-full", HALOS[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
    </Card>
  );
}
