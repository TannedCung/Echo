"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Switch } from "@/components/ui/switch";

/** localStorage key shared with the no-flash bootstrap script in the layout. */
const STORAGE_KEY = "echo-theme";
const CHANGE_EVENT = "echo-theme-change";

/** Reads the active theme from the DOM (set before paint by the bootstrap script). */
function getSnapshot(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(CHANGE_EVENT, onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    mq.removeEventListener("change", onChange);
  };
}

/**
 * Dark-mode toggle. Sets `data-theme` on <html> (which globals.css keys off,
 * overriding the system preference) and persists the choice. The bootstrap
 * script in the root layout applies the stored value before paint to avoid a
 * flash; `useSyncExternalStore` reflects it without a hydration mismatch.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light");
  const dark = theme === "dark";

  function toggle(next: boolean) {
    const value = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage failures (private mode); the in-session toggle still works
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <span className="inline-flex items-center gap-2">
      {dark ? (
        <Moon className="text-muted-foreground size-4" aria-hidden />
      ) : (
        <Sun className="text-muted-foreground size-4" aria-hidden />
      )}
      <Switch checked={dark} onCheckedChange={toggle} aria-label="Toggle dark mode" />
    </span>
  );
}
