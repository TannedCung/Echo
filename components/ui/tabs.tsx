"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A small pill-track tab switcher. The active tab lifts onto a card surface
 * with a soft shadow; the track itself is a calm muted groove. Controlled by
 * the parent so each screen owns its own tab state.
 */
export interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}

export function Tabs({ tabs, value, onValueChange, className, ...rest }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={rest["aria-label"]}
      className={cn("bg-muted inline-flex gap-1 rounded-full p-1", className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
