import * as React from "react";

import { cn } from "@/lib/utils";

/** Friendly text input — rounded, soft border, calm focus ring. */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "border-input bg-card text-foreground focus-visible:ring-ring focus-visible:ring-offset-background h-11 w-full rounded-[var(--radius-md)] border px-4 text-sm transition-[box-shadow,border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        invalid && "border-destructive",
        className,
      )}
      {...props}
    />
  );
});
