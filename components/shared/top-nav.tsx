import Link from "next/link";

import { SignOutButton } from "@/components/shared/sign-out-button";

interface TopNavProps {
  name?: string | null;
  isGuest?: boolean;
}

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/practice/speaking", label: "Practice" },
  { href: "/progress", label: "Progress" },
];

export function TopNav({ name, isGuest }: TopNavProps) {
  const displayName = isGuest ? "Guest" : (name?.split(" ")[0] ?? "You");

  return (
    <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/dashboard" className="text-xl font-extrabold tracking-tight">
          <span className="text-primary">Echo</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
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
          <span className="text-muted-foreground hidden text-sm sm:inline">
            {displayName}
            {isGuest ? " · guest" : ""}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
