"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useId, useRef, useState } from "react";

import { PRIMARY_NAV } from "@/components/shared/nav-links";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  name?: string | null;
  isGuest?: boolean;
}

/**
 * Avatar button that opens a small account menu (Settings, Sign out). Built on a
 * plain button + popover panel — closes on outside click or Escape, and the
 * trigger reflects open state for assistive tech.
 */
export function UserMenu({ name, isGuest }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const displayName = isGuest ? "Guest" : name?.trim() || "You";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="bg-primary-soft text-primary focus-visible:ring-ring focus-visible:ring-offset-background flex size-9 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="border-border bg-card absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-[var(--radius-md)] border p-1.5 shadow-lg"
        >
          <div className="flex items-center gap-3 px-2.5 py-2">
            <span className="bg-primary-soft text-primary flex size-9 items-center justify-center rounded-full text-sm font-bold">
              {initial}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">{displayName}</span>
              <span className="text-muted-foreground text-xs">
                {isGuest ? "Guest session" : "Signed in"}
              </span>
            </div>
          </div>

          <div className="bg-border my-1 h-px" />

          {/* Primary navigation — only on small screens, where the top nav is hidden. */}
          <div className="sm:hidden">
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={menuItemClass}
              >
                <link.icon className="size-4" aria-hidden /> {link.label}
              </Link>
            ))}
            <div className="bg-border my-1 h-px" />
          </div>

          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            <Settings className="size-4" aria-hidden /> Settings
          </Link>

          {isGuest && (
            <Link
              href="/onboarding"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={menuItemClass}
            >
              <User className="size-4" aria-hidden /> Set your goal
            </Link>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut({ redirectTo: "/" });
            }}
            className={cn(menuItemClass, "text-destructive hover:bg-destructive/10 w-full")}
          >
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemClass =
  "text-foreground hover:bg-muted flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm font-medium transition-colors";
