"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Friendly toggle switch — pill track, sliding knob. On = primary teal.
 * Pair with a label for settings (captions, reduced motion, dark mode).
 */
interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  id,
  className,
  ...rest
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={rest["aria-label"]}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        "relative h-7 w-[46px] flex-none rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-border",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] size-[22px] rounded-full bg-white shadow-sm transition-[left] duration-200 ease-[cubic-bezier(.2,.8,.2,1)]",
          checked ? "left-[21px]" : "left-[3px]",
        )}
      />
    </button>
  );
}
