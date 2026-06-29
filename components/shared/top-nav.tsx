import Link from "next/link";

import { EchoLogo } from "@/components/brand/echo-logo";
import { PRIMARY_NAV } from "@/components/shared/nav-links";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";

interface TopNavProps {
  name?: string | null;
  isGuest?: boolean;
}

export function TopNav({ name, isGuest }: TopNavProps) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/dashboard" aria-label="Echo — dashboard">
          <EchoLogo size={26} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu name={name} isGuest={isGuest} />
        </div>
      </div>
    </header>
  );
}
